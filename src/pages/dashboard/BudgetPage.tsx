import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  ShoppingCart,
  Bus,
  Home,
  BookOpen,
  Coffee,
  Heart,
  Zap,
  Plus,
  X,
  PiggyBank,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Lightbulb
} from 'lucide-react'
import { format } from 'date-fns'
import DashboardBackground from '../../components/DashboardBackgrounds'
import { useBudget } from '../../hooks/useBudget'

const CATEGORIES = {
  income: [
    { id: 'Salary', name: 'Salary/Job', icon: <Wallet className="w-5 h-5" />, color: '#10B981' },
    { id: 'Allowance', name: 'Allowance', icon: <DollarSign className="w-5 h-5" />, color: '#34D399' },
    { id: 'Scholarship', name: 'Scholarship', icon: <BookOpen className="w-5 h-5" />, color: '#6EE7B7' },
    { id: 'Other Income', name: 'Other', icon: <Plus className="w-5 h-5" />, color: '#A7F3D0' },
  ],
  expense: [
    { id: 'Tuition', name: 'Tuition', icon: <BookOpen className="w-5 h-5" />, color: '#EF4444' },
    { id: 'Textbooks', name: 'Textbooks', icon: <BookOpen className="w-5 h-5" />, color: '#F87171' },
    { id: 'Food', name: 'Food', icon: <ShoppingCart className="w-5 h-5" />, color: '#FB923C' },
    { id: 'Transport', name: 'Transport', icon: <Bus className="w-5 h-5" />, color: '#FBBF24' },
    { id: 'Rent', name: 'Rent/Housing', icon: <Home className="w-5 h-5" />, color: '#A78BFA' },
    { id: 'Utilities', name: 'Utilities', icon: <Zap className="w-5 h-5" />, color: '#60A5FA' },
    { id: 'Entertainment', name: 'Entertainment', icon: <Coffee className="w-5 h-5" />, color: '#F472B6' },
    { id: 'Health', name: 'Health', icon: <Heart className="w-5 h-5" />, color: '#EC4899' },
    { id: 'Other', name: 'Other', icon: <Plus className="w-5 h-5" />, color: '#94A3B8' },
  ],
}

const budgetTips = [
  'Track every expense, no matter how small. Small purchases add up!',
  'Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings',
  'Buy used textbooks or rent them to save hundreds per semester',
  'Meal prep on weekends to save money and time during busy weeks',
  'Consider a student transit pass for unlimited monthly travel',
]

export default function BudgetPage() {
  const now = new Date()
  const [selectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear] = useState(now.getFullYear())
  
  const { items, summary, loading, createItem, deleteItem } = useBudget(selectedMonth, selectedYear)
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    recurring: false
  })

  const [currentTip] = useState(budgetTips[Math.floor(Math.random() * budgetTips.length)])

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await createItem({
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
      recurring: formData.recurring
    })

    setIsAddModalOpen(false)
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      recurring: false
    })
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this transaction?')) {
      await deleteItem(id)
    }
  }

  const getCategoryInfo = (category: string, type: 'income' | 'expense') => {
    const categories = CATEGORIES[type]
    return categories.find(c => c.id === category) || categories[categories.length - 1]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-gray-600">Loading budget...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#FAFAFA] to-[#F0F8FF] pb-20">
      <DashboardBackground variant="budget" />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center shadow-lg">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1F4E79]">Budget Manager</h1>
                <p className="text-sm text-gray-600 mt-0.5">Take control of your finances</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Income Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-3xl shadow-lg p-6 text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm font-medium">Total Income</span>
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">${summary.income.toFixed(2)}</div>
              <div className="flex items-center gap-1 text-white/80 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>This month</span>
              </div>
            </div>
            <motion.div
              className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          {/* Expenses Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-3xl shadow-lg p-6 text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm font-medium">Total Expenses</span>
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">${summary.expenses.toFixed(2)}</div>
              <div className="flex items-center gap-1 text-white/80 text-sm">
                <ArrowDownRight className="w-4 h-4" />
                <span>This month</span>
              </div>
            </div>
            <motion.div
              className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
          </motion.div>

          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-gradient-to-br ${
              summary.balance >= 0 
                ? 'from-[#3B82F6] to-[#2563EB]' 
                : 'from-[#F59E0B] to-[#D97706]'
            } rounded-3xl shadow-lg p-6 text-white relative overflow-hidden`}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm font-medium">Balance</span>
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">${summary.balance.toFixed(2)}</div>
              <div className="text-white/80 text-sm">
                {summary.balance >= 0 ? '✓ Good balance' : '⚠ Overspending'}
              </div>
            </div>
            <motion.div
              className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </div>

        {/* Budget Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] rounded-2xl p-6 mb-8 border-2 border-[#F59E0B]/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div>
              <h3 className="font-bold text-[#92400E] mb-1">Budget Tip</h3>
              <p className="text-[#78350F]">{currentTip}</p>
            </div>
          </div>
        </motion.div>

        {/* Transactions List */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1F4E79]">Recent Transactions</h2>
            <span className="text-sm text-gray-600">{items.length} transactions</span>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <PiggyBank className="w-16 h-16 mx-auto text-[#10B981]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F4E79] mb-2">No transactions yet</h3>
              <p className="text-gray-600 mb-6">Start tracking your income and expenses</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-3 bg-[#10B981] text-white rounded-xl font-semibold hover:bg-[#059669] transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add First Transaction
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => {
                const categoryInfo = getCategoryInfo(item.category, item.type)
                const isIncome = item.type === 'income'
                
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:shadow-md transition-all group"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${categoryInfo.color}20` }}
                    >
                      <div style={{ color: categoryInfo.color }}>
                        {categoryInfo.icon}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#1F4E79]">{item.category}</h3>
                        {item.recurring && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                            Recurring
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 truncate">{item.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(item.date), 'MMM d, yyyy')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`text-xl font-bold ${isIncome ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                        {isIncome ? '+' : '-'}${item.amount.toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#1F4E79]">Add Transaction</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                {/* Type Selection */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                      formData.type === 'income'
                        ? 'bg-[#10B981] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                      formData.type === 'expense'
                        ? 'bg-[#EF4444] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Expense
                  </button>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#37A6FF] focus:outline-none"
                    placeholder="0.00"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#37A6FF] focus:outline-none"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES[formData.type].map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#37A6FF] focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#37A6FF] focus:outline-none"
                    placeholder="Add a note..."
                  />
                </div>

                {/* Recurring */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.recurring}
                    onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Recurring (monthly)</span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#10B981] text-white rounded-lg font-semibold hover:bg-[#059669] transition-colors"
                  >
                    Add Transaction
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
