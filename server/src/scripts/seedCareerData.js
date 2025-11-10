import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Mentor, Resource } from '../models/Career.js'

dotenv.config()

const mentors = [
  {
    name: 'Sarah Johnson',
    title: 'Senior UX Designer',
    company: 'Google',
    expertise: ['UX Design', 'User Research', 'Prototyping', 'Design Systems'],
    bio: 'Over 8 years of experience in UX design. Passionate about mentoring aspiring designers.',
    discordId: 'sarahj_ux#1234',
    availability: 'Available',
    rating: 4.9,
    sessionsCount: 47
  },
  {
    name: 'Michael Chen',
    title: 'Product Manager',
    company: 'Meta',
    expertise: ['Product Strategy', 'Roadmapping', 'Agile', 'User Stories'],
    bio: 'Led multiple 0-to-1 product launches. Love helping PMs grow their careers.',
    discordId: 'mchen_pm#5678',
    availability: 'Available',
    rating: 5.0,
    sessionsCount: 62
  },
  {
    name: 'Emily Rodriguez',
    title: 'Frontend Lead',
    company: 'Netflix',
    expertise: ['React', 'TypeScript', 'UI Development', 'Performance Optimization'],
    bio: 'Building delightful user experiences at scale. Happy to mentor frontend developers.',
    discordId: 'emily_dev#9012',
    availability: 'Available',
    rating: 4.8,
    sessionsCount: 38
  },
  {
    name: 'David Kim',
    title: 'Data Scientist',
    company: 'Amazon',
    expertise: ['Python', 'Machine Learning', 'Analytics', 'SQL'],
    bio: 'Turning data into insights. Available for career guidance in data science.',
    discordId: 'dkim_data#3456',
    availability: 'Available',
    rating: 4.7,
    sessionsCount: 29
  },
  {
    name: 'Jessica Williams',
    title: 'Engineering Manager',
    company: 'Microsoft',
    expertise: ['Leadership', 'Team Building', 'System Design', 'Career Growth'],
    bio: 'Leading engineering teams for 5+ years. Mentoring future tech leaders.',
    discordId: 'jwilliams_em#7890',
    availability: 'Limited',
    rating: 4.9,
    sessionsCount: 54
  }
]

const resources = [
  // Resume Templates
  {
    title: 'Tech Resume Template',
    description: 'ATS-friendly resume template optimized for tech roles',
    url: 'https://discord.gg/career-resources',
    type: 'template',
    category: 'Resume',
    tags: ['resume', 'template', 'ATS'],
    difficulty: 'beginner'
  },
  {
    title: 'Resume Writing Guide',
    description: 'Complete guide to writing impactful resumes',
    url: 'https://t.me/career_resources',
    type: 'article',
    category: 'Resume',
    tags: ['resume', 'writing', 'guide'],
    difficulty: 'beginner'
  },
  
  // Interview Prep
  {
    title: 'Behavioral Interview Prep',
    description: 'Master the STAR method and common behavioral questions',
    url: 'https://discord.gg/interview-prep',
    type: 'course',
    category: 'Interview',
    tags: ['interview', 'behavioral', 'STAR'],
    difficulty: 'intermediate'
  },
  {
    title: 'Technical Interview Questions',
    description: 'Practice common technical interview questions',
    url: 'https://t.me/interview_prep',
    type: 'tool',
    category: 'Interview',
    tags: ['interview', 'technical', 'coding'],
    difficulty: 'intermediate'
  },
  {
    title: 'Mock Interview Practice',
    description: 'Join our community for peer mock interviews',
    url: 'https://discord.gg/mock-interviews',
    type: 'tool',
    category: 'Interview',
    tags: ['interview', 'practice', 'mock'],
    difficulty: 'intermediate'
  },
  
  // Cover Letters
  {
    title: 'Cover Letter Template Library',
    description: 'Collection of cover letter templates for various roles',
    url: 'https://discord.gg/cover-letters',
    type: 'template',
    category: 'Cover Letter',
    tags: ['cover letter', 'template'],
    difficulty: 'beginner'
  },
  {
    title: 'Writing Compelling Cover Letters',
    description: 'Learn to write cover letters that stand out',
    url: 'https://t.me/cover_letters',
    type: 'article',
    category: 'Cover Letter',
    tags: ['cover letter', 'writing'],
    difficulty: 'beginner'
  },
  
  // Networking
  {
    title: 'Networking Fundamentals',
    description: 'Build your professional network effectively',
    url: 'https://discord.gg/networking',
    type: 'course',
    category: 'Networking',
    tags: ['networking', 'career', 'connections'],
    difficulty: 'beginner'
  },
  {
    title: 'LinkedIn Optimization Guide',
    description: 'Optimize your LinkedIn profile for maximum visibility',
    url: 'https://t.me/networking_tips',
    type: 'article',
    category: 'Networking',
    tags: ['linkedin', 'profile', 'networking'],
    difficulty: 'beginner'
  },
  {
    title: 'Coffee Chat Template',
    description: 'Email templates for requesting informational interviews',
    url: 'https://discord.gg/networking',
    type: 'template',
    category: 'Networking',
    tags: ['networking', 'coffee chat', 'template'],
    difficulty: 'beginner'
  },
  
  // Career Development
  {
    title: 'Salary Negotiation Guide',
    description: 'Negotiate your offers with confidence',
    url: 'https://discord.gg/career-resources',
    type: 'article',
    category: 'Career Development',
    tags: ['salary', 'negotiation', 'offers'],
    difficulty: 'advanced'
  },
  {
    title: 'Career Transition Roadmap',
    description: 'Step-by-step guide for career changers',
    url: 'https://t.me/career_resources',
    type: 'course',
    category: 'Career Development',
    tags: ['career', 'transition', 'roadmap'],
    difficulty: 'intermediate'
  }
]

async function seedCareerData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await Mentor.deleteMany({})
    await Resource.deleteMany({})
    console.log('Cleared existing career data')

    // Insert new data
    await Mentor.insertMany(mentors)
    console.log(`Inserted ${mentors.length} mentors`)

    await Resource.insertMany(resources)
    console.log(`Inserted ${resources.length} resources`)

    console.log('Career data seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding career data:', error)
    process.exit(1)
  }
}

seedCareerData()
