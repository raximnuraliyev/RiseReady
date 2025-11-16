import { BudgetItem } from '../models/Budget.js'

export async function getBudgetItems(req, res) {
  const { month, year } = req.query
  const query = { userId: req.user.id }
  
  if (month && year) {
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
    query.date = { $gte: startDate, $lte: endDate }
  }
  
  const items = await BudgetItem.find(query).sort({ date: -1 })
  res.json(items)
}

export async function createBudgetItem(req, res) {
  const { type, category, amount, description, date, recurring } = req.body
  const item = await BudgetItem.create({
    userId: req.user.id,
    type,
    category,
    amount,
    description: description || '',
    date: date || new Date(),
    recurring: recurring || false
  })
  res.status(201).json(item)
}

export async function updateBudgetItem(req, res) {
  const { id } = req.params
  const item = await BudgetItem.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    req.body,
    { new: true }
  )
  if (!item) return res.status(404).json({ error: 'Budget item not found' })
  res.json(item)
}

export async function deleteBudgetItem(req, res) {
  const { id } = req.params
  await BudgetItem.findOneAndDelete({ _id: id, userId: req.user.id })
  res.json({ success: true })
}

export async function getBudgetSummary(req, res) {
  const { month, year } = req.query
  const query = { userId: req.user.id }
  
  if (month && year) {
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
    query.date = { $gte: startDate, $lte: endDate }
  }
  
  const items = await BudgetItem.find(query)
  
  const income = items.filter(i => i.type === 'income').reduce((sum, i) => sum + i.amount, 0)
  const expenses = items.filter(i => i.type === 'expense').reduce((sum, i) => sum + i.amount, 0)
  
  const categoryBreakdown = {}
  items.forEach(item => {
    if (!categoryBreakdown[item.category]) {
      categoryBreakdown[item.category] = { income: 0, expense: 0 }
    }
    categoryBreakdown[item.category][item.type] += item.amount
  })
  
  res.json({
    income,
    expenses,
    balance: income - expenses,
    categoryBreakdown
  })
}
