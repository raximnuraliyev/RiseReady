import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dueDate: { type: Date },
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  joinCode: { type: String, unique: true, sparse: true },
  status: { type: String, enum: ['planning', 'in-progress', 'completed', 'on-hold'], default: 'planning' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  tasks: [{
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  messages: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  files: [{
    name: { type: String, required: true },
    url: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now }
  }],
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' }
}, { timestamps: true })

// Static method to generate unique join codes
ProjectSchema.statics.generateJoinCode = async function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code
  let isUnique = false
  
  while (!isUnique) {
    code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    const exists = await this.findOne({ joinCode: code })
    if (!exists) isUnique = true
  }
  
  return code
}

export const Project = mongoose.model('Project', ProjectSchema)
