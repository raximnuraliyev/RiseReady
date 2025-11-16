import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Briefcase,
  Users,
  BookOpen,
  Plus,
  X,
  ChevronRight,
  Award,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Circle,
  Star,
  Target,
  Loader
} from 'lucide-react'
import { useCareer } from '../../hooks/useCareer'
import { useUserLevel } from '../../hooks/useUserLevel'
import { useDashboardContext } from '../../contexts/DashboardContext'
import DashboardBackground from '../../components/DashboardBackgrounds'

export default function CareerPage() {
  const { mentors, resources, tasks, loading: careerLoading, createTask, toggleTask, deleteTask } = useCareer()
  const { level } = useUserLevel()
  const { stats, refreshStats } = useDashboardContext()
  
  const [showMentors, setShowMentors] = useState(false)
  const [showResources, setShowResources] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: ''
  })

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return

    try {
      await createTask(newTask)
      // Refresh dashboard stats after adding a task
      await refreshStats()
      setNewTask({ title: '', description: '', category: 'General', priority: 'medium', dueDate: '' })
      setShowAddTask(false)
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }

  const categories = ['All', 'Resume', 'Interview', 'Networking', 'Skills', 'Applications']
  const filteredTasks = selectedCategory === 'All' 
    ? tasks 
    : tasks.filter(t => t.category === selectedCategory)

  const completedTasks = tasks.filter(t => t.completed).length
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0

  if (careerLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading career planner...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#F0F4FF] via-[#E8F4F8] to-[#FFF5F7] pb-20">
      <DashboardBackground variant="career" />
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#1E40AF] rounded-2xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1F4E79]">Career Planner</h1>
                <p className="text-sm text-gray-600 mt-0.5">Plan your path to success 🚀</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 rounded-full border-2 border-[#FFD700]/30">
              <Award className="w-5 h-5 text-[#FFA500]" />
              <span className="font-semibold text-[#1F4E79]">Level {level}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-3xl shadow-2xl p-8 mb-8 text-white"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-white/80 mb-1">Your Career Journey</div>
              <h2 className="text-3xl font-bold">Career Tasks Progress</h2>
            </div>
            <button
              onClick={() => setShowAddTask(true)}
              className="px-6 py-3 bg-white text-[#8B5CF6] font-semibold rounded-xl hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/80">Overall Progress</span>
              <span className="font-semibold">{completedTasks}/{tasks.length} tasks completed</span>
            </div>
            <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-sm text-white/80 mb-1">Available Mentors</div>
              <div className="text-2xl font-bold">{mentors.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-sm text-white/80 mb-1">Resources</div>
              <div className="text-2xl font-bold">{resources.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-sm text-white/80 mb-1">Pending Tasks</div>
              <div className="text-2xl font-bold">{tasks.length - completedTasks}</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Career Tasks */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-[#3B82F6]" />
                  <h2 className="text-2xl font-bold text-[#1F4E79]">Career Tasks</h2>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#3B82F6] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-bold text-[#1F4E79] mb-2">No tasks yet</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first career task!</p>
                    <button
                      onClick={() => setShowAddTask(true)}
                      className="px-6 py-3 bg-[#3B82F6] text-white rounded-xl font-semibold hover:scale-105 transition-transform"
                    >
                      Add Your First Task
                    </button>
                  </div>
                ) : (
                  filteredTasks.map((task, index) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => toggleTask(task._id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        task.completed
                          ? 'bg-green-50 border-green-200'
                          : 'border-gray-200 hover:border-[#3B82F6]/50 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className={`font-semibold text-[#1F4E79] ${task.completed ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-600' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {task.priority}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteTask(task._id)
                                }}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          {task.description && (
                            <p className={`text-sm text-gray-600 mb-2 ${task.completed ? 'line-through' : ''}`}>
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 rounded">
                              {task.category}
                            </span>
                            {task.dueDate && (
                              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Find a Mentor */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => setShowMentors(true)}
              className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-3xl shadow-xl p-6 text-white cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Find a Mentor</h3>
              <p className="text-white/90 text-sm mb-4">Connect with {mentors.length} professionals in your field</p>
              <button className="px-4 py-2 bg-white text-[#10B981] rounded-xl font-semibold hover:scale-105 transition-transform text-sm flex items-center gap-2">
                Browse Mentors
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Career Resources */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => setShowResources(true)}
              className="bg-white rounded-3xl shadow-lg p-6 border-2 border-[#F59E0B] cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-[#F59E0B]" />
                <h3 className="text-xl font-bold text-[#1F4E79]">Career Resources</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{resources.length} guides, templates, and tools available</p>
              <button className="px-4 py-2 bg-[#F59E0B] text-white rounded-xl font-semibold hover:scale-105 transition-transform text-sm flex items-center gap-2">
                View Resources
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTask && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddTask(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-br from-[#3B82F6] to-[#1E40AF] p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Add Career Task</h2>
                    <button
                      onClick={() => setShowAddTask(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-all"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title *</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3B82F6] focus:outline-none transition-colors"
                      placeholder="e.g., Update resume"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3B82F6] focus:outline-none transition-colors"
                      rows={3}
                      placeholder="Add details..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                      <select
                        value={newTask.category}
                        onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3B82F6] focus:outline-none transition-colors"
                      >
                        <option value="General">General</option>
                        <option value="Resume">Resume</option>
                        <option value="Interview">Interview</option>
                        <option value="Networking">Networking</option>
                        <option value="Skills">Skills</option>
                        <option value="Applications">Applications</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3B82F6] focus:outline-none transition-colors"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date (Optional)</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3B82F6] focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleAddTask}
                    disabled={!newTask.title.trim()}
                    className="w-full py-4 bg-gradient-to-r from-[#3B82F6] to-[#1E40AF] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Task
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Mentors Modal */}
      <AnimatePresence>
        {showMentors && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMentors(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Find a Mentor</h2>
                      <p className="text-white/90 mt-1">Connect with experienced professionals</p>
                    </div>
                    <button
                      onClick={() => setShowMentors(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-all"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {mentors.map((mentor) => (
                    <div key={mentor._id} className="p-5 rounded-2xl border-2 border-gray-200 hover:border-[#10B981] transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-[#1F4E79]">{mentor.name}</h3>
                          <p className="text-sm text-gray-600">{mentor.title} at {mentor.company}</p>
                          {mentor.bio && <p className="text-sm text-gray-600 mt-2">{mentor.bio}</p>}
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-semibold">{mentor.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <span className="font-semibold">Discord:</span>
                        <code className="px-2 py-1 bg-gray-100 rounded text-xs">{mentor.discordId}</code>
                        <span className={`ml-auto px-2 py-1 rounded text-xs ${
                          mentor.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {mentor.availability}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {mentor.expertise.map((skill) => (
                          <span key={skill} className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] rounded-lg text-xs font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`https://discord.com/users/${mentor.discordId.split('#')[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 bg-[#5865F2] text-white rounded-xl font-semibold hover:scale-105 transition-transform text-sm text-center flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Contact on Discord
                        </a>
                        <span className="text-xs text-gray-500 self-center">{mentor.sessionsCount} sessions</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Resources Modal */}
      <AnimatePresence>
        {showResources && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResources(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Career Resources</h2>
                      <p className="text-white/90 mt-1">Guides, templates, and tools to advance your career</p>
                    </div>
                    <button
                      onClick={() => setShowResources(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-all"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {resources.map((resource) => (
                    <div key={resource._id} className="p-5 rounded-2xl border-2 border-gray-200 hover:border-[#F59E0B] transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg text-[#1F4E79]">{resource.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${
                              resource.type === 'course' ? 'bg-blue-100 text-blue-700' :
                              resource.type === 'template' ? 'bg-purple-100 text-purple-700' :
                              resource.type === 'tool' ? 'bg-green-100 text-green-700' :
                              resource.type === 'video' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {resource.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded">{resource.category}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              resource.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                              resource.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {resource.difficulty}
                            </span>
                          </div>
                        </div>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-4 px-4 py-2 bg-[#F59E0B] text-white rounded-xl font-semibold hover:scale-105 transition-transform text-sm flex items-center gap-2"
                        >
                          View
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
