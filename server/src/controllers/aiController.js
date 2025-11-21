import fetch from 'node-fetch'
import crypto from 'crypto'
import AIAssistant from '../models/AIAssistant.js'
import AICache from '../models/AICache.js'

// Note: We'll read the API key dynamically in the chat function to ensure .env is loaded
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

const SYSTEM_PROMPT = `You are RiseReady Assistant, a helpful and friendly AI guide embedded in RiseReady - a comprehensive student productivity and career development platform.

RiseReady Features:
- Focus: Time-tracking and productivity sessions with Pomodoro-like features
- Calendar: Event and assignment tracking
- Budget: Financial tracking and management for students
- Skills: Skill development and tracking
- Career: Career guidance, internship opportunities, and development paths
- Wellbeing: Mental health check-ins and wellbeing tracking
- Projects: Project management and collaboration tools
- Dashboard: Central hub with analytics and insights
- Discord Community: Connect with peers and mentors
- Telegram Bot: On-the-go access to RiseReady features via Telegram
- Discord Bot: Community engagement and support

Your Role:
1. Help users navigate and understand RiseReady's features
2. Provide guidance on how to use each module
3. Answer questions about productivity, time management, budgeting, career development
4. Offer motivational support and tips
5. Clarify features and functionalities
6. Direct users to relevant pages or documentation when needed
7. Help users with their mental health and wellbeing
8. Provide guidance on how to use each module
9. Design of your answer should be structured and easy to follow

Important Rules:
- Stay focused on RiseReady and student productivity topics
- If asked something outside your scope, politely redirect to RiseReady topics
- Use a friendly, warm, and encouraging tone
- Personalize responses when you have the user's name
- Keep responses concise but thorough (2-3 paragraphs max)
- When recommending actions, include direct links or page references
- If unsure, ask clarifying questions or suggest related help options
- Avoid making promises about features you're unsure about
- Always prioritize user success and satisfaction

Tips:
- Use friendly language: "Hey", "I'd love to help with that", "Great question!"
- Break complex explanations into bullet points
- Include actionable next steps
- Be empathetic about common student struggles
- Suggest related features that might help

You are helpful, knowledgeable, empathetic, and focused on making RiseReady work best for each student.`

// Utility: Hash question for caching
function hashQuestion(question) {
  return crypto
    .createHash('sha256')
    .update(question.toLowerCase().trim())
    .digest('hex')
}

// Utility: Calculate similarity between two strings (simple approach)
function calculateSimilarity(str1, str2) {
  const s1 = str1.toLowerCase().trim()
  const s2 = str2.toLowerCase().trim()

  const words1 = new Set(s1.split(/\s+/))
  const words2 = new Set(s2.split(/\s+/))

  const intersection = new Set([...words1].filter(x => words2.has(x)))
  const union = new Set([...words1, ...words2])

  return intersection.size / union.size // Jaccard similarity
}

// Get or create session
export const getOrCreateSession = async (req, res) => {
  try {
    const { sessionId } = req.body
    const userId = req.user?.id || null
    const metadata = req.body.metadata || {}

    let session = null

    if (sessionId) {
      session = await AIAssistant.findOne({ sessionId })
    }

    if (!session) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      session = await AIAssistant.create({
        sessionId: newSessionId,
        userId,
        metadata: {
          ...metadata,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        },
        messages: [],
        metrics: {
          totalMessages: 0,
        },
      })
    }

    res.json({ sessionId: session.sessionId })
  } catch (error) {
    console.error('Error getting/creating session:', error)
    res.status(500).json({ error: 'Failed to create session' })
  }
}

