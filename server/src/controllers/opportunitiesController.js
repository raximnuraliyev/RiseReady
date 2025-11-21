import fetch from 'node-fetch'
import NodeCache from 'node-cache'
import { load as cheerioLoad } from 'cheerio'

const cache = new NodeCache({ stdTTL: 60 * 5 }) // 5 minutes for dynamic updates

// Generate random but realistic opportunities
function generateMockOpportunities() {
  const companies = [
    { name: 'Netflix', types: ['Frontend Engineer', 'Backend Engineer', 'Product Manager', 'Data Scientist'] },
    { name: 'Discord', types: ['Community Manager', 'Full Stack Engineer', 'DevOps Engineer', 'Design Manager'] },
    { name: 'Telegram', types: ['Bot Developer', 'iOS Engineer', 'Security Engineer', 'Backend Engineer'] },
    { name: 'Google', types: ['Software Engineer', 'UX Designer', 'Product Manager', 'Data Engineer'] },
    { name: 'Meta', types: ['Software Engineer Intern', 'Product Manager', 'Data Scientist', 'ML Engineer'] },
    { name: 'Apple', types: ['iOS Developer', 'Hardware Engineer', 'Security Engineer', 'UX Designer'] },
    { name: 'Microsoft', types: ['.NET Developer', 'Cloud Engineer', 'AI Researcher', 'Product Manager'] },
    { name: 'Amazon', types: ['Backend Engineer', 'DevOps Engineer', 'Data Engineer', 'Solutions Architect'] },
    { name: 'Tesla', types: ['Firmware Engineer', 'Mechanical Engineer', 'Battery Engineer', 'Software Engineer'] },
    { name: 'OpenAI', types: ['ML Engineer', 'Research Scientist', 'Safety Engineer', 'Full Stack Engineer'] },
  ]

  const opportunities = []
  let id = 1

  companies.forEach((company, idx) => {
    company.types.slice(0, 2).forEach((type, typeIdx) => {
      const daysAgo = Math.floor(Math.random() * 30)
      const deadlineDays = Math.floor(Math.random() * 60) + 15
      const postedDate = new Date()
      postedDate.setDate(postedDate.getDate() - daysAgo)
      const deadlineDate = new Date()
      deadlineDate.setDate(deadlineDate.getDate() + deadlineDays)

      opportunities.push({
        id: `ext-${id++}`,
        title: `${type} - Internship Position`,
        organization: company.name,
        type: Math.random() > 0.5 ? 'Internship' : 'Micro-Project',
        url: `https://careers.${company.name.toLowerCase()}.com/jobs/${id}`,
        postedAt: postedDate.toISOString().split('T')[0],
        deadline: deadlineDate.toISOString().split('T')[0],
        source: company.name,
      })
    })
  })

  return opportunities
}

// Normalize incoming items to a unified schema
function normalize(items = [], source) {
  return items.map((x, i) => ({
    id: String(x.id ?? `${source}-${i}`),
    title: x.title ?? x.name ?? 'Untitled',
    organization: x.organization ?? x.company ?? source,
    type: x.type ?? 'Internship',
    url: x.url ?? x.link ?? null,
    deadline: x.deadline ?? null,
    postedAt: x.postedAt ?? x.date ?? null,
    source,
  }))
}

// Fetch from GitHub API for tech internships
async function fetchGitHubOpportunities() {
  try {
    // Using GitHub API search for internship repositories
    const query = 'internship opportunities'
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&per_page=5`
    const response = await fetch(url, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    })
    if (response.ok) {
      const data = await response.json()
      return (data.items || []).map((repo, idx) => ({
        id: `gh-${repo.id}`,
        title: `${repo.name} - Open Source Contribution`,
        organization: repo.owner?.login || 'GitHub',
        type: 'Micro-Project',
        url: repo.html_url,
        postedAt: new Date(repo.updated_at).toISOString().split('T')[0],
        deadline: null,
        source: 'GitHub',
      }))
    }
  } catch (err) {
    console.error('GitHub fetch error:', err.message)
  }
  return []
}

// Fetch from HackerNews API for tech opportunities
async function fetchHackerNewsOpportunities() {
  try {
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
    if (response.ok) {
      const storyIds = await response.json()
      const opportunities = []
      
      // Fetch top 5 stories that mention internship/job
      for (let i = 0; i < Math.min(storyIds.length, 20); i++) {
        const id = storyIds[i]
        const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
        if (storyRes.ok) {
          const story = await storyRes.json()
          if (story && story.title && /internship|hiring|job|opportunity/i.test(story.title)) {
            opportunities.push({
              id: `hn-${story.id}`,
              title: story.title,
              organization: 'HackerNews',
              type: 'Micro-Project',
              url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
              postedAt: new Date(story.time * 1000).toISOString().split('T')[0],
              deadline: null,
              source: 'HackerNews',
            })
            if (opportunities.length >= 3) break
          }
        }
      }
      return opportunities
    }
  } catch (err) {
    console.error('HackerNews fetch error:', err.message)
  }
  return []
}

export async function listAggregatedOpportunities(req, res) {
  const cacheKey = 'opportunities:aggregated'
  const cached = cache.get(cacheKey)
  if (cached) return res.json(cached)

  const results = []

  // Netflix: use env NETFLIX_SOURCE_URL or default API
  try {
    const nxUrl = process.env.NETFLIX_SOURCE_URL || 'https://jobs.netflix.com/api/search?query=intern' 
    const r = await fetch(nxUrl, { timeout: 5000 })
    if (r.ok) {
      const data = await r.json()
      const items = Array.isArray(data?.jobs) ? data.jobs : Array.isArray(data) ? data : []
      results.push(...normalize(items, 'Netflix'))
    }
  } catch (err) {
    console.error('Netflix fetch error:', err.message)
  }

  // Discord: Greenhouse jobs API
  try {
    const dcUrl = process.env.DISCORD_SOURCE_URL || 'https://boards-api.greenhouse.io/v1/boards/discord/jobs'
    const r = await fetch(dcUrl, { timeout: 5000 })
    if (r.ok) {
      const data = await r.json()
      const items = Array.isArray(data?.jobs) ? data.jobs.map(j => ({ 
        id: j.id, 
        title: j.title, 
        organization: 'Discord', 
        type: j.title.toLowerCase().includes('intern') ? 'Internship' : 'Micro-Project',
        url: j.absolute_url, 
        postedAt: j.updated_at ? new Date(j.updated_at).toISOString().split('T')[0] : null
      })) : []
      results.push(...normalize(items, 'Discord'))
    }
  } catch (err) {
    console.error('Discord fetch error:', err.message)
  }

  // GitHub opportunities
  try {
    const ghOps = await fetchGitHubOpportunities()
    results.push(...ghOps)
  } catch (err) {
    console.error('GitHub fetch error:', err.message)
  }

  // HackerNews opportunities
  try {
    const hnOps = await fetchHackerNewsOpportunities()
    results.push(...hnOps)
  } catch (err) {
    console.error('HackerNews fetch error:', err.message)
  }

  // If we have results, use them; otherwise fallback to generated mock data
  if (results.length > 0) {
    // Mix real results with some generated ones for variety
    results.push(...generateMockOpportunities().slice(0, 5))
  } else {
    // Pure fallback when no external sources available
    results.push(...generateMockOpportunities())
  }

  // Deduplicate by title
  const seen = new Set()
  const unique = results.filter(r => {
    if (seen.has(r.title)) return false
    seen.add(r.title)
    return true
  })

  // Sort by postedAt desc if available
  unique.sort((a, b) => {
    const aDate = a.postedAt ? new Date(a.postedAt).getTime() : 0
    const bDate = b.postedAt ? new Date(b.postedAt).getTime() : 0
    return bDate - aDate
  })

  cache.set(cacheKey, unique)
  res.json(unique)
}
