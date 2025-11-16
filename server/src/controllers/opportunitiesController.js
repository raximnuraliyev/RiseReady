import fetch from 'node-fetch'
import NodeCache from 'node-cache'
import { load as cheerioLoad } from 'cheerio'

const cache = new NodeCache({ stdTTL: 60 * 10 }) // 10 minutes

// Normalize incoming items to a unified schema
function normalize(items = [], source) {
  return items.map((x, i) => ({
    id: String(x.id ?? `${source}-${i}`),
    title: x.title ?? x.name ?? 'Untitled',
    organization: x.organization ?? x.company ?? source,
    url: x.url ?? x.link ?? null,
    deadline: x.deadline ?? null,
    postedAt: x.postedAt ?? x.date ?? null,
    source,
  }))
}

export async function listAggregatedOpportunities(req, res) {
  const cacheKey = 'opportunities:aggregated'
  const cached = cache.get(cacheKey)
  if (cached) return res.json(cached)

  const results = []

  // Netflix: use env NETFLIX_SOURCE_URL or default API
  try {
    const nxUrl = process.env.NETFLIX_SOURCE_URL || 'https://jobs.netflix.com/api/search?query=' 
    const r = await fetch(nxUrl)
    if (r.ok) {
      const data = await r.json()
      const items = Array.isArray(data?.jobs) ? data.jobs : Array.isArray(data) ? data : []
      results.push(...normalize(items, 'Netflix'))
    }
  } catch {}

  // Discord: Greenhouse jobs API by default
  try {
    const dcUrl = process.env.DISCORD_SOURCE_URL || 'https://boards-api.greenhouse.io/v1/boards/discord/jobs'
    const r = await fetch(dcUrl)
    if (r.ok) {
      const data = await r.json()
      const items = Array.isArray(data?.jobs) ? data.jobs.map(j => ({ id: j.id, title: j.title, organization: 'Discord', url: j.absolute_url, postedAt: j.updated_at })) : Array.isArray(data) ? data : []
      results.push(...normalize(items, 'Discord'))
    }
  } catch {}

  // Telegram: scrape job titles from the page
  try {
    const tgUrl = process.env.TELEGRAM_SOURCE_URL || 'https://telegram.org/jobs'
    const r = await fetch(tgUrl)
    if (r.ok) {
      const html = await r.text()
      const $ = cheerioLoad(html)
      const items = []
      $('h3, h2').each((_, el) => {
        const title = $(el).text().trim()
        if (!title) return
        // Skip non-role headings heuristically
        if (/Telegram stands|How to apply|Responsibilities|Preferred/i.test(title)) return
        items.push({ title, organization: 'Telegram', url: tgUrl })
      })
      results.push(...normalize(items, 'Telegram'))
    }
  } catch {}

  if (results.length === 0) {
    // Fallback sample when no sources configured
    const sample = [
      { id: 'nf-1', title: 'Frontend Engineer Intern', organization: 'Netflix', url: 'https://jobs.netflix.com/', postedAt: new Date().toISOString().slice(0,10), source: 'Netflix' },
      { id: 'dc-1', title: 'Community Manager Intern', organization: 'Discord', url: 'https://discord.com/careers', postedAt: new Date().toISOString().slice(0,10), source: 'Discord' },
      { id: 'tg-1', title: 'Bot Developer Intern', organization: 'Telegram', url: 'https://t.me/jobs', postedAt: new Date().toISOString().slice(0,10), source: 'Telegram' },
    ]
    cache.set(cacheKey, sample)
    return res.json(sample)
  }

  // Sort by postedAt desc if available
  results.sort((a, b) => String(b.postedAt||'').localeCompare(String(a.postedAt||'')))
  cache.set(cacheKey, results)
  res.json(results)
}
