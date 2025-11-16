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
  Code,
  Handshake,
  Star
} from 'lucide-react'
import { useSkills } from '../../hooks/useSkills'
import { useUserLevel } from '../../hooks/useUserLevel'
import DashboardBackground from '../../components/DashboardBackgrounds'

const categoryIcons: Record<string, JSX.Element> = {
  'Academic': <BookOpen className="w-5 h-5" />,
  'Technical': <Code className="w-5 h-5" />,
  'Soft Skills': <Handshake className="w-5 h-5" />,
  'Other': <Star className="w-5 h-5" />
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
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-gray-600">Loading skills...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#FAFAFA] to-[#F0F4FF] pb-20">
      <DashboardBackground variant="skills" />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#37A6FF] to-[#1F4E79] rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1F4E79]">Skills Tracker</h1>
                <p className="text-sm text-gray-600 mt-0.5">Build your academic superpowers 🚀</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 rounded-full border-2 border-[#FFD700]/30">
                <Award className="w-5 h-5 text-[#FFA500]" />
                <span className="font-semibold text-[#1F4E79]">Level {level}</span>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-[#37A6FF] text-white rounded-xl font-semibold hover:bg-[#1F4E79] transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Skill</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#1F4E79]">Overall Skills Progress</h2>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FFD700]" />
              <span className="text-2xl font-bold text-[#37A6FF]">{overallProgress}%</span>
            </div>
          </div>
          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#37A6FF] via-[#5CB3FF] to-[#1F4E79] rounded-full"
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            {skills.length === 0 ? 'Add your first skill to get started!' : `Tracking ${skills.length} skills`}
          </p>
        </motion.div>

        {/* Skills Grid */}
        {skills.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-100">
            <div className="mb-4">
              <TrendingUp className="w-16 h-16 mx-auto text-[#37A6FF]" />
            </div>
            <h3 className="text-2xl font-bold text-[#1F4E79] mb-2">No skills yet!</h3>
            <p className="text-gray-600 mb-6">Start tracking your skills to level up your abilities</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-[#37A6FF] text-white rounded-xl font-semibold hover:bg-[#1F4E79] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Skill
            </button>
          </div>
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
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  {/* Header */}
                  <div 
                    className="h-24 p-4 relative"
                    style={{ background: `linear-gradient(135deg, ${color}15 0%, ${color}30 100%)` }}
                  >
                    <div className="flex justify-between items-start">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow text-2xl"
                        style={{ backgroundColor: color }}
                      >
                        {icon}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingSkill(skill)}
                          className="p-1.5 bg-white/80 rounded-lg hover:bg-white transition-colors"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill._id)}
                          className="p-1.5 bg-white/80 rounded-lg hover:bg-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-[#1F4E79] mb-1">{skill.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{skill.category}</p>

                    {/* Level */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Level</span>
                        <span className="font-semibold" style={{ color }}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${skill.level}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>

                    {/* Practice count */}
                    <div className="text-xs text-gray-600 mb-3">
                      Practiced: {skill.practiced} times
                    </div>

                    {/* Practice button */}
                    <button
                      onClick={() => handlePractice(skill._id)}
                      className="w-full py-2 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: color }}
                    >
                      Practice
                    </button>

                    {skill.notes && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{skill.notes}</p>
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
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#1F4E79]">
                  {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingSkill(null)
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    value={editingSkill ? editingSkill.name : newSkill.name}
                    onChange={(e) => editingSkill 
                      ? setEditingSkill({ ...editingSkill, name: e.target.value })
                      : setNewSkill({ ...newSkill, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#37A6FF] focus:outline-none"
                    placeholder="e.g., Time Management"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editingSkill ? editingSkill.category : newSkill.category}
                    onChange={(e) => editingSkill
                      ? setEditingSkill({ ...editingSkill, category: e.target.value })
                      : setNewSkill({ ...newSkill, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#37A6FF] focus:outline-none"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Technical">Technical</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {editingSkill && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editingSkill.level}
                      onChange={(e) => setEditingSkill({ ...editingSkill, level: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#37A6FF] focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={editingSkill ? editingSkill.notes : newSkill.notes}
                    onChange={(e) => editingSkill
                      ? setEditingSkill({ ...editingSkill, notes: e.target.value })
                      : setNewSkill({ ...newSkill, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#37A6FF] focus:outline-none"
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
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingSkill ? handleUpdate : handleAddSkill}
                    className="flex-1 px-4 py-2 bg-[#37A6FF] text-white rounded-lg font-semibold hover:bg-[#1F4E79] transition-colors"
                  >
                    {editingSkill ? 'Save Changes' : 'Add Skill'}
                  </button>
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
            className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-[#FFD700]"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center"
              >
                <Award className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-[#1F4E79] mb-2">Great Practice! 🎉</h3>
              <p className="text-xl font-semibold text-[#37A6FF]">Level Up!</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
