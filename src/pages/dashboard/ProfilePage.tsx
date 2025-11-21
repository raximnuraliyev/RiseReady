import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Edit,
  Award,
  Shield,
  Users,
  CalendarDays,
  Target,
  Briefcase,
  MessageCircle,
  Link2,
  Github,
  Hash,
  Send,
} from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'
import DiscordLinkCard from '../../components/DiscordLinkCard'
import TelegramLinkCard from '../../components/TelegramLinkCard'
// HIGHLIGHT removed (unused)

type Profile = {
  name: string
  pronouns?: string
  major?: string
  year?: string
  university?: string
  bio?: string
  linkedin?: string
  github?: string
  discord?: string
  telegram?: string
  avatar?: string // final chosen avatar (URL)
  avatarSource?: 'manual' | 'github' | 'linkedin'
  avatarGitHub?: string
  avatarLinkedIn?: string
}

const defaultProfile: Profile = {
  name: '',
  pronouns: '',
  major: '',
  year: '',
  university: '',
  bio: '',
  linkedin: '',
  github: '',
  discord: '',
  telegram: '',
  avatarSource: 'manual',
  avatar: '',
}

// Example stat and activity types for reference:
// { label: 'Study Sessions (week)', value: '8h 45m' }
// { id: 'a1', text: 'Joined group', href: '/dashboard/community' }

export default function ProfilePage() {
  const [localProfile, setLocalProfile] = useState<Profile>(defaultProfile)
  const [tab, setTab] = useState<'overview' | 'edit' | 'security' | 'achievements' | 'connections'>('overview')
  const [showSaved, setShowSaved] = useState(false)

  // Use useProfile hook for profile data and updates
  const { 
    profile: profileData, 
    stats, 
    activity, 
    isLoading, 
    error, 
    updateProfile, 
    refreshData,
    badges,
    levelInfo
  } = useProfile()

  // Update local state when profile data changes
  useEffect(() => {
    if (profileData) {
      setLocalProfile({
        name: profileData.name || '',
        pronouns: profileData.pronouns || '',
        major: profileData.major || '',
        year: profileData.year || '',
        university: profileData.university || '',
        bio: profileData.bio || '',
        linkedin: profileData.linkedin || '',
        github: profileData.github || '',
        discord: profileData.discord || '',
        telegram: profileData.telegram || '',
        avatar: profileData.avatar || '',
        avatarSource: profileData.avatarSource || 'manual',
      })
    }
  }, [profileData])

  function getLevelTitle(level: number) {
    if (level >= 10) return 'Master'
    if (level >= 7) return 'Expert'
    if (level >= 4) return 'Rising Star'
    if (level >= 2) return 'Engaged Scholar'
    return 'Newcomer'
  }

  // Try to auto-fetch avatars when GitHub or LinkedIn links change
  useEffect(() => {
    const fetchGitHub = async (username: string) => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}`)
        if (!res.ok) return
        const data = await res.json()
        const url = data.avatar_url as string | undefined
        if (url) setLocalProfile(prev => {
          const next = { ...prev, avatarGitHub: url }
          // auto-select if user chose github or no source set yet
          if (next.avatarSource === 'github' || !next.avatarSource || next.avatarSource === 'manual') {
            next.avatarSource = 'github'
            next.avatar = url
          }
          return next
        })
      } catch (err) { console.warn('Failed to fetch GitHub avatar', err) }
    }
    const gh = localProfile.github?.trim()
    if (gh) {
      // extract username from URL or handle
      const m = gh.match(/github\.com\/(.+?)(?:\/|$)/i) || gh.match(/^@?([A-Za-z0-9-]+)$/)
      const username = m ? (m[1] || m[0]) : ''
      if (username) fetchGitHub(username)
    }
  }, [localProfile.github])

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(localProfile)
      
      // Update localStorage user data
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      user.name = localProfile.name
      user.avatarUrl = localProfile.avatar
      localStorage.setItem('user', JSON.stringify(user))
      
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2000)
      await refreshData() // Refresh the data to get updated stats/activity
    } catch (err) {
      console.error('Failed to update profile:', err)
      alert('Failed to save profile. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-end gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 grid place-items-center text-3xl shadow-lg">
            {localProfile.avatar ? (
              <img src={localProfile.avatar} alt="avatar" className="w-28 h-28 rounded-full object-cover"/>
            ) : (
              isLoading ? (
                <div className="w-28 h-28 rounded-full bg-white/20 animate-pulse"/>
              ) : <User className="w-10 h-10 text-white" />
            )}
          </div>
              <motion.button onClick={() => setTab('edit')} className="absolute -right-1 -bottom-1 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all" title="Edit profile" whileHover={{ scale: 1.1 }}><Edit className="w-5 h-5 text-blue-600"/></motion.button>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{localProfile.name || 'User'}</h1>
              <p className="text-white/80 mt-1 text-sm">
                {localProfile.major && `${localProfile.major}`}
                {localProfile.year && ` · Class of ${localProfile.year}`}
                {localProfile.university && ` · ${localProfile.university}`}
                {localProfile.pronouns && ` · ${localProfile.pronouns}`}
                {!localProfile.major && !localProfile.year && !localProfile.university && !localProfile.pronouns && 'Complete your profile to get started'}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white text-sm">
                <Award className="w-4 h-4"/>
                {levelInfo ? (
                  <>
                    <span className="font-semibold">Level {levelInfo.level}</span>
                    <span className="ml-1">– {getLevelTitle(levelInfo.level)}</span>
                  </>
                ) : (
                  'Level 1 – Newcomer'
                )}
              </div>
            </div>
            <motion.button onClick={() => setTab('edit')} className="px-6 py-2.5 rounded-lg bg-white text-blue-700 font-semibold shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>Edit Profile</motion.button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        </div>
      )}

      {/* Stats row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-gray-200 rounded mt-2 animate-pulse"></div>
            </div>
          ))
        ) : (
          stats.map(s => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all">
              <div className="text-xs text-gray-600 font-medium uppercase">{s.label}</div>
              <div className="text-2xl mt-2 font-bold text-gray-900">{s.value}</div>
            </motion.div>
          ))
        )}
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex gap-2 overflow-auto border-b border-gray-200">
          {[
            { key: 'overview', label: 'Overview', icon: User },
            { key: 'edit', label: 'Edit Profile', icon: Edit },
            { key: 'security', label: 'Security', icon: Shield },
            { key: 'achievements', label: 'Achievements', icon: Award },
            { key: 'connections', label: 'Connections', icon: Users }
          ].map(({ key, label, icon: Icon }) => (
            <motion.button key={key} onClick={() => setTab(key as 'overview'|'edit'|'security'|'achievements'|'connections')} className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${
              tab === key 
                ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
                : 'border-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            }`} whileHover={{ y: -2 }}>
              <Icon className="w-4 h-4"/> {label}
            </motion.button>
          ))}
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {tab === 'overview' && (
              <motion.div key="tab-overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
                  <ul className="space-y-2">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <li key={i} className="p-3 rounded-lg border border-gray-100">
                          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                        </li>
                      ))
                    ) : activity.length > 0 ? (
                      activity.map(a => (
                        <motion.li key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-between">
                          <span className="text-gray-900">{a.text}</span>
                          <a className="text-xs text-blue-600 font-medium hover:underline" href={a.href}>Open</a>
                        </motion.li>
                      ))
                    ) : (
                      <li className="p-3 rounded-lg border border-gray-100 text-gray-500 text-center">
                        No recent activity
                      </li>
                    )}
                  </ul>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <motion.a href="/dashboard/calendar" className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all flex flex-col items-center gap-2 text-center" whileHover={{ y: -2 }}><CalendarDays className="w-5 h-5 text-blue-600"/> Calendar</motion.a>
                      <motion.a href="/dashboard/focus" className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all flex flex-col items-center gap-2 text-center" whileHover={{ y: -2 }}><Target className="w-5 h-5 text-blue-600"/> Focus</motion.a>
                      <motion.a href="/dashboard/internships" className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all flex flex-col items-center gap-2 text-center" whileHover={{ y: -2 }}><Briefcase className="w-5 h-5 text-blue-600"/> Internships</motion.a>
                      <motion.a href="/dashboard/community" className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all flex flex-col items-center gap-2 text-center" whileHover={{ y: -2 }}><MessageCircle className="w-5 h-5 text-blue-600"/> Community</motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === 'edit' && (
              <motion.div key="tab-edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Edit Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input value={localProfile.name} onChange={e=>setLocalProfile({...localProfile, name: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pronouns</label>
                    <input value={localProfile.pronouns||''} onChange={e=>setLocalProfile({...localProfile, pronouns: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
                    <input value={localProfile.major||''} onChange={e=>setLocalProfile({...localProfile, major: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <input value={localProfile.year||''} onChange={e=>setLocalProfile({...localProfile, year: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                    <input value={localProfile.university||''} onChange={e=>setLocalProfile({...localProfile, university: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Link2 className="w-4 h-4"/> LinkedIn</label>
                    <input 
                      value={localProfile.linkedin || ''} 
                      onChange={e => setLocalProfile({...localProfile, linkedin: e.target.value})} 
                      placeholder="https://linkedin.com/in/..." 
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Github className="w-4 h-4"/> GitHub</label>
                    <input 
                      value={localProfile.github || ''} 
                      onChange={e => setLocalProfile({...localProfile, github: e.target.value})} 
                      placeholder="https://github.com/username" 
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Hash className="w-4 h-4"/> Discord</label>
                    <input 
                      value={localProfile.discord || ''} 
                      onChange={e => setLocalProfile({...localProfile, discord: e.target.value})} 
                      placeholder="username#1234" 
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Send className="w-4 h-4"/> Telegram</label>
                    <input 
                      value={localProfile.telegram || ''} 
                      onChange={e => setLocalProfile({...localProfile, telegram: e.target.value})} 
                      placeholder="@username" 
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea value={localProfile.bio||''} onChange={e=>setLocalProfile({...localProfile, bio: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all" rows={3} placeholder="Tell us about yourself..."/>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Avatar Source</h3>
                  <div className="flex items-center gap-6 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="avatarSource" 
                        checked={(localProfile.avatarSource || 'manual') === 'manual'} 
                        onChange={() => setLocalProfile(prev => ({ ...prev, avatarSource: 'manual', avatar: prev.avatar }))} 
                      /> 
                      <span className="font-medium">Manual</span>
                    </label>
                    <label className={`flex items-center gap-2 cursor-pointer ${localProfile.avatarGitHub ? '' : 'opacity-50 cursor-not-allowed'}`}>
                      <input 
                        type="radio" 
                        name="avatarSource" 
                        disabled={!localProfile.avatarGitHub} 
                        checked={localProfile.avatarSource === 'github'} 
                        onChange={() => setLocalProfile(prev => ({ ...prev, avatarSource: 'github', avatar: prev.avatarGitHub }))} 
                      />
                      <span className="font-medium">GitHub</span>
                      {localProfile.avatarGitHub && (
                        <img src={localProfile.avatarGitHub} alt="gh" className="w-6 h-6 rounded-full"/>
                      )}
                    </label>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">GitHub avatar updates automatically from your public profile.</p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <motion.button
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold disabled:opacity-50 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                  <AnimatePresence>
                    {showSaved && (
                      <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="text-green-600 text-sm font-medium">✓ Saved</motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {tab === 'security' && (
              <motion.div key="tab-security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-lg shadow-md p-6 border border-gray-100 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current password</label>
                      <input type="password" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
                      <input type="password" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"/>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Notifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded"/> <span className="text-sm">Reminders</span></label>
                    <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded"/> <span className="text-sm">Community</span></label>
                    <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded"/> <span className="text-sm">Achievements</span></label>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
                      <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:outline-none transition-all">
                        <option>Everyone</option>
                        <option>Peers</option>
                        <option>Only me</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quiet hours</label>
                      <div className="flex items-center gap-2">
                        <input type="time" defaultValue="22:00" className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:outline-none transition-all" />
                        <span className="text-sm text-gray-600">to</span>
                        <input type="time" defaultValue="07:00" className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <motion.button className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>Save Settings</motion.button>
                </div>
              </motion.div>
            )}

            {tab === 'achievements' && (
              <motion.div key="tab-achievements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Badges</h3>
                  <p className="text-xs text-gray-600">Progress to next level</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                  {(badges && badges.length > 0) ? (
                    badges.map(b => (
                      <motion.div key={b._id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all text-center">
                        <div className="text-3xl mb-2">🏆</div>
                        <div className="text-xs font-medium text-gray-900">{b.badgeName}</div>
                        <div className="text-xxs text-gray-500 mt-1">{new Date(b.earnedAt).toLocaleDateString()}</div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">No badges earned yet. Keep grinding!</div>
                  )}
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Level Progress</h3>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <motion.div 
                      className="h-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-800" 
                      initial={{ width: 0 }}
                      animate={{ width: `${levelInfo?.progressPercent ?? 0}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">{levelInfo ? `${levelInfo.progressPercent}% to Level ${levelInfo.level + 1}` : 'Level progress unavailable'}</p>
                </div>
              </motion.div>
            )}

            {tab === 'connections' && (
              <motion.div key="tab-connections" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-4">Your Groups</h3>
                  <ul className="space-y-2">
                    {[
                      { name: 'Computer Science Hub', href: '/dashboard/community' },
                      { name: 'Coffee & Study', href: '/dashboard/community' },
                    ].map(g => (
                      <motion.li key={g.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-between">
                        <span className="text-gray-900">{g.name}</span>
                        <a className="text-xs text-blue-600 font-medium hover:underline" href={g.href}>View Group</a>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="border-t pt-6 space-y-4">
                  <DiscordLinkCard onLinked={async () => { await refreshData(); setShowSaved(true); setTimeout(()=>setShowSaved(false),2000) }} />
                  <TelegramLinkCard onLinked={async () => { await refreshData(); setShowSaved(true); setTimeout(()=>setShowSaved(false),2000) }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}