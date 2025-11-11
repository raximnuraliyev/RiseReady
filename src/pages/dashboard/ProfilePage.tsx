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
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-[#EAF7FF] via-white to-[#FFF7E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-end gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-[#EAF7FF] grid place-items-center text-3xl shadow">
            {localProfile.avatar ? (
              <img src={localProfile.avatar} alt="avatar" className="w-28 h-28 rounded-full object-cover"/>
            ) : (
              isLoading ? (
                <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse"/>
              ) : '😊'
            )}
          </div>
              <button onClick={() => setTab('edit')} className="absolute -right-1 -bottom-1 p-2 rounded-full bg-white border shadow hover:bg-gray-50" title="Edit profile"><Edit className="w-4 h-4 text-[#1F4E79]"/></button>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-[#1F4E79]">{localProfile.name || 'User'}</h1>
              <p className="text-gray-600 mt-1">
                {localProfile.major && `${localProfile.major}`}
                {localProfile.year && ` · Class of ${localProfile.year}`}
                {localProfile.university && ` · ${localProfile.university}`}
                {localProfile.pronouns && ` · ${localProfile.pronouns}`}
                {!localProfile.major && !localProfile.year && !localProfile.university && !localProfile.pronouns && 'Complete your profile to get started'}
              </p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF7E6] text-[#A16207] text-sm">
                <Award className="w-4 h-4"/>
                {levelInfo ? (
                  <>
                    <span className="font-semibold">Level {levelInfo.level}</span>
                    <span className="ml-2">– {getLevelTitle(levelInfo.level)}</span>
                  </>
                ) : (
                  'Level 1 – Newcomer'
                )}
              </div>
            </div>
            <button onClick={() => setTab('edit')} className="px-4 py-2 rounded-lg bg-[#37A6FF] text-white font-semibold">Edit Profile</button>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-5 border border-gray-100">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-gray-200 rounded mt-2 animate-pulse"></div>
            </div>
          ))
        ) : (
          stats.map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-5 border border-gray-100">
              <div className="text-sm text-gray-600">{s.label}</div>
              <div className="text-2xl mt-1 font-extrabold text-[#1F4E79]">{s.value}</div>
            </div>
          ))
        )}
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex gap-2 overflow-auto">
          {[
            { key: 'overview', label: 'Overview', icon: User },
            { key: 'edit', label: 'Edit Profile', icon: Edit },
            { key: 'security', label: 'Security & Preferences', icon: Shield },
            { key: 'achievements', label: 'Achievements', icon: Award },
            { key: 'connections', label: 'Connections', icon: Users }
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key as 'overview'|'edit'|'security'|'achievements'|'connections')} className={`px-4 py-2 rounded-xl border-2 text-sm flex items-center gap-2 ${tab===key ? 'bg-[#EAF7FF] border-[#37A6FF] text-[#1F4E79]' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
              <Icon className="w-4 h-4"/> {label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {tab === 'overview' && (
              <motion.div key="tab-overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow p-5 border border-gray-100">
                  <div className="font-bold text-[#1F4E79] mb-3">Recent Activity</div>
                  <ul className="space-y-3">
                    {isLoading ? (
                      // Loading skeleton for activity
                      Array(3).fill(0).map((_, i) => (
                        <li key={i} className="p-3 rounded-lg border-2 border-gray-100">
                          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                        </li>
                      ))
                    ) : activity.length > 0 ? (
                      activity.map(a => (
                        <li key={a.id} className="p-3 rounded-lg border-2 border-gray-100 flex items-center justify-between">
                          <span className="text-[#1F4E79]">{a.text}</span>
                          <a className="text-sm text-[#1F4E79] underline" href={a.href}>Open</a>
                        </li>
                      ))
                    ) : (
                      <li className="p-3 rounded-lg border-2 border-gray-100 text-gray-500 text-center">
                        No recent activity
                      </li>
                    )}
                  </ul>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
                    <div className="font-bold text-[#1F4E79] mb-3">Your Tools</div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <a href="/dashboard/calendar" className="p-3 rounded-lg border-2 border-gray-100 hover:bg-gray-50 flex items-center gap-2"><CalendarDays className="w-4 h-4"/> Calendar</a>
                      <a href="/dashboard/focus" className="p-3 rounded-lg border-2 border-gray-100 hover:bg-gray-50 flex items-center gap-2"><Target className="w-4 h-4"/> Focus</a>
                      <a href="/dashboard/internships" className="p-3 rounded-lg border-2 border-gray-100 hover:bg-gray-50 flex items-center gap-2"><Briefcase className="w-4 h-4"/> Internships</a>
                      <a href="/dashboard/community" className="p-3 rounded-lg border-2 border-gray-100 hover:bg-gray-50 flex items-center gap-2"><MessageCircle className="w-4 h-4"/> Community</a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === 'edit' && (
              <motion.div key="tab-edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-xl shadow p-5 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <input value={localProfile.name} onChange={e=>setLocalProfile({...localProfile, name: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#37A6FF]"/>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Pronouns</label>
                    <input value={localProfile.pronouns||''} onChange={e=>setLocalProfile({...localProfile, pronouns: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#37A6FF]"/>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Major</label>
                    <input value={localProfile.major||''} onChange={e=>setLocalProfile({...localProfile, major: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#37A6FF]"/>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Year</label>
                    <input value={localProfile.year||''} onChange={e=>setLocalProfile({...localProfile, year: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#37A6FF]"/>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">University</label>
                    <input value={localProfile.university||''} onChange={e=>setLocalProfile({...localProfile, university: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#37A6FF]"/>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-600">Bio</label>
                    <textarea value={localProfile.bio||''} onChange={e=>setLocalProfile({...localProfile, bio: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#37A6FF]" rows={3}/>
                  </div>
                  
                  <div className="md:col-span-2 mt-4 flex items-center gap-4">
                    <button 
                      onClick={handleUpdateProfile}
                      disabled={isLoading}
                      className="px-4 py-2 rounded-lg bg-[#37A6FF] text-white font-semibold disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    {showSaved && (
                      <span className="text-green-600 text-sm">✓ Changes saved successfully</span>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 flex items-center gap-2"><Link2 className="w-4 h-4"/> LinkedIn</label>
                    <input 
                      value={localProfile.linkedin || ''} 
                      onChange={e => setLocalProfile({...localProfile, linkedin: e.target.value})} 
                      placeholder="https://linkedin.com/in/..." 
                      className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#37A6FF]"
                    />
                    {localProfile.avatarLinkedIn && (
                      <div className="mt-1 text-xs text-gray-600">LinkedIn avatar ready</div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 flex items-center gap-2"><Github className="w-4 h-4"/> GitHub</label>
                    <input 
                      value={localProfile.github || ''} 
                      onChange={e => setLocalProfile({...localProfile, github: e.target.value})} 
                      placeholder="https://github.com/username" 
                      className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#37A6FF]"
                    />
                    {localProfile.avatarGitHub && (
                      <div className="mt-1 text-xs text-gray-600">GitHub avatar detected</div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 flex items-center gap-2"><Hash className="w-4 h-4"/> Discord</label>
                    <input 
                      value={localProfile.discord || ''} 
                      onChange={e => setLocalProfile({...localProfile, discord: e.target.value})} 
                      placeholder="username#1234" 
                      className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#37A6FF]"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 flex items-center gap-2"><Send className="w-4 h-4"/> Telegram</label>
                    <input 
                      value={localProfile.telegram || ''} 
                      onChange={e => setLocalProfile({...localProfile, telegram: e.target.value})} 
                      placeholder="@username" 
                      className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#37A6FF]"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-1">Avatar source</div>
                    <div className="flex items-center gap-4 text-sm">
                      <label className="inline-flex items-center gap-1">
                        <input 
                          type="radio" 
                          name="avatarSource" 
                          checked={(localProfile.avatarSource || 'manual') === 'manual'} 
                          onChange={() => setLocalProfile(prev => ({ ...prev, avatarSource: 'manual', avatar: prev.avatar }))} 
                        /> 
                        Manual
                      </label>
                      <label className={`inline-flex items-center gap-2 ${localProfile.avatarGitHub ? '' : 'opacity-50'}`}>
                        <input 
                          type="radio" 
                          name="avatarSource" 
                          disabled={!localProfile.avatarGitHub} 
                          checked={localProfile.avatarSource === 'github'} 
                          onChange={() => setLocalProfile(prev => ({ ...prev, avatarSource: 'github', avatar: prev.avatarGitHub }))} 
                        />
                        GitHub {localProfile.avatarGitHub && (
                          <img src={localProfile.avatarGitHub} alt="gh" className="w-6 h-6 rounded-full"/>
                        )}
                      </label>
                      <label className={`inline-flex items-center gap-2 ${localProfile.avatarLinkedIn ? '' : 'opacity-50'}`}>
                        <input 
                          type="radio" 
                          name="avatarSource" 
                          disabled={!localProfile.avatarLinkedIn} 
                          checked={localProfile.avatarSource === 'linkedin'} 
                          onChange={() => setLocalProfile(prev => ({ ...prev, avatarSource: 'linkedin', avatar: prev.avatarLinkedIn }))} 
                        />
                        LinkedIn {localProfile.avatarLinkedIn && (
                          <img src={localProfile.avatarLinkedIn} alt="li" className="w-6 h-6 rounded-full"/>
                        )}
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      GitHub avatar updates automatically from your public profile. LinkedIn avatar requires a backend proxy endpoint at /api/linkedin/avatar.
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={handleUpdateProfile} className="px-5 py-2 rounded-lg bg-[#37A6FF] text-white font-semibold">Save</button>
                  </div>
                </div>
                <AnimatePresence>
                  {showSaved && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mt-3 text-[#1F4E79]">Profile updated!</motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {tab === 'security' && (
              <motion.div key="tab-security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-xl shadow p-5 border border-gray-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Current password</label>
                    <input type="password" className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#37A6FF]"/>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">New password</label>
                    <input type="password" className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#37A6FF]"/>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked/> Reminders</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked/> Community</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked/> Achievements</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm text-gray-600">Privacy</div>
                    <select className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-gray-200">
                      <option>Everyone</option>
                      <option>Peers</option>
                      <option>Only me</option>
                    </select>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Quiet hours</div>
                    <div className="flex items-center gap-2">
                      <input type="time" defaultValue="22:00" className="px-2 py-1 rounded border border-gray-200" />
                      <span>to</span>
                      <input type="time" defaultValue="07:00" className="px-2 py-1 rounded border border-gray-200" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="px-5 py-2 rounded-lg bg-[#1F4E79] text-white font-semibold">Save Settings</button>
                </div>
              </motion.div>
            )}

            {tab === 'achievements' && (
              <motion.div key="tab-achievements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-xl shadow p-5 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#1F4E79]">Badges</div>
                  <div className="text-sm text-gray-600">Progress to next level</div>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {(badges && badges.length > 0) ? (
                    badges.map(b => (
                      <div key={b._id} className="p-4 rounded-xl border-2 border-gray-100 text-center hover:shadow">
                        <div className="text-3xl mb-2">�</div>
                        <div className="text-xs text-[#1F4E79] font-medium">{b.badgeName}</div>
                        <div className="text-xxs text-gray-400 mt-1">{new Date(b.earnedAt).toLocaleDateString()}</div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-gray-500">No badges earned yet</div>
                  )}
                </div>
                <div className="mt-6">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-3" style={{ width: `${levelInfo?.progressPercent ?? 0}%`, background: 'linear-gradient(90deg, #37A6FF, #1F4E79)' }} />
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{levelInfo ? `${levelInfo.progressPercent}% to Level ${levelInfo.level + 1}` : 'Level progress unavailable'}</div>
                </div>
              </motion.div>
            )}

            {tab === 'connections' && (
              <motion.div key="tab-connections" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-xl shadow p-5 border border-gray-100">
                <div className="font-bold text-[#1F4E79] mb-3">Your Groups</div>
                <ul className="space-y-3">
                  {[
                    { name: 'Computer Science Hub', href: '/dashboard/community' },
                    { name: 'Coffee & Study', href: '/dashboard/community' },
                  ].map(g => (
                    <li key={g.name} className="p-3 rounded-lg border-2 border-gray-100 flex items-center justify-between">
                      <span className="text-[#1F4E79]">{g.name}</span>
                      <a className="text-sm text-[#1F4E79] underline" href={g.href}>View Group</a>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t pt-4 space-y-4">
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