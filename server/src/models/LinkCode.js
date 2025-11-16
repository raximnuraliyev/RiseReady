import mongoose from 'mongoose'

const LinkCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, index: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
}, {
  timestamps: true
})

// Auto-set default expiry (10 minutes) if not provided
LinkCodeSchema.pre('save', function (next) {
  if (!this.expiresAt) {
    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + 10)
    this.expiresAt = expires
  }
  next()
})

export const LinkCode = mongoose.model('LinkCode', LinkCodeSchema)