// Main chat endpoint
export const chat = async (req, res) => {
  try {
    const { sessionId, message, pageContext, metadata } = req.body
    const userId = req.user?.id || null

    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Missing message or sessionId' })
    }

    // Find or create session
    let session = await AIAssistant.findOne({ sessionId })
    if (!session) {
      session = await AIAssistant.create({
        sessionId,
        userId,
        metadata: {
          ...metadata,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          pageContext,
        },
      })
    }

    // Add user message
    session.messages.push({
      role: 'user',
      content: message,
    })
    session.metrics.totalMessages += 1
    if (pageContext) {
      session.metadata.pageContext = pageContext
    }

    const startTime = Date.now()

    // Try cache first
    const questionHash = hashQuestion(message)
    let cachedAnswer = await AICache.findOne({
      questionHash,
      isValid: true,
    })

    // If not exact match, try similarity matching
    if (!cachedAnswer) {
      const allCache = await AICache.find({ isValid: true })
      let bestMatch = null
      let bestSimilarity = 0.65 // threshold

      for (const cache of allCache) {
        const similarity = calculateSimilarity(message, cache.originalQuestion)
        if (similarity > bestSimilarity) {
          bestSimilarity = similarity
          bestMatch = cache
        }
      }

      cachedAnswer = bestMatch
    }

    let assistantResponse
    let usedCache = false

    if (cachedAnswer) {
      assistantResponse = cachedAnswer.answer
      usedCache = true

      // Update cache usage
      await AICache.updateOne(
        { _id: cachedAnswer._id },
        {
          $inc: { usageCount: 1 },
          $set: { lastUsed: new Date() },
        }
      )
    } else {
      // Call OpenRouter API
      try {
        // Read API key dynamically to ensure .env is loaded
        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
        
        console.log(`[AI] OPENROUTER_API_KEY present: ${!!OPENROUTER_API_KEY}`)
        console.log(`[AI] Calling OpenRouter API with key: ${OPENROUTER_API_KEY?.substring(0, 20)}...`)
        
        if (!OPENROUTER_API_KEY) {
          throw new Error('OPENROUTER_API_KEY is not set in environment variables. Check server/.env file.')
        }
        
        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.APP_URL || 'http://localhost:5173',
            'X-Title': 'RiseReady Assistant',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: SYSTEM_PROMPT,
              },
              ...session.messages.map(msg => ({
                role: msg.role,
                content: msg.content,
              })),
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        })

        console.log(`[AI] OpenRouter response status: ${response.status}`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const errorMsg = errorData.error?.message || `API error: ${response.status}`
          console.error(`[AI] API Error: ${errorMsg}`, errorData)
          throw new Error(errorMsg)
        }

        const data = await response.json()
        console.log(`[AI] API Response data:`, data)
        
        assistantResponse = data.choices?.[0]?.message?.content

        if (!assistantResponse) {
          console.error(`[AI] No response in API data:`, data)
          throw new Error('No response from API')
        }

        console.log(`[AI] Got response: ${assistantResponse.substring(0, 50)}...`)

        // Cache the new answer
        try {
          await AICache.create({
            questionHash,
            originalQuestion: message,
            answer: assistantResponse,
            category: 'general',
            keywords: message.split(/\s+/).slice(0, 5),
            pageContext: pageContext ? [pageContext] : [],
            confidenceScore: 0.85,
          })
          console.log(`[AI] Response cached for question hash: ${questionHash}`)
        } catch (cacheError) {
          console.warn('[AI] Cache creation failed:', cacheError.message)
        }
      } catch (apiError) {
        console.error('[AI] OpenRouter API error:', apiError.message)
        console.error('[AI] Full error:', apiError)
        assistantResponse =
          "I'm having trouble connecting to my knowledge base right now. Could you try rephrasing your question or visit our help documentation? I apologize for the inconvenience!"
      }
    }

    // Add assistant response
    session.messages.push({
      role: 'assistant',
      content: assistantResponse,
    })
    session.metrics.totalMessages += 1
    session.metrics.usedCache = usedCache
    session.metrics.responseTime = Date.now() - startTime

    // Save session
    await session.save()

    res.json({
      message: assistantResponse,
      sessionId: session.sessionId,
      usedCache,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Failed to process message' })
  }
}

// Get conversation history
export const getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params
    const session = await AIAssistant.findOne({ sessionId })

    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    res.json({
      sessionId: session.sessionId,
      messages: session.messages,
      metadata: session.metadata,
      createdAt: session.createdAt,
    })
  } catch (error) {
    console.error('Error fetching history:', error)
    res.status(500).json({ error: 'Failed to fetch history' })
  }
}

// Submit feedback
export const submitFeedback = async (req, res) => {
  try {
    const { sessionId, messageIndex, helpful, comment } = req.body

    if (!sessionId || messageIndex === undefined || helpful === undefined) {
      return res
        .status(400)
        .json({ error: 'Missing required fields' })
    }

    const session = await AIAssistant.findOne({ sessionId })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    session.feedback.push({
      messageIndex,
      helpful,
      comment,
    })

    // Update resolution metric if they say "yes" to helpful
    if (helpful) {
      session.metrics.resolutionComplete = true
    }

    await session.save()

    res.json({ success: true })
  } catch (error) {
    console.error('Error submitting feedback:', error)
    res.status(500).json({ error: 'Failed to submit feedback' })
  }
}

// Admin: Get analytics
export const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const query = {}

    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }

    const sessions = await AIAssistant.find(query)
    const feedbacks = sessions.flatMap(s => s.feedback)

    const metrics = {
      totalSessions: sessions.length,
      totalMessages: sessions.reduce((sum, s) => sum + s.metrics.totalMessages, 0),
      avgMessagesPerSession:
        sessions.length > 0
          ? sessions.reduce((sum, s) => sum + s.metrics.totalMessages, 0) /
            sessions.length
          : 0,
      cacheHitRate:
        sessions.length > 0
          ? (sessions.filter(s => s.metrics.usedCache).length / sessions.length) *
            100
          : 0,
      avgResponseTime:
        sessions.length > 0
          ? sessions.reduce((sum, s) => sum + (s.metrics.responseTime || 0), 0) /
            sessions.length
          : 0,
      resolutionRate:
        sessions.length > 0
          ? (sessions.filter(s => s.metrics.resolutionComplete).length /
            sessions.length) *
            100
          : 0,
      helpfulFeedback: feedbacks.filter(f => f.helpful).length,
      totalFeedback: feedbacks.length,
      helpfulRate:
        feedbacks.length > 0
          ? (feedbacks.filter(f => f.helpful).length / feedbacks.length) * 100
          : 0,
      uniqueUsers: new Set(sessions.map(s => s.userId).filter(Boolean)).size,
      topPageContexts: Object.entries(
        sessions.reduce((acc, s) => {
          const ctx = s.metadata.pageContext
          acc[ctx] = (acc[ctx] || 0) + 1
          return acc
        }, {})
      )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
    }

    res.json(metrics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    res.status(500).json({ error: 'Failed to fetch analytics' })
  }
}

// Clear old sessions (maintenance)
export const clearOldSessions = async (req, res) => {
  try {
    const daysOld = req.query.days || 30
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)

    const result = await AIAssistant.deleteMany({
      createdAt: { $lt: cutoffDate },
    })

    res.json({
      success: true,
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    console.error('Error clearing sessions:', error)
    res.status(500).json({ error: 'Failed to clear sessions' })
  }
}
