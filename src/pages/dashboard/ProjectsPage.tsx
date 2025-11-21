import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Users,
  CheckCircle2,
  Upload,
  LinkIcon,
  ArrowLeft,
  Edit2,
  Check,
  X,
  Key,
  Copy,
  ClipboardCheck,
  UserPlus,
  Trash2,
  Crown,
  Folders,
  Brain,
  Lightbulb,
  TrendingUp,
  MessageCircle,
  FileUp,
  Calendar,
  Clock
} from 'lucide-react'
import { useProjects } from '../../hooks/useProjects'
import type { TeamMember } from '../../types/project'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Component starts here

function formatDue(dueIso: string) {
  const d = new Date(dueIso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function getDaysUntil(dueIso: string): number {
  const due = new Date(dueIso)
  const now = new Date()
  const diffTime = due.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default function ProjectsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'tasks' | 'chat' | 'files'>('tasks')
  const [currentUserId] = useState('1') // TODO: Get from auth context
  const [chatInput, setChatInput] = useState('')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    importance: 'medium' as 'low' | 'medium' | 'high',
    isGeneral: true,
    assignedTo: '',
    dueDate: '',
    tags: [] as string[]
  })
  const [tagInput, setTagInput] = useState('')
  
  const { 
    projects, 
    createProject, 
    updateProject,
    joinProject,
    addTask, 
    toggleTask,
    addMessage,
    uploadFile,
    removeMember
  } = useProjects()
  const [editingTitle, setEditingTitle] = useState(false)
  const [tempTitle, setTempTitle] = useState('')
  const [editingDue, setEditingDue] = useState(false)
  const [tempDueIso, setTempDueIso] = useState('')
  const [inviteCopied, setInviteCopied] = useState(false)
  const [joinCodeInput, setJoinCodeInput] = useState('')

  const selected = useMemo(() => projects.find(p => p.id === selectedId) ?? null, [projects, selectedId])

  // Set initial selected project
  useEffect(() => {
    if (!selectedId && projects.length) {
      setSelectedId(projects[0].id)
    }
  }, [selectedId, projects])

  // Attempt to load projects from API if available (fallback to initialProjects)
  // useProjects hook already fetches projects on mount; no local fetch required

  useEffect(() => {
    setTempTitle(selected?.title ?? '')
    setTempDueIso(selected?.dueDate ?? '')
    setEditingTitle(false)
    setEditingDue(false)
    setInviteCopied(false)
    setJoinCodeInput('')
  }, [selected])

  const addProject = () => {
    // Create a new project via hook and select it
    (async () => {
      try {
        const created = await createProject({ title: 'Untitled Project', description: 'Describe your project goals…', dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString() })
        setSelectedId(created.id)
        setActiveTab('tasks')
      } catch {
        toast.error('Failed to create project')
      }
    })()
  }

  // Join by code
  const joinByCode = async () => {
    if (!joinCodeInput.trim()) return
    try {
      const created = await joinProject(joinCodeInput.trim())
      setSelectedId(created.id)
      toast.success('Joined project')
      setJoinCodeInput('')
    } catch {
      toast.error('Failed to join project')
    }
  }

  // Save wrappers to match existing JSX handlers
  const saveTitle = async () => {
    await handleSaveTitle(tempTitle)
  }

  const saveDue = async () => {
    await handleSaveDueDate(tempDueIso)
  }

  // Remove a team member (leader only)
  const handleRemoveMember = async (memberId: string) => {
    if (!selected) return
    try {
      await removeMember(selected.id, memberId)
      toast.success('Member removed')
    } catch {
      toast.error('Failed to remove member')
    }
  }

  // Create or submit task form
  const handleCreateTask = async () => {
    if (!selected || !taskFormData.title.trim()) {
      toast.error('Task title is required')
      return
    }
    try {
      await addTask(selected.id, {
        title: taskFormData.title,
        description: taskFormData.description,
        importance: taskFormData.importance,
        isGeneral: taskFormData.isGeneral,
        assignedTo: taskFormData.isGeneral ? undefined : taskFormData.assignedTo,
        dueDate: taskFormData.dueDate,
        tags: taskFormData.tags
      })
      setTaskFormData({
        title: '',
        description: '',
        importance: 'medium',
        isGeneral: true,
        assignedTo: '',
        dueDate: '',
        tags: []
      })
      setTagInput('')
      setShowTaskForm(false)
      toast.success('Task added')
    } catch {
      toast.error('Failed to add task')
    }
  }

  const handleToggleTask = async (taskId: string) => {
    if (!selected) return
    try {
      await toggleTask(selected.id, taskId)
    } catch {
      toast.error('Failed to update task')
    }
  }

  const handleSaveTitle = async (title: string) => {
    if (!selected || !title.trim()) return
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateProject(selected.id, { title: title } as any)
      setEditingTitle(false)
    } catch {
      toast.error('Failed to update project title')
    }
  }

  const handleSaveDueDate = async (dueDate: string) => {
    if (!selected || !dueDate) return
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateProject(selected.id, { dueDate: dueDate } as any)
      setEditingDue(false)
    } catch {
      toast.error('Failed to update project due date')
    }
  }

  const handleCopyInvite = async () => {
    if (!selected) return
    try {
      await navigator.clipboard.writeText(selected.joinCode)
      setInviteCopied(true)
      setTimeout(() => setInviteCopied(false), 1500)
    } catch {
      setInviteCopied(false)
      toast.error('Failed to copy invite code')
    }
  }

  // Add message handler
  const handleSendMessage = async () => {
    if (!selected || !chatInput.trim()) return
    try {
      await addMessage(selected.id, chatInput)
      setChatInput('')
      toast.success('Message sent')
    } catch (error) {
      console.error('Message error:', error)
      toast.error('Failed to send message')
    }
  }

  // Upload file handler
  const handleUploadFile = async () => {
    if (!selected) return
    // Create a file input element to trigger file selection
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        try {
          await uploadFile(selected.id, file)
          toast.success('File uploaded')
        } catch (error) {
          console.error('Upload error:', error)
          toast.error('Failed to upload file')
        }
      }
    }
    input.click()
  }

  const isLeader = selected ? selected.leaderId === currentUserId : false

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-lg">
              <Folders className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-sm text-gray-600">Collaborate, track progress & solve problems together</p>
            </div>
          </motion.div>
          <motion.button 
            onClick={addProject} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.97 }} 
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 transition-shadow"
          >
            <Plus className="w-5 h-5" />
            New Project
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Join by Code Section */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-center gap-3">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <input
                placeholder="Paste invite code to join a project"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm flex-1 min-w-[220px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <button 
                onClick={joinByCode} 
                disabled={!joinCodeInput.trim()} 
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors"
              >
                Join Project
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Projects List / Cards */}
          <div className="lg:col-span-2 space-y-3">
            {selected && (
              <button onClick={() => setSelectedId(null)} className="lg:hidden inline-flex items-center gap-2 text-blue-600 mb-2">
                <ArrowLeft className="w-4 h-4" /> Back to list
              </button>
            )}
            {projects.length === 0 ? (
              <motion.div 
                className="h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-center">
                  <Folders className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No projects yet. Create one to get started!</p>
                </div>
              </motion.div>
            ) : (
              projects.map((p, index) => {
                const daysLeft = getDaysUntil(p.dueDate)
                const isUrgent = daysLeft <= 3 && daysLeft > 0
                const isOverdue = daysLeft < 0

                return (
                  <motion.button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className={`w-full text-left bg-white rounded-xl border-2 p-4 shadow-sm hover:shadow-md transition-all ${
                      selectedId === p.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isOverdue ? 'border-red-300' : isUrgent ? 'border-orange-300' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{p.title}</h3>
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>Due {formatDue(p.dueDate)}</span>
                          {isOverdue && <span className="text-red-600 font-semibold text-xs">OVERDUE</span>}
                          {isUrgent && <span className="text-orange-600 font-semibold text-xs">DUE SOON</span>}
                        </div>
                      </div>
                      <div className="flex -space-x-2">
                        {p.members.slice(0, 4).map(m => (
                          <div key={m.id} title={m.name} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs flex items-center justify-center font-bold shadow-sm">
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {p.members.length > 4 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 text-gray-700 text-xs flex items-center justify-center font-bold">
                            +{p.members.length - 4}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600">{p.progress}%</span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <TrendingUp className="w-3 h-3" />
                          {p.tasks?.length || 0} tasks
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${p.progress}%` }}
                          transition={{ delay: 0.1, duration: 0.6 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                        />
                      </div>
                    </div>
                  </motion.button>
                )
              })
            )}
          </div>

          {/* Detail View */}
          <div className="lg:col-span-3">
            {!selected ? (
              <div className="hidden lg:flex flex-col items-center justify-center h-full text-gray-500 border-2 border-dashed border-gray-300 rounded-xl p-10">
                <Folders className="w-16 h-16 text-gray-400 mb-3" />
                <p className="text-lg font-semibold">Select a project to view details</p>
                <p className="text-sm">Create a new project or join an existing one to get started</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-emerald-50">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      {editingTitle ? (
                        <div className="flex items-center gap-2">
                          <input
                            value={tempTitle}
                            onChange={(e) => setTempTitle(e.target.value)}
                            className="px-3 py-2 border-2 border-blue-500 rounded-lg font-bold text-gray-900 w-full max-w-md focus:outline-none"
                          />
                          <motion.button 
                            onClick={saveTitle} 
                            whileHover={{ scale: 1.1 }}
                            className="p-2 rounded-lg bg-blue-100 text-blue-600 border border-blue-300 hover:bg-blue-200 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </motion.button>
                          <motion.button 
                            onClick={() => { setEditingTitle(false); setTempTitle(selected.title) }}
                            whileHover={{ scale: 1.1 }}
                            className="p-2 rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold text-gray-900 truncate">{selected.title}</h2>
                          <motion.button 
                            onClick={() => setEditingTitle(true)}
                            whileHover={{ scale: 1.1 }}
                            className="p-2 rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </motion.button>
                        </div>
                      )}
                      <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {editingDue ? (
                          <>
                            <input
                              type="date"
                              value={tempDueIso.slice(0, 10)}
                              onChange={(e) => setTempDueIso(new Date(e.target.value).toISOString())}
                              className="px-2 py-1 border-2 border-blue-500 rounded-lg text-sm focus:outline-none"
                            />
                            <motion.button 
                              onClick={saveDue}
                              whileHover={{ scale: 1.1 }}
                              className="p-1.5 rounded-lg bg-blue-100 border border-blue-300"
                            >
                              <Check className="w-4 h-4 text-blue-600" />
                            </motion.button>
                            <motion.button 
                              onClick={() => { setEditingDue(false); setTempDueIso(selected.dueDate) }}
                              whileHover={{ scale: 1.1 }}
                              className="p-1.5 rounded-lg border-2 border-gray-300"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </>
                        ) : (
                          <>
                            <span>Due {formatDue(selected.dueDate)}</span>
                            <motion.button 
                              onClick={() => setEditingDue(true)}
                              whileHover={{ scale: 1.1 }}
                              className="p-1.5 rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition-colors"
                            >
                              <Calendar className="w-4 h-4" />
                            </motion.button>
                          </>
                        )}
                        <span className="mx-2">•</span>
                        <Users className="w-4 h-4" /> {selected.members.length} member{selected.members.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Members + Invite Code */}
                  <div className="flex items-center justify-between gap-3 flex-wrap pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2 items-center">
                      {selected.members.map(m => (
                        <motion.div 
                          key={m.id} 
                          className="relative group"
                          whileHover={{ scale: 1.1 }}
                        >
                          <div 
                            title={m.name} 
                            className="w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-600 text-white text-sm flex items-center justify-center font-bold shadow-sm"
                          >
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                          {m.id === selected.leaderId && (
                            <Crown className="w-4 h-4 text-amber-500 absolute -top-2 -right-2 bg-white rounded-full p-0.5" />
                          )}
                          {isLeader && m.id !== selected.leaderId && (
                            <motion.button
                              onClick={() => handleRemoveMember(m.id)}
                              whileHover={{ scale: 1.2 }}
                              className="absolute -bottom-2 -right-2 bg-white border border-red-300 rounded-full p-1 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </motion.button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <div className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm flex items-center gap-2 font-mono select-all">
                        <Key className="w-4 h-4 text-gray-600" />
                        <span>{selected.joinCode}</span>
                      </div>
                      <motion.button 
                        onClick={handleCopyInvite}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-2 rounded-lg border-2 border-gray-300 hover:bg-gray-100 text-sm inline-flex items-center gap-2 transition-colors"
                      >
                        {inviteCopied ? (
                          <>
                            <ClipboardCheck className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex gap-2">
                    {[
                      { key: 'tasks', label: 'Tasks', icon: CheckCircle2 },
                      { key: 'chat', label: 'Chat', icon: MessageCircle },
                      { key: 'files', label: 'Files', icon: FileUp },
                    ].map(({ key, label, icon: Icon }) => (
                      <motion.button
                        key={key}
                        onClick={() => setActiveTab(key as 'tasks' | 'chat' | 'files')}
                        whileHover={{ y: -2 }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 border-2 transition-all ${
                          activeTab === key
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </motion.button>
                    ))}
                  </div>
                  {isLeader && (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      <Crown className="w-3 h-3" />
                      Leader Controls
                    </span>
                  )}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === 'tasks' && (
                      <motion.div
                        key="tab-tasks"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{selected.tasks.filter(t => t.done).length}</div>
                            <div className="text-xs text-gray-600">Completed</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{selected.tasks.filter(t => !t.done).length}</div>
                            <div className="text-xs text-gray-600">Remaining</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600">{selected.progress}%</div>
                            <div className="text-xs text-gray-600">Progress</div>
                          </div>
                        </div>

                        {/* Smart Suggestions */}
                        {selected.tasks.filter(t => !t.done).length > 5 && (
                          <motion.div 
                            className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Brain className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-800">
                              <div className="font-semibold">Smart Suggestion</div>
                              <div className="text-xs mt-1">You have {selected.tasks.filter(t => !t.done).length} tasks to complete. Consider breaking bigger tasks into smaller subtasks for better focus!</div>
                            </div>
                          </motion.div>
                        )}

                        {/* Tasks List */}
                        {selected.tasks.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Lightbulb className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm">No tasks yet. Create one to get started!</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {selected.tasks.map((t, idx) => (
                              <motion.div 
                                key={t.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 group transition-all cursor-pointer"
                              >
                                <div className="flex items-start gap-3">
                                  <motion.input 
                                    type="checkbox" 
                                    checked={t.done} 
                                    onChange={() => handleToggleTask(t.id)} 
                                    className="w-5 h-5 cursor-pointer flex-shrink-0 mt-0.5"
                                    whileHover={{ scale: 1.2 }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className={`text-sm font-semibold ${t.done ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                      {t.title}
                                    </div>
                                    
                                    {/* Description preview */}
                                    {t.description && (
                                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{t.description}</p>
                                    )}

                                    {/* Tags and metadata */}
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                        t.importance === 'high' ? 'bg-red-100 text-red-700' :
                                        t.importance === 'medium' ? 'bg-orange-100 text-orange-700' :
                                        'bg-green-100 text-green-700'
                                      }`}>
                                        {t.importance.charAt(0).toUpperCase() + t.importance.slice(1)}
                                      </span>
                                      
                                      {t.isGeneral ? (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">General</span>
                                      ) : (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">
                                          {t.assigneeName || 'Unassigned'}
                                        </span>
                                      )}

                                      {t.dueDate && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                      )}

                                      {t.tags && t.tags.length > 0 && (
                                        <div className="flex gap-1">
                                          {t.tags.slice(0, 2).map((tag, tidx) => (
                                            <span key={tidx} className="text-xs px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 font-medium">
                                              #{tag}
                                            </span>
                                          ))}
                                          {t.tags.length > 2 && (
                                            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 font-medium">
                                              +{t.tags.length - 2}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    {/* Subtasks progress */}
                                    {t.subtasks && t.subtasks.length > 0 && (
                                      <div className="mt-2 text-xs text-gray-600">
                                        Subtasks: {t.subtasks.filter(s => s.completed).length}/{t.subtasks.length}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                    {t.done && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}

                        <motion.button
                          onClick={() => setShowTaskForm(!showTaskForm)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full mt-4 px-4 py-3 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          {showTaskForm ? 'Cancel' : 'Add Task'}
                        </motion.button>

                        {showTaskForm && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3 max-h-96 overflow-y-auto"
                          >
                            {/* Task Title */}
                            <div>
                              <label className="text-xs font-semibold text-gray-700 block mb-1">Task Name *</label>
                              <input
                                type="text"
                                value={taskFormData.title}
                                onChange={(e) => setTaskFormData({...taskFormData, title: e.target.value})}
                                placeholder="What needs to be done?"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none text-sm"
                              />
                            </div>

                            {/* Task Description */}
                            <div>
                              <label className="text-xs font-semibold text-gray-700 block mb-1">Description (optional)</label>
                              <textarea
                                value={taskFormData.description}
                                onChange={(e) => setTaskFormData({...taskFormData, description: e.target.value})}
                                placeholder="Add more details to help your team understand..."
                                rows={2}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none text-sm resize-none"
                              />
                            </div>

                            {/* Priority and Assignment */}
                            <div className="flex gap-3">
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-700 block mb-1">Priority</label>
                                <select
                                  value={taskFormData.importance}
                                  onChange={(e) => setTaskFormData({...taskFormData, importance: e.target.value as 'low' | 'medium' | 'high'})}
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none text-sm"
                                >
                                  <option value="low">Low Priority</option>
                                  <option value="medium">Medium Priority</option>
                                  <option value="high">High Priority</option>
                                </select>
                              </div>

                              <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-700 block mb-1">Assignment</label>
                                <button
                                  onClick={() => setTaskFormData({...taskFormData, isGeneral: !taskFormData.isGeneral})}
                                  className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                    taskFormData.isGeneral 
                                      ? 'bg-blue-600 text-white' 
                                      : 'bg-gray-200 text-gray-700'
                                  }`}
                                >
                                  {taskFormData.isGeneral ? 'General' : 'Assign'}
                                </button>
                              </div>
                            </div>

                            {/* Member Selection */}
                            {!taskFormData.isGeneral && selected && (
                              <div>
                                <label className="text-xs font-semibold text-gray-700 block mb-1">Assign To</label>
                                <select
                                  value={taskFormData.assignedTo}
                                  onChange={(e) => setTaskFormData({...taskFormData, assignedTo: e.target.value})}
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none text-sm"
                                >
                                  <option value="">Select team member...</option>
                                  {selected.members.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {/* Due Date */}
                            <div>
                              <label className="text-xs font-semibold text-gray-700 block mb-1">Due Date (optional)</label>
                              <input
                                type="date"
                                value={taskFormData.dueDate}
                                onChange={(e) => setTaskFormData({...taskFormData, dueDate: e.target.value})}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none text-sm"
                              />
                            </div>

                            {/* Tags */}
                            <div>
                              <label className="text-xs font-semibold text-gray-700 block mb-1">Tags (optional)</label>
                              <div className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  value={tagInput}
                                  onChange={(e) => setTagInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault()
                                      if (tagInput.trim() && !taskFormData.tags.includes(tagInput.trim())) {
                                        setTaskFormData({...taskFormData, tags: [...taskFormData.tags, tagInput.trim()]})
                                        setTagInput('')
                                      }
                                    }
                                  }}
                                  placeholder="Type and press Enter to add tags"
                                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none text-sm"
                                />
                              </div>
                              {taskFormData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {taskFormData.tags.map((tag, idx) => (
                                    <motion.span 
                                      key={idx}
                                      initial={{ scale: 0.8 }}
                                      animate={{ scale: 1 }}
                                      className="px-2 py-1 rounded-full bg-blue-200 text-blue-700 text-xs font-semibold flex items-center gap-1"
                                    >
                                      {tag}
                                      <button
                                        onClick={() => setTaskFormData({...taskFormData, tags: taskFormData.tags.filter((_, i) => i !== idx)})}
                                        className="hover:text-blue-900"
                                      >
                                        ×
                                      </button>
                                    </motion.span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <motion.button
                              onClick={handleCreateTask}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                            >
                              Create Task
                            </motion.button>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'chat' && (
                      <motion.div
                        key="tab-chat"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="max-h-80 overflow-y-auto space-y-3 pr-2 mb-4">
                          {selected.messages.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm">No messages yet. Start collaborating!</p>
                            </div>
                          ) : (
                            selected.messages.map(m => (
                              <motion.div 
                                key={m.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg bg-blue-50 border border-blue-200"
                              >
                                <div className="text-xs text-gray-600 font-semibold mb-1">
                                  {(m.author as TeamMember)?.name || String(m.author)} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="text-sm text-gray-800">{m.text}</div>
                              </motion.div>
                            ))
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            id="chat-input" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSendMessage()
                              }
                            }}
                            placeholder="Message your team…" 
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm" 
                          />
                          <motion.button 
                            onClick={handleSendMessage}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'files' && (
                      <motion.div
                        key="tab-files"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <motion.button 
                          onClick={handleUploadFile}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 text-sm font-semibold transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Upload File
                        </motion.button>
                        {selected.files.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <FileUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm">No files yet. Upload documents or resources for the project.</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {selected.files.map(f => (
                              <motion.div 
                                key={f.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors group"
                              >
                                <div className="flex items-center gap-3 text-sm text-gray-800 flex-1 min-w-0">
                                  <LinkIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                  <span className="truncate">{f.name}</span>
                                </div>
                                <div className="text-xs text-gray-500 ml-2">{f.size}</div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="fixed bottom-8 left-8 z-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <a href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 text-gray-900 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 font-medium text-sm border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </a>
        </motion.div>
      </div>
    </div>
  )
}