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
  Loader,
  CheckSquare2,
  Clock,
  Zap
} from 'lucide-react'
import { useCareer } from '../../hooks/useCareer'
import { useUserLevel } from '../../hooks/useUserLevel'
import { useDashboardContext } from '../../contexts/DashboardContext'

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading career planner...</span>
        </div>
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
                <Briefcase className="w-7 h-7 text-white" strokeWidth={2} />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Career Planner</h1>
                <p className="text-sm text-gray-600 mt-0.5">Plan your path to success 🚀</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border-2 border-amber-300/50 shadow-lg">
              <Award className="w-5 h-5 text-amber-600" strokeWidth={2} />
              <span className="font-semibold text-gray-900">Level {level}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800" />
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
          
          <div className="relative z-10 p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 text-white/80 mb-2">
                  <Target className="w-5 h-5" strokeWidth={2} />
                  <span className="text-sm font-medium">Your Career Journey</span>
                </div>
                <h2 className="text-3xl font-bold">Career Tasks Progress</h2>
              </div>
              <motion.button
                onClick={() => setShowAddTask(true)}
                className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-5 h-5" />
                Add Task
              </motion.button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Overall Progress</span>
                <span className="font-semibold">{completedTasks}/{tasks.length} tasks completed</span>
              </div>
              <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-xl border border-white/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-200 rounded-full shadow-lg"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-white/80" strokeWidth={2} />
                  <span className="text-sm text-white/80">Mentors</span>
                </div>
                <div className="text-2xl font-bold">{mentors.length}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-white/80" strokeWidth={2} />
                  <span className="text-sm text-white/80">Resources</span>
                </div>
                <div className="text-2xl font-bold">{resources.length}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-white/80" strokeWidth={2} />
                  <span className="text-sm text-white/80">Pending</span>
                </div>
                <div className="text-2xl font-bold">{tasks.length - completedTasks}</div>
              </div>
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
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600" strokeWidth={2} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Career Tasks</h2>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckSquare2 className="w-8 h-8 text-blue-600" strokeWidth={2} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No tasks yet</h3>
                    <p className="text-gray-600 mb-6">Start by adding your first career task!</p>
                    <motion.button
                      onClick={() => setShowAddTask(true)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add Your First Task
                    </motion.button>
                  </motion.div>
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
              className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-800" />
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-green-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              
              <div className="relative z-10 p-6 text-white h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl flex items-center justify-center mb-4">
                    <Users className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Find a Mentor</h3>
                  <p className="text-white/90 text-sm">Connect with {mentors.length} professionals in your field</p>
                </div>
                <motion.button 
                  className="mt-4 px-4 py-2 bg-white text-emerald-700 rounded-lg font-semibold text-sm flex items-center gap-2 w-full justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Browse Mentors
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>

            {/* Career Resources */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => setShowResources(true)}
              className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-800" />
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-orange-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              
              <div className="relative z-10 p-6 text-white h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-bold">Career Resources</h3>
                  </div>
                  <p className="text-white/90 text-sm">{resources.length} guides, templates, and tools available</p>
                </div>
                <motion.button 
                  className="mt-4 px-4 py-2 bg-white text-amber-700 rounded-lg font-semibold text-sm flex items-center gap-2 w-full justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Resources
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
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
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Add Career Task</h2>
                    <motion.button
                      onClick={() => setShowAddTask(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-all"
                      whileHover={{ rotate: 90 }}
                    >
                      <X className="w-6 h-6 text-white" strokeWidth={2} />
                    </motion.button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title *</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors"
                      placeholder="e.g., Update resume"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors"
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
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors"
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
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors"
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
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors"
                    />
                  </div>

                  <motion.button
                    onClick={handleAddTask}
                    disabled={!newTask.title.trim()}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-5 h-5" />
                    Add Task
                  </motion.button>
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
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Find a Mentor</h2>
                      <p className="text-white/90 mt-1">Connect with experienced professionals</p>
                    </div>
                    <motion.button
                      onClick={() => setShowMentors(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-all"
                      whileHover={{ rotate: 90 }}
                    >
                      <X className="w-6 h-6 text-white" strokeWidth={2} />
                    </motion.button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {mentors.map((mentor) => (
                    <motion.div 
                      key={mentor._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-xl border-2 border-gray-200 hover:border-emerald-300 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{mentor.name}</h3>
                          <p className="text-sm text-gray-600">{mentor.title} at {mentor.company}</p>
                          {mentor.bio && <p className="text-sm text-gray-600 mt-2">{mentor.bio}</p>}
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
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
                          <span key={skill} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`https://discord.com/users/${mentor.discordId.split('#')[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm text-center flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Contact on Discord
                        </a>
                        <span className="text-xs text-gray-500 self-center">{mentor.sessionsCount} sessions</span>
                      </div>
                    </motion.div>
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
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Career Resources</h2>
                      <p className="text-white/90 mt-1">Guides, templates, and tools to advance your career</p>
                    </div>
                    <motion.button
                      onClick={() => setShowResources(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-all"
                      whileHover={{ rotate: 90 }}
                    >
                      <X className="w-6 h-6 text-white" strokeWidth={2} />
                    </motion.button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {resources.map((resource) => (
                    <motion.div 
                      key={resource._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-xl border-2 border-gray-200 hover:border-amber-300 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg text-gray-900">{resource.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded font-semibold ${
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
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded font-medium text-gray-700">{resource.category}</span>
                            <span className={`text-xs px-2 py-1 rounded font-semibold ${
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
                          className="ml-4 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm flex items-center gap-2 whitespace-nowrap"
                        >
                          View
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
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
