import mongoose from 'mongoose'

const BudgetItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true }, // e.g., 'Food', 'Transport', 'Salary', etc.
  amount: { type: Number, required: true },
  description: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  recurring: { type: Boolean, default: false }, // For monthly recurring items
}, { timestamps: true })

export const BudgetItem = mongoose.model('BudgetItem', BudgetItemSchema)
