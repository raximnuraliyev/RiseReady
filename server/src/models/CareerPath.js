import mongoose from 'mongoose'

const CareerPathSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  tasks: [{
    taskId: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: String,
    description: String,
    dueInDays: Number,
  }]
}, { timestamps: true })

export const CareerPath = mongoose.model('CareerPath', CareerPathSchema)
