import mongoose from 'mongoose'

const aiAssistantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null for unauthenticated users
      sparse: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    metadata: {
      userAgent: String,
      pageUrl: String,
      pageContext: String, // e.g., "Focus", "Budget", "Calendar"
      ipAddress: String,
    },
    feedback: [
      {
        messageIndex: Number,
        helpful: Boolean,
        comment: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    metrics: {
      totalMessages: {
        type: Number,
        default: 0,
      },
      usedCache: {
        type: Boolean,
        default: false,
      },
      responseTime: Number, // ms
      resolutionComplete: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
)

// Index for efficient querying
aiAssistantSchema.index({ userId: 1, createdAt: -1 })
aiAssistantSchema.index({ sessionId: 1 })
aiAssistantSchema.index({ 'metadata.pageContext': 1 })

export default mongoose.model('AIAssistant', aiAssistantSchema)
