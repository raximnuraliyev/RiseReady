import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Award,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  X,
  Sparkles,
  BookOpen,
  Code2,
  Users,
  Star
} from 'lucide-react'
import { useSkills } from '../../hooks/useSkills'
import { useUserLevel } from '../../hooks/useUserLevel'

const categoryIcons: Record<string, React.ReactNode> = {
  'Academic': <BookOpen className="w-6 h-6" />,
  'Technical': <Code2 className="w-6 h-6" />,
  'Soft Skills': <Users className="w-6 h-6" />,
  'Other': <Star className="w-6 h-6" />
}

const categoryColors: Record<string, string> = {
  'Academic': '#37A6FF',
  'Technical': '#B8D96F',
  'Soft Skills': '#FF6B9D',
  'Other': '#FFA500'
}

export default function SkillsPage() {
  const { skills, loading, createSkill, updateSkill, deleteSkill, practiceSkill } = useSkills()
  const { level } = useUserLevel()
  
  type Skill = { _id: string; name: string; category: string; notes?: string; level?: number }
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Academic', notes: '' })
  const [showAnimation, setShowAnimation] = useState(false)

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) return
    await createSkill(newSkill)
    setNewSkill({ name: '', category: 'Academic', notes: '' })
    setShowAddModal(false)
  }

  const handlePractice = async (skillId: string) => {
    await practiceSkill(skillId)
    setShowAnimation(true)
    setTimeout(() => setShowAnimation(false), 2000)
  }

  const handleUpdate = async () => {
    if (!editingSkill) return
    await updateSkill(editingSkill._id, {
      name: editingSkill.name,
      category: editingSkill.category,
      notes: editingSkill.notes,
      level: editingSkill.level
    })
    setEditingSkill(null)
  }

  const handleDelete = async (skillId: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      await deleteSkill(skillId)
    }
  }

  const overallProgress = skills.length > 0
    ? Math.round(skills.reduce((sum, s) => sum + s.level, 0) / skills.length)
    : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-gray-600">Loading skills...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <TrendingUp className="w-7 h-7 text-white" strokeWidth={2} />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Skills Tracker</h1>
                <p className="text-sm text-gray-600 mt-0.5">Build your academic superpowers 🚀</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border-2 border-amber-300/50 shadow-lg">
                <Award className="w-5 h-5 text-amber-600" strokeWidth={2} />
                <span className="font-semibold text-gray-900">Level {level}</span>
              </div>
              <motion.button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Skill</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-800" />
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
          
          <div className="relative z-10 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Overall Skills Progress</h2>
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-300" strokeWidth={2} />
                <span className="text-4xl font-bold text-white">{overallProgress}%</span>
              </div>
            </div>
            <div className="relative w-full h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-xl border border-white/30">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-200 rounded-full shadow-lg"
              />
            </div>
            <p className="text-white/80 text-sm mt-3">
              {skills.length === 0 ? 'Add your first skill to get started!' : `Tracking ${skills.length} skills`}
            </p>
          </div>
        </motion.div>

        {/* Skills Grid */}
        {skills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-cyan-800" />
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            
            <div className="relative z-10 p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-10 h-10 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">No skills yet!</h3>
              <p className="text-white/80 mb-8 text-lg">Start tracking your skills to level up your abilities</p>
              <motion.button
                onClick={() => setShowAddModal(true)}
                className="px-8 py-4 bg-white text-cyan-700 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-5 h-5" />
                Add Your First Skill
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {skills.map((skill, index) => {
              const color = categoryColors[skill.category] || categoryColors['Other']
              const icon = categoryIcons[skill.category] || categoryIcons['Other']
              
              return (
                <motion.div
                  key={skill._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
                  <div 
                    className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                    style={{ backgroundColor: color }}
                  />
                  
                  <div className="relative z-10 p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <motion.div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {icon}
                      </motion.div>
                      <div className="flex gap-1">
                        <motion.button
                          onClick={() => setEditingSkill(skill)}
                          className="p-2 bg-gray-200/80 rounded-lg hover:bg-gray-300 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit className="w-4 h-4 text-gray-700" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(skill._id)}
                          className="p-2 bg-gray-200/80 rounded-lg hover:bg-red-100 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{skill.name}</h3>
                    <p className="text-xs text-gray-600 mb-4">{skill.category}</p>

                    {/* Level */}
                    <div className="mb-4 flex-grow">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Level</span>
                        <span className="font-semibold" style={{ color }}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${color}, ${color}dd)` }}
                        />
                      </div>
                    </div>

                    {/* Practice count */}
                    <div className="text-xs text-gray-600 mb-4">
                      Practiced: {skill.practiced || 0} times
                    </div>

                    {/* Practice button */}
                    <motion.button
                      onClick={() => handlePractice(skill._id)}
                      className="w-full py-3 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Practice
                    </motion.button>

                    {skill.notes && (
                      <p className="text-xs text-gray-600 mt-3 line-clamp-2">{skill.notes}</p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || editingSkill) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                </h3>
                <motion.button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingSkill(null)
                  }}
                  whileHover={{ rotate: 90 }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    value={editingSkill ? editingSkill.name : newSkill.name}
                    onChange={(e) => editingSkill 
                      ? setEditingSkill({ ...editingSkill, name: e.target.value })
                      : setNewSkill({ ...newSkill, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                    placeholder="e.g., Time Management"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={editingSkill ? editingSkill.category : newSkill.category}
                    onChange={(e) => editingSkill
                      ? setEditingSkill({ ...editingSkill, category: e.target.value })
                      : setNewSkill({ ...newSkill, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Technical">Technical</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {editingSkill && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editingSkill.level}
                      onChange={(e) => setEditingSkill({ ...editingSkill, level: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={editingSkill ? editingSkill.notes : newSkill.notes}
                    onChange={(e) => editingSkill
                      ? setEditingSkill({ ...editingSkill, notes: e.target.value })
                      : setNewSkill({ ...newSkill, notes: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                    rows={3}
                    placeholder="Add any notes about this skill..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingSkill(null)
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={editingSkill ? handleUpdate : handleAddSkill}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingSkill ? 'Save Changes' : 'Add Skill'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Practice Animation */}
      {showAnimation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -100 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-amber-500"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Award className="w-12 h-12 text-white" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Great Practice! 🎉</h3>
              <p className="text-xl font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Level Up!</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
