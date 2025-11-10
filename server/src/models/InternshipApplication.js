import mongoose from 'mongoose'

const InternshipApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  internshipId: { type: String, index: true },
  status: { type: String, enum: ['applied','screening','accepted','rejected'], default: 'applied' },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resumeUrl: { type: String }
}, { timestamps: true })

export const InternshipApplication = mongoose.model('InternshipApplication', InternshipApplicationSchema)
