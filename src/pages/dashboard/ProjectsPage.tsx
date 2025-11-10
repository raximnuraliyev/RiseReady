import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  CalendarDays as CalendarIcon,
  CalendarClock,
  Users,
  MessageSquare,
  FileText,
  CheckSquare,
  Upload,
  Paperclip,
  ArrowLeft,
  PencilLine as Pencil,
  Check,
  X,
  KeyRound,
  Copy,
  ClipboardCheck,
  UserPlus,
  UserMinus,
  Crown,
  Loader2
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

export default function ProjectsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'tasks' | 'chat' | 'files'>('tasks')
  const [currentUserId] = useState('1') // TODO: Get from auth context
  
  const { 
    projects, 
    loading, 
    error, 
    createProject, 
    updateProject, 
    leaveProject, 
    joinProject,
    addTask, 
    toggleTask, 
    addMessage, 
    uploadFile 
  } = useProjects()
  const [showNewForm, setShowNewForm] = useState(false)
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
      } catch (err) {
        console.warn('Failed to create project', err)
        toast.error('Failed to create project')
      }
    })()
  }

  // Handle project operations
  const handleCreateProject = async (formData: FormData) => {
    const title = formData.get('title')?.toString() ?? ''
    const description = formData.get('description')?.toString() ?? ''
    const dueDate = formData.get('dueDate')?.toString() ?? ''

    // Validation
    if (!title.trim() || !dueDate) {
      toast.error('Title and due date are required')
      return
    }

    try {
      await createProject({ title, description, dueDate })
      setShowNewForm(false)
      toast.success('Project created successfully')
    } catch (err) {
      toast.error('Failed to create project')
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      await leaveProject(projectId)
      if (selectedId === projectId) {
        setSelectedId(null)
      }
      toast.success('Left project successfully')
    } catch (err) {
      console.error(err)
      toast.error('Failed to leave project')
    }
  }

  // Join by code
  const joinByCode = async () => {
    if (!joinCodeInput.trim()) return
    try {
      const created = await joinProject(joinCodeInput.trim())
      setSelectedId(created.id)
      toast.success('Joined project')
      setJoinCodeInput('')
    } catch (err) {
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
      const newMembers = selected.members.filter(m => m.id !== memberId)
      // Use axios directly to update members to avoid typing mismatch
      await axios.put(`/api/projects/${selected.id}`, { members: newMembers })
      toast.success('Member removed')
    } catch (err) {
      console.error(err)
      toast.error('Failed to remove member')
    }
  }

  // Add a simple task
  const handleAddTaskClick = async () => {
    if (!selected) return
    try {
      await addTask(selected.id, { title: 'New task' })
      toast.success('Task added')
    } catch (err) {
      console.error(err)
      toast.error('Failed to add task')
    }
  }

  const handleToggleTask = async (taskId: string) => {
    if (!selected) return
    try {
      await toggleTask(selected.id, taskId)
    } catch (err) {
      console.error(err)
      toast.error('Failed to update task')
    }
  }

  const handleAddTask = async (taskName: string) => {
    if (!selected) return
    try {
      await addTask(selected.id, { title: taskName })
      toast.success('Task added successfully')
    } catch (err) {
      console.error(err)
      toast.error('Failed to add task')
    }
  }

  const handleAddMessage = async (text: string) => {
    if (!selected) return
    try {
      await addMessage(selected.id, text)
    } catch (err) {
      console.error(err)
      toast.error('Failed to send message')
    }
  }

  const handleUploadFile = async (file: File) => {
    if (!selected) return
    try {
      await uploadFile(selected.id, file)
      toast.success('File uploaded successfully')
    } catch (err) {
      console.error(err)
      toast.error('Failed to upload file')
    }
  }

  const handleSaveTitle = async (title: string) => {
    if (!selected || !title.trim()) return
    try {
      await updateProject(selected.id, { title } as any)
      setEditingTitle(false)
    } catch (err) {
      console.error(err)
      toast.error('Failed to update project title')
    }
  }

  const handleSaveDueDate = async (dueDate: string) => {
    if (!selected || !dueDate) return
    try {
      await updateProject(selected.id, { dueDate } as any)
      setEditingDue(false)
    } catch (err) {
      console.error(err)
      toast.error('Failed to update project due date')
    }
  }

  const handleCopyInvite = async () => {
    if (!selected) return
    try {
      await navigator.clipboard.writeText(selected.joinCode)
      setInviteCopied(true)
      setTimeout(() => setInviteCopied(false), 1500)
    } catch (err) {
      console.error(err)
      setInviteCopied(false)
      toast.error('Failed to copy invite code')
    }
  }

  const isLeader = selected ? selected.leaderId === currentUserId : false

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F6FF] via-[#FFF8F0] to-[#F5F7FA]">
      {/* Hero */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#37A6FF] to-[#1F4E79] text-white flex items-center justify-center shadow-md">
              📁
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1F4E79]">Your Projects</h1>
              <p className="text-sm text-gray-600">Plan, track, and collaborate with your team</p>
            </div>
          </div>
          <motion.button onClick={addProject} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="px-5 py-3 rounded-xl bg-[#37A6FF] text-white font-semibold shadow-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Project
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Join by code - moved out of project detail */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-4 flex flex-wrap items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#1F4E79]" />
            <input
              placeholder="Paste invite code (6 digits + 2 letters)"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value)}
              className="px-3 py-2 rounded-lg border-2 border-gray-200 text-sm flex-1 min-w-[220px]"
            />
            <button onClick={joinByCode} disabled={!joinCodeInput.trim()} className="px-3 py-2 rounded-lg bg-[#37A6FF] text-white text-sm disabled:opacity-50">
              Join
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">Joins as your current profile (set with localStorage.setItem('currentUserId','1')).</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* List / Cards */}
          <div className="lg:col-span-2 space-y-3">
            {selected && (
              <button onClick={() => setSelectedId(null)} className="lg:hidden inline-flex items-center gap-2 text-[#1F4E79] mb-2">
                <ArrowLeft className="w-4 h-4" /> Back to list
              </button>
            )}
            {projects.map((p, index) => (
              <motion.button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className={`w-full text-left bg-white rounded-2xl border-2 p-4 shadow-sm hover:shadow-md transition-all ${(selectedId === p.id) ? 'border-[#37A6FF]/50' : 'border-gray-100'}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-[#1F4E79]">{p.title}</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Due {formatDue(p.dueDate)}</span>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {p.members.slice(0,4).map(m => (
                      <div key={m.id} title={m.name} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-sm">
                        {m.avatar}
                      </div>
                    ))}
                    {p.members.length > 4 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 text-xs flex items-center justify-center">+{p.members.length-4}</div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.progress}%` }}
                      transition={{ delay: 0.1, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-[#37A6FF] to-[#1F4E79]"
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-600">{p.progress}% complete</div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Detail View */}
          <div className="lg:col-span-3">
            {!selected ? (
              <div className="hidden lg:flex items-center justify-center h-full text-gray-500 border-2 border-dashed rounded-2xl p-10">
                Select a project to view details
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {editingTitle ? (
                        <div className="flex items-center gap-2">
                          <input
                            value={tempTitle}
                            onChange={(e) => setTempTitle(e.target.value)}
                            className="px-3 py-2 border-2 border-[#37A6FF] rounded-lg font-bold text-[#1F4E79] w-full max-w-md"
                          />
                          <button onClick={saveTitle} className="p-2 rounded-lg bg-[#EAF7FF] text-[#1F4E79] border border-[#37A6FF]" title="Save">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => { setEditingTitle(false); setTempTitle(selected.title) }} className="p-2 rounded-lg border-2 border-gray-200" title="Cancel">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold text-[#1F4E79] truncate">{selected.title}</h2>
                          <button onClick={() => setEditingTitle(true)} className="p-2 rounded-lg border-2 border-gray-200 hover:bg-gray-50" title="Edit title">
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    <div className="mt-1 text-sm text-gray-600 flex items-center gap-2">
                        <CalendarClock className="w-4 h-4" />
                        {editingDue ? (
                          <>
                            <input
                              type="date"
                              value={tempDueIso.slice(0,10)}
                              onChange={(e) => setTempDueIso(new Date(e.target.value).toISOString())}
                              className="px-2 py-1 border-2 border-[#37A6FF] rounded-lg text-sm"
                            />
                            <button onClick={saveDue} className="p-1.5 rounded-lg bg-[#EAF7FF] border border-[#37A6FF]" title="Save date"><Check className="w-4 h-4" /></button>
                            <button onClick={() => { setEditingDue(false); setTempDueIso(selected.dueDate) }} className="p-1.5 rounded-lg border-2 border-gray-200" title="Cancel"><X className="w-4 h-4" /></button>
                          </>
                        ) : (
                          <>
                            <span>Due {formatDue(selected.dueDate)}</span>
                            <button onClick={() => setEditingDue(true)} className="p-1.5 rounded-lg border-2 border-gray-200 hover:bg-gray-50" title="Edit date">
                              <CalendarIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <span className="mx-2">•</span>
                        <Users className="w-4 h-4" /> {selected.members.length}
                      </div>
                    </div>
                  </div>

                  {/* Members + Invite Code & Leader Controls */}
                  <div className="mt-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-wrap gap-2 items-center">
                        {selected.members.map(m => (
                            <div key={m.id} className="relative">
                            <div title={m.name} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-sm">
                              {m.avatar}
                            </div>
                            {m.id === selected.leaderId && (
                              <Crown className="w-3 h-3 text-amber-500 absolute -top-2 -right-2" />
                            )}
                            {isLeader && m.id !== selected.leaderId && (
                              <button
                                onClick={() => handleRemoveMember(m.id)}
                                className="absolute -bottom-2 -right-2 bg-white border border-gray-200 rounded-full p-0.5 hover:bg-gray-50"
                                title={`Remove ${m.name}`}
                              >
                                <UserMinus className="w-3 h-3 text-red-600" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                        <div className="ml-auto flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm flex items-center gap-2 select-all">
                          <KeyRound className="w-4 h-4 text-gray-600" />
                          <span>{selected.joinCode}</span>
                        </div>
                        <button onClick={handleCopyInvite} className="px-3 py-2 rounded-lg border-2 border-gray-200 hover:bg-gray-50 text-sm inline-flex items-center gap-2" title="Copy invite code">
                          {inviteCopied ? <ClipboardCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />} {inviteCopied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    
                  </div>
                </div>

                  {/* Tabs */}
                  <div className="px-4 pt-4">
                    <div className="flex gap-2 items-center">
                      {[
                        { key: 'tasks', label: 'Tasks', icon: CheckSquare },
                        { key: 'chat', label: 'Chat', icon: MessageSquare },
                        { key: 'files', label: 'Files', icon: FileText },
                      ].map(({ key, label, icon: Icon }) => (
                        <button
                          key={key}
                          onClick={() => setActiveTab(key as 'tasks'|'chat'|'files')}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 border-2 ${activeTab === key ? 'bg-[#EAF7FF] border-[#37A6FF] text-[#1F4E79]' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                        >
                          <Icon className="w-4 h-4" /> {label}
                        </button>
                      ))}
                      {isLeader && (
                        <span className="ml-auto inline-flex items-center gap-1 text-xs text-amber-600 font-semibold">
                          <Crown className="w-4 h-4" /> Leader controls enabled
                        </span>
                      )}
                    </div>
                  </div>

                {/* Tab content */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === 'tasks' && (
                      <motion.div
                        key="tab-tasks"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                      >
                        {selected.tasks.length === 0 ? (
                          <div className="text-sm text-gray-600">No tasks yet. Add your first task to get started.</div>
                        ) : (
                          selected.tasks.map(t => (
                            <label key={t.id} className="flex items-center gap-3 p-3 border-2 border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer">
                              <input type="checkbox" checked={t.done} onChange={() => handleToggleTask(t.id)} className="w-4 h-4" />
                              <span className={`text-sm ${t.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{t.title}</span>
                            </label>
                          ))
                        )}

                        <div className="pt-2">
                          <button
                            onClick={() => handleAddTaskClick()}
                            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
                          >
                            + Add task
                          </button>
                        </div>
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
                        <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                          {selected.messages.length === 0 ? (
                            <div className="text-sm text-gray-600">No messages yet. Start the conversation!</div>
                          ) : (
                            selected.messages.map(m => (
                              <div key={m.id} className="p-3 rounded-xl bg-[#F6FAFF] border border-[#EAF2FF]">
                                  <div className="text-xs text-gray-500 mb-1">{(m.author as TeamMember)?.name || String(m.author)} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                  <div className="text-sm text-gray-800">{m.text}</div>
                                </div>
                            ))
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <input id="chat-input" placeholder="Message your team…" className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#37A6FF] outline-none" />
                          </div>
                          <button className="px-4 py-2 rounded-lg bg-[#37A6FF] text-white text-sm font-semibold">Send</button>
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
                        className="space-y-3"
                      >
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm">
                          <Upload className="w-4 h-4" /> Upload
                        </button>
                        {selected.files.length === 0 ? (
                          <div className="text-sm text-gray-600">No files yet.</div>
                        ) : (
                          <div className="space-y-2">
                            {selected.files.map(f => (
                              <div key={f.id} className="flex items-center justify-between p-3 border-2 border-gray-100 rounded-xl">
                                <div className="flex items-center gap-2 text-sm text-gray-800">
                                  <Paperclip className="w-4 h-4 text-gray-500" />
                                  {f.name}
                                </div>
                                <div className="text-xs text-gray-500">{f.size}</div>
                              </div>
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
    </div>
  )
}