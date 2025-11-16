import mongoose from 'mongoose'

const aiCacheSchema = new mongoose.Schema(
  {
    questionHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    originalQuestion: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'navigation',
        'module_explanation',
        'feature_help',
        'guidance',
        'task_help',
        'error_help',
        'general',
      ],
      default: 'general',
    },
    keywords: [String],
    pageContext: [String], // which pages this answer is relevant for
    usageCount: {
      type: Number,
      default: 1,
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.9,
    },
  },
  {
    timestamps: true,
  }
)

// Index for efficient querying
aiCacheSchema.index({ category: 1, isValid: 1 })
aiCacheSchema.index({ keywords: 1 })
aiCacheSchema.index({ pageContext: 1 })

export default mongoose.model('AICache', aiCacheSchema)
