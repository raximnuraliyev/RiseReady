import mongoose from 'mongoose'

const InternshipSchema = new mongoose.Schema({
  company: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['internship', 'micro-project', 'contract'], default: 'internship' },
  location: { type: String, default: 'Remote' },
  duration: { type: String, default: '' }, // e.g., "3 months", "6 weeks"
  salary: { type: String, default: '' },
  requirements: [{ type: String }],
  skills: [{ type: String }],
  applicationUrl: { type: String, required: true },
  applicationPlatform: { type: String, enum: ['Netflix', 'Discord', 'Telegram', 'Email', 'Other'], default: 'Other' },
  deadline: { type: Date },
  posted: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  category: { type: String, default: 'General' }, // Tech, Design, Business, etc.
}, { timestamps: true })

InternshipSchema.index({ company: 1, title: 1, isActive: 1 })

export const Internship = mongoose.model('Internship', InternshipSchema)
