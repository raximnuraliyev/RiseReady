import mongoose from 'mongoose'

// Mentors
const MentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, default: '' },
  expertise: [{ type: String }],
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  discordId: { type: String, default: '' }, // For Discord bot integration
  availability: { type: String, default: 'Available' },
  rating: { type: Number, default: 5, min: 0, max: 5 },
  sessionsCount: { type: Number, default: 0 },
}, { timestamps: true })

// Career Resources
const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['article', 'video', 'course', 'tool', 'template'], default: 'article' },
  category: { type: String, default: 'General' }, // Resume, Interview, Networking, etc.
  tags: [{ type: String }],
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
}, { timestamps: true })

// Career Tasks (user-specific)
const CareerTaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
}, { timestamps: true })

export const Mentor = mongoose.model('Mentor', MentorSchema)
export const Resource = mongoose.model('Resource', ResourceSchema)
export const CareerTask = mongoose.model('CareerTask', CareerTaskSchema)
