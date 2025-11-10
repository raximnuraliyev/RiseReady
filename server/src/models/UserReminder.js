import mongoose from 'mongoose'

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['calendar', 'task', 'project', 'checkin'],
    required: true
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Index for efficient querying
reminderSchema.index({ userId: 1, time: 1, completed: 1 })

// Static method to create reminders from various sources
reminderSchema.statics.createFromSource = async function(sourceData, type, userId) {
  const reminder = new this({
    userId,
    title: sourceData.title,
    time: sourceData.dueDate || sourceData.startTime || sourceData.date,
    type,
    sourceId: sourceData._id,
    completed: sourceData.completed || false
  })
  return reminder.save()
}

export const UserReminder = mongoose.model('UserReminder', reminderSchema)