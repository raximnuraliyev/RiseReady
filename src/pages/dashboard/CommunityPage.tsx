import { useState, useEffect } from 'react'
import type { ChangeEvent, MouseEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Search,
  Plus,
  TrendingUp,
  Clock,
  UserPlus,
  Check,
  Filter,
  Sparkles,
  X
} from 'lucide-react'
import DashboardBackground from '../../components/DashboardBackgrounds'
import { formatDistanceToNow } from 'date-fns'

export type StudyGroup = {
  id: string
  name: string
  category: string
  icon: string
  members: number
  description: string
  tags: string[]
  isJoined: boolean
  color: string
  lastActive: Date
  private?: boolean
  joinCode?: string
  leaderId?: string
  membersList?: string[]
}


export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('All')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newGroup, setNewGroup] = useState({ name: '', description: '', tags: '' })
  const currentUserId = 'me'

  const [groups, setGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: 'Computer Science Hub',
      category: 'Major',
      icon: '💻',
      members: 234,
      description: 'Connect with fellow CS students, share resources, and collaborate on projects',
      tags: ['Coding', 'Algorithms', 'Projects'],
      isJoined: true,
      color: '#3B82F6',
      lastActive: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: '2',
      name: 'Study Buddies - Business',
      category: 'Major',
      icon: '📊',
      members: 189,
      description: 'Business majors supporting each other through coursework and career prep',
      tags: ['Business', 'Finance', 'Marketing'],
      isJoined: true,
      color: '#10B981',
      lastActive: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: '3',
      name: 'First Year Friends',
      category: 'Year',
      icon: '🎓',
      members: 312,
      description: 'Freshman support group - navigate college life together!',
      tags: ['Freshman', 'Social', 'Events'],
      isJoined: false,
      color: '#F59E0B',
      lastActive: new Date(Date.now() - 1000 * 60 * 45)
    },
    {
      id: '4',
      name: 'Design & Creative',
      category: 'Interest',
      icon: '🎨',
      members: 156,
      description: 'For designers, artists, and creative minds to share work and get feedback',
      tags: ['Design', 'Art', 'Portfolio'],
      isJoined: false,
      color: '#EC4899',
      lastActive: new Date(Date.now() - 1000 * 60 * 60)
    },
    {
      id: '5',
      name: 'Coffee & Study',
      category: 'Social',
      icon: '☕',
      members: 278,
      description: 'Casual study sessions at local cafes. Meet new friends!',
      tags: ['Social', 'Coffee', 'Study'],
      isJoined: true,
      color: '#8B5CF6',
      lastActive: new Date(Date.now() - 1000 * 60 * 90)
    },
    {
      id: '6',
      name: 'International Students',
      category: 'Community',
      icon: '🌍',
      members: 201,
      description: 'Support network for international students adjusting to campus life',
      tags: ['International', 'Culture', 'Support'],
      isJoined: false,
      color: '#06B6D4',
      lastActive: new Date(Date.now() - 1000 * 60 * 120)
    },
    {
      id: '7',
      name: 'Math Study Group',
      category: 'Subject',
      icon: '📐',
      members: 167,
      description: 'Tackle calculus, algebra, and stats together',
      tags: ['Math', 'Calculus', 'Help'],
      isJoined: false,
      color: '#EF4444',
      lastActive: new Date(Date.now() - 1000 * 60 * 150)
    },
    {
      id: '8',
      name: 'Night Owls',
      category: 'Schedule',
      icon: '🦉',
      members: 143,
      description: 'Late-night study crew for those who work best after dark',
      tags: ['Night', 'Study', 'Flexible'],
      isJoined: false,
      color: '#6366F1',
      lastActive: new Date(Date.now() - 1000 * 60 * 180)
    },
  ])

  // Try to load dynamic groups from the backend if available
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/community/groups')
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        if (Array.isArray(data) && data.length > 0) {
          // map incoming data to StudyGroup shape where possible
          setGroups(data.map((g: Record<string, unknown>) => {
            const membersVal = g['members'] ?? g['membersCount']
            return {
              id: String(g['_id'] ?? g['id'] ?? ''),
              name: String(g['name'] ?? ''),
              category: String(g['category'] ?? 'Major'),
              icon: String(g['icon'] ?? '👥'),
              members: typeof membersVal === 'number' ? membersVal : 0,
      
              description: String(g['description'] ?? ''),
              tags: Array.isArray(g['tags']) ? (g['tags'] as string[]) : [],
              isJoined: Boolean(g['isJoined']),
              color: String(g['color'] ?? '#3B82F6'),
              lastActive: g['lastActive'] ? new Date(String(g['lastActive'])) : new Date()
            }
          }))
        }
      } catch (err) {
        console.warn('Failed to load community groups, using local samples', err)
      }
    })()
    return () => { cancelled = true }
  }, [])

  // posts are not implemented yet; keep placeholder off state to avoid unused variable lint
  const [showManage, setShowManage] = useState<{open:boolean, groupId?:string}>({open:false})

  const categories = ['All', 'Major', 'Year', 'Interest', 'Social', 'Subject', 'Community', 'Schedule']

  const handleJoinToggle = (groupId: string) => {
    // Optimistic UI update
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, isJoined: !group.isJoined } : group
    ))

    // Try to notify backend; if it fails, we keep optimistic local state
    try {
      const g = groups.find(g => g.id === groupId)
      const action = g?.isJoined ? 'leave' : 'join'
      fetch(`/api/community/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId })
      }).catch((err) => console.warn('Failed to notify backend about join/leave', err))
    } catch (err) { console.warn('Failed to notify join/leave', err) }
  }


  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = filterCategory === 'All' || group.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const myGroups = groups.filter(g => g.isJoined)
  const availableGroups = filteredGroups.filter(g => !g.isJoined)

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#FFF5F7] via-[#F0F4FF] to-[#FFF9E6] pb-20">
      <DashboardBackground variant="community" />
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#EC4899] to-[#F43F5E] rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1F4E79]">Community</h1>
                <p className="text-sm text-gray-600 mt-0.5">Connect, collaborate, and grow together 🤝</p>
              </div>
            </div>
            <motion.button
              onClick={() => setShowCreatePost(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-[#EC4899] to-[#F43F5E] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Private Group
            </motion.button>
          </div>

          {/* Search & Filter */}
          <div className="mt-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find peers by major, year, interests..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#EC4899] focus:outline-none transition-colors"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-12 pr-8 py-3 rounded-xl border-2 border-gray-200 focus:border-[#EC4899] focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Groups Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Groups */}
            {myGroups.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-[#1F4E79] flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#EC4899]" />
                    My Groups
                  </h2>
                  <span className="text-sm text-gray-600">{myGroups.length} joined</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myGroups.map((group, index) => (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="bg-white rounded-2xl shadow-lg p-6 border-2 hover:shadow-2xl transition-all cursor-pointer"
                      style={{ borderColor: `${group.color}40` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md"
                            style={{ backgroundColor: `${group.color}20` }}
                          >
                            {group.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-[#1F4E79]">{group.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>{group.members} members</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{group.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {group.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="px-3 py-1 rounded-lg text-xs font-semibold"
                            style={{ backgroundColor: `${group.color}20`, color: group.color }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>Active {formatDistanceToNow(group.lastActive, { addSuffix: true })}</span>
                          {group.private && group.leaderId === currentUserId && group.joinCode && (
                            <span className="ml-3 px-2 py-0.5 rounded bg-gray-100 text-gray-600">Code: {group.joinCode}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {group.leaderId === currentUserId && (
                            <button
                              onClick={(e)=>{e.stopPropagation(); setShowManage({open:true, groupId: group.id})}}
                              className="px-3 py-2 rounded-xl border-2 border-gray-200 text-sm"
                            >
                              Manage
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleJoinToggle(group.id)
                            }}
                            className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
                            style={{ backgroundColor: `${group.color}20`, color: group.color }}
                          >
                            <Check className="w-4 h-4" />
                            Joined
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Groups */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#1F4E79] flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-[#10B981]" />
                  Discover Groups
                </h2>
                <span className="text-sm text-gray-600">{availableGroups.length} available</span>
              </div>
              {availableGroups.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-[#1F4E79] mb-2">No groups found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableGroups.map((group, index) => (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100 hover:border-[#EC4899]/50 hover:shadow-xl transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md"
                            style={{ backgroundColor: `${group.color}20` }}
                          >
                            {group.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-[#1F4E79]">{group.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>{group.members} members</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{group.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {group.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="px-3 py-1 rounded-lg text-xs font-semibold"
                            style={{ backgroundColor: `${group.color}20`, color: group.color }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>Active {formatDistanceToNow(group.lastActive, { addSuffix: true })}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleJoinToggle(group.id)
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-[#EC4899] to-[#F43F5E] text-white rounded-xl font-semibold text-sm hover:scale-105 transition-transform flex items-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          Join
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column intentionally left empty for now */}
          <div></div>
        </div>
      </div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreatePost(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                onClick={(e: MouseEvent) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-br from-[#EC4899] to-[#F43F5E] p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Create Private Group</h2>
                    <button
                      onClick={() => setShowCreatePost(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-all"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                  <p className="text-white/90 mt-1">Share with your community</p>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Group name</label>
                    <input value={newGroup.name} onChange={(e: ChangeEvent<HTMLInputElement>)=>setNewGroup({...newGroup,name:e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200" placeholder="e.g., Algorithms Ninjas"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea value={newGroup.description} onChange={(e: ChangeEvent<HTMLTextAreaElement>)=>setNewGroup({...newGroup,description:e.target.value})} className="w-full h-28 px-4 py-3 rounded-xl border-2 border-gray-200"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (comma separated)</label>
                    <input value={newGroup.tags} onChange={(e: ChangeEvent<HTMLInputElement>)=>setNewGroup({...newGroup,tags:e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200" placeholder="Algorithms, DS, Study"/>
                  </div>
                  <button
                    onClick={() => {
                      if(!newGroup.name.trim()) return;
                      const code = `${Math.floor(100000+Math.random()*900000)}-${String.fromCharCode(65+Math.floor(Math.random()*26))}${String.fromCharCode(65+Math.floor(Math.random()*26))}`
                      const g: StudyGroup = {
                        id: Date.now().toString(), name: newGroup.name.trim(), category:'Interest', icon:'👥', members:1, description:newGroup.description||'', tags: newGroup.tags.split(',').map(t=>t.trim()).filter(Boolean), isJoined:true, color:'#3B82F6', lastActive:new Date(), private:true, joinCode:code, leaderId: currentUserId
                      }
                      setGroups([g,...groups]); setShowCreatePost(false); setNewGroup({name:'',description:'',tags:''})
                    }}
                    className="w-full py-4 bg-gradient-to-r from-[#EC4899] to-[#F43F5E] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Create Group (Private)
                  </button>
                  <p className="text-xs text-gray-600">A join code will be generated and visible to the leader.</p>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Manage Group Modal (leader only) */}
      <AnimatePresence>
        {showManage.open && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowManage({open:false})} className="fixed inset-0 bg-black/60 backdrop-blur-md z-50" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{opacity:0, scale:0.95, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.95, y:20}} className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6" onClick={(e: MouseEvent)=>e.stopPropagation()}>
                {(() => {
                  const g = groups.find(gr=>gr.id===showManage.groupId)
                  if(!g) return <div/>;
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-[#1F4E79] text-xl">Manage Group</div>
                        <button onClick={()=>setShowManage({open:false})} className="p-2 border-2 rounded-lg"><X className="w-4 h-4"/></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input defaultValue={g.name} onChange={(e: ChangeEvent<HTMLInputElement>)=>g.name= e.target.value} className="px-3 py-2 rounded-lg border-2 border-gray-200" />
                        <input defaultValue={g.tags.join(', ')} onChange={(e: ChangeEvent<HTMLInputElement>)=>g.tags= e.target.value.split(',').map(t=>t.trim()).filter(Boolean)} className="px-3 py-2 rounded-lg border-2 border-gray-200" />
                        <textarea defaultValue={g.description} onChange={(e: ChangeEvent<HTMLTextAreaElement>)=>g.description= e.target.value} className="md:col-span-2 px-3 py-2 rounded-lg border-2 border-gray-200" rows={3}/>
                      </div>
                      <div className="text-sm text-gray-700 flex items-center gap-3">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked={!!g.private} onChange={(e)=>{ g.private = e.target.checked; if(e.target.checked && !g.joinCode){ g.joinCode = `${Math.floor(100000+Math.random()*900000)}-${String.fromCharCode(65+Math.floor(Math.random()*26))}${String.fromCharCode(65+Math.floor(Math.random()*26))}` } }} />
                          <span>Enable join-by-code</span>
                        </label>
                        <div>
                          Join code: <span className="font-mono px-2 py-0.5 rounded bg-gray-100">{g.private && g.joinCode ? g.joinCode : '—'}</span>
                        </div>
                        {g.private && (
                          <button onClick={()=>{ g.joinCode = `${Math.floor(100000+Math.random()*900000)}-${String.fromCharCode(65+Math.floor(Math.random()*26))}${String.fromCharCode(65+Math.floor(Math.random()*26))}` }} className="px-2 py-1 border-2 rounded-lg text-xs">Regenerate</button>
                        )}
                      </div>
                      <div className="text-sm text-gray-700">Members</div>
                      <ul className="space-y-2">
                        {(g.membersList||['You','Member A','Member B']).map((m,idx)=> (
                          <li key={idx} className="flex items-center justify-between p-2 rounded-lg border-2 border-gray-100">
                            <span>{m}</span>
                            {m!=='You' && (
                              <button onClick={()=>{ const updated=groups.map(gr=> gr.id===g.id?{...gr, members: Math.max(0,gr.members-1), membersList:(gr.membersList||['You','Member A','Member B']).filter(x=>x!==m)}:gr); setGroups(updated)}} className="text-red-600 text-sm">Remove</button>
                            )}
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-end">
                        <button onClick={()=>{ setGroups(groups.map(gr=> gr.id===g.id?{...g}:gr)); setShowManage({open:false}) }} className="px-5 py-2 rounded-lg bg-[#1F4E79] text-white font-semibold">Save</button>
                      </div>
                    </div>
                  )
                })()}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
