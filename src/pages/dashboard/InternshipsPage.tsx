import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Briefcase,
  Building2,
  CalendarDays,
  Sparkles,
  Send,
  CheckCircle2,
  Info,
  TrendingUp,
  FileText,
  X,
  Settings,
  Link2,
  Github,
  AlertTriangle
} from 'lucide-react'

export type Opportunity = {
  id: string
  title: string
  organization: string
  type: 'Internship' | 'Micro-Project'
  deadline: string // ISO
  postedAt: string // ISO
}

export default function InternshipsPage() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'All' | 'Internship' | 'Micro-Project'>('All')
  const [deadlineBefore, setDeadlineBefore] = useState<string>('')
  const [showFiltersMobile, setShowFiltersMobile] = useState(false)
  const [appliedIds, setAppliedIds] = useState<string[]>([])
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [panelOpenMobile, setPanelOpenMobile] = useState(false)

  // Applicant profile (collected before applying)
  const [linkedin, setLinkedin] = useState('')
  const [github, setGithub] = useState('')
  const [showProfileModal, setShowProfileModal] = useState<null | string>(null) // holds pending opp id

  // Applications settings
  const [appsSettingsOpen, setAppsSettingsOpen] = useState(false)
  const [appsShowOrg, setAppsShowOrg] = useState(true)
  const [appsShowDeadline, setAppsShowDeadline] = useState(true)
  const [appsSortBy, setAppsSortBy] = useState<'recent' | 'deadline' | 'title'>('recent')

  // External feed (Netflix / Discord / Telegram jobs proxy)
  const [useExternalFeed, setUseExternalFeed] = useState(true)
  const [externalJobs, setExternalJobs] = useState<Opportunity[]>([])
  const [externalError, setExternalError] = useState<string | null>(null)
  const [externalLoading, setExternalLoading] = useState(false)

  useEffect(() => {
    // Restore profile and preferences
    try {
      const li = localStorage.getItem('profile.linkedin'); if (li) setLinkedin(li)
      const gh = localStorage.getItem('profile.github'); if (gh) setGithub(gh)
      const s = localStorage.getItem('apps.prefs');
      if (s) {
        const p = JSON.parse(s)
        if (typeof p.appsShowOrg === 'boolean') setAppsShowOrg(p.appsShowOrg)
        if (typeof p.appsShowDeadline === 'boolean') setAppsShowDeadline(p.appsShowDeadline)
        if (p.appsSortBy) setAppsSortBy(p.appsSortBy)
      }
    } catch (err: unknown) { console.warn('Failed to restore profile/preferences from localStorage', err) }
  }, [])

  useEffect(() => {
    try { localStorage.setItem('apps.prefs', JSON.stringify({ appsShowOrg, appsShowDeadline, appsSortBy })) } catch (err: unknown) { console.warn('Failed to persist apps prefs', err) }
  }, [appsShowOrg, appsShowDeadline, appsSortBy])

  const isNew = (iso: string) => {
    const days = (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)
    return days <= 7
  }

  // Merge external feed when enabled
  const opportunities = useMemo(() => {
    const baseOpportunities: Opportunity[] = [] // fallback local list
    const list = useExternalFeed ? [...externalJobs, ...baseOpportunities] : baseOpportunities
    // de-dupe by id
    const map = new Map(list.map(o => [o.id, o]))
    return Array.from(map.values())
  }, [useExternalFeed, externalJobs])

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      const matchQ = `${o.title} ${o.organization}`.toLowerCase().includes(query.toLowerCase())
      const matchT = type === 'All' ? true : o.type === type
      const matchD = deadlineBefore ? new Date(o.deadline) <= new Date(deadlineBefore) : true
      return matchQ && matchT && matchD
    })
  }, [opportunities, query, type, deadlineBefore])

  // If profile missing, prompt before applying
  const apply = (id: string) => {
    const hasProfile = Boolean((linkedin && linkedin.trim()) || (github && github.trim()))
    if (!hasProfile) {
      setShowProfileModal(id)
      return
    }
    if (!appliedIds.includes(id)) setAppliedIds((prev) => [...prev, id])
    setConfirmId(id)
  }

  const saveProfileAndApply = () => {
    if (!showProfileModal) return
    try { if (linkedin) localStorage.setItem('profile.linkedin', linkedin) } catch (err: unknown) { console.warn('Failed to save linkedin', err) }
    try { if (github) localStorage.setItem('profile.github', github) } catch (err: unknown) { console.warn('Failed to save github', err) }
    setShowProfileModal(null)
    apply(confirmId ?? showProfileModal)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F6FF] via-[#FFF8F0] to-[#F5F7FA] pb-10">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-blue-100 backdrop-blur border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-3">
          <div className="flex items-center gap-3 text-gray-900">
            <Briefcase className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Internships & Micro-Projects</h1>
          </div>
          <button className="ml-auto lg:hidden p-2 rounded-lg border-2 border-gray-200" onClick={() => setShowFiltersMobile(true)} aria-label="Open filters">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* External feed control */}
        <div className="mb-4 flex items-center gap-2 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={useExternalFeed} onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
              const enabled = e.target.checked
              setUseExternalFeed(enabled)
              if (enabled && externalJobs.length === 0) {
                setExternalLoading(true); setExternalError(null)
                try {
                  // Fetch aggregated opportunities from backend
                  const res = await fetch('/api/opportunities')
                  if (!res.ok) throw new Error('Failed to fetch opportunities')
                  const data = await res.json()
                  setExternalJobs(Array.isArray(data) ? (data as Opportunity[]) : [])
                } catch (err: unknown) {
                  const msg = err instanceof Error ? err.message : String(err || 'Failed to load opportunities')
                  setExternalError(msg)
                } finally { setExternalLoading(false) }
              }
            }} />
            <span className="text-gray-900 font-medium">Include external feeds (Netflix, Discord, Telegram)</span>
          </label>
          {externalLoading && <span className="text-gray-500">Loading…</span>}
          {externalError && (
            <span className="flex items-center gap-1 text-amber-700"><AlertTriangle className="w-4 h-4" /> {externalError}</span>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Cards area */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            {/* Filter bar (desktop/tablet) */}
            <div className="hidden lg:grid grid-cols-3 gap-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Keywords (role, organization)"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none"
                />
              </div>
              <select
                value={type}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setType(e.target.value as 'All' | 'Internship' | 'Micro-Project')}
                className="px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none"
              >
                <option value="All">All Types</option>
                <option value="Internship">Internship</option>
                <option value="Micro-Project">Micro-Project</option>
              </select>
              <div className="relative flex items-center">
                <CalendarDays className="absolute left-3 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={deadlineBefore}
                  onChange={(e) => setDeadlineBefore(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none"
                  placeholder="Deadline before"
                />
              </div>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 && (
                  <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 text-center text-gray-600 shadow-md">No external opportunities available yet.</div>
                )}
                {filtered.map((o, idx) => (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ delay: idx * 0.03 }}
                    className="bg-white rounded-2xl border-2 border-gray-100 p-4 shadow-md hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{o.title}</h3>
                        <div className="mt-1 text-sm text-gray-600 flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          <span>{o.organization}</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                          <CalendarDays className="w-4 h-4" />
                          <span>Deadline {new Date(o.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {isNew(o.postedAt) && (
                          <motion.span
                            initial={{ scale: 0.9, opacity: 0.8 }}
                            animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="px-2 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-600 border border-emerald-600"
                          >
                            New
                          </motion.span>
                        )}
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-[#3730A3] border">{o.type}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Career boost potential</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => apply(o.id)}
                        disabled={appliedIds.includes(o.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow ${
                          appliedIds.includes(o.id)
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {appliedIds.includes(o.id) ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                        {appliedIds.includes(o.id) ? 'Applied' : 'Apply'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Side panel / bottom section */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {/* Mobile filter trigger overlay */}
            <AnimatePresence>
              {showFiltersMobile && (
                <>
                  <motion.div
                    className="fixed inset-0 bg-black/50 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowFiltersMobile(false)}
                  />
                  <motion.div
                    className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-4 shadow-2xl"
                    initial={{ y: 300 }}
                    animate={{ y: 0 }}
                    exit={{ y: 300 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</h3>
                      <button onClick={() => setShowFiltersMobile(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Keywords" className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none" />
                      </div>
                      <select value={type} onChange={(e: ChangeEvent<HTMLSelectElement>) => setType(e.target.value as 'All' | 'Internship' | 'Micro-Project')} className="px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none">
                        <option value="All">All Types</option>
                        <option value="Internship">Internship</option>
                        <option value="Micro-Project">Micro-Project</option>
                      </select>
                      <div className="relative">
                        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="date" value={deadlineBefore} onChange={(e) => setDeadlineBefore(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none" />
                      </div>
                      <button onClick={() => setShowFiltersMobile(false)} className="mt-1 py-2 rounded-xl bg-blue-600 text-white font-semibold">Apply Filters</button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Applications + Tips */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-600" /> Your Applications</h3>
                  <div className="flex items-center gap-2">
                    <button className="hidden lg:inline-flex p-2 rounded-lg border-2 border-gray-200" title="Customize" onClick={() => setAppsSettingsOpen(true)}>
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="lg:hidden text-sm text-gray-900 underline" onClick={() => setPanelOpenMobile(!panelOpenMobile)}>{panelOpenMobile ? 'Hide' : 'Show'}</button>
                  </div>
                </div>
                <AnimatePresence initial={false}>
                  {(panelOpenMobile || typeof window === 'undefined' || window.innerWidth >= 1024) && (
                    <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 space-y-2">
                      {appliedIds.length === 0 ? (
                        <li className="text-sm text-gray-600">No applications yet.</li>
                      ) : (
                        appliedIds
                          .slice()
                          .sort((a, b) => {
                            const A = opportunities.find((o) => o.id === a)!
                            const B = opportunities.find((o) => o.id === b)!
                            if (appsSortBy === 'recent') return new Date(B.postedAt).getTime() - new Date(A.postedAt).getTime()
                            if (appsSortBy === 'deadline') return new Date(A.deadline).getTime() - new Date(B.deadline).getTime()
                            return A.title.localeCompare(B.title)
                          })
                          .map((id) => {
                            const opp = opportunities.find((o) => o.id === id)!
                            return (
                              <li key={id} className="text-sm text-gray-700 flex items-center justify-between">
                                <span className="truncate mr-2">{opp.title}</span>
                                <span className="text-xs text-gray-500">
                                  {appsShowOrg && <>{opp.organization}</>}
                                  {appsShowDeadline && (
                                    <>
                                      {appsShowOrg && ' • '}
                                      {new Date(opp.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </>
                                  )}
                                </span>
                              </li>
                            )
                          })
                      )}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-white rounded-2xl border-2 border-gray-100 p-4 shadow-md">
                <h3 className="font-bold text-gray-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-500" /> Tips</h3>
                <ul className="mt-2 space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-700" /> Tailor your résumé to the job keywords.</li>
                  <li className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-700" /> Add measurable outcomes from projects.</li>
                  <li className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-gray-700" /> Link to a portfolio or GitHub with highlights.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile collection before applying */}
      <AnimatePresence>
        {showProfileModal && (
          <>
            <motion.div className="fixed inset-0 bg-black/50 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProfileModal(null)} />
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Add a profile link</h3>
                <p className="text-sm text-gray-600 mb-4">Share your LinkedIn or GitHub so employers can learn more about you.</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-gray-700" />
                    <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="LinkedIn URL (optional)" className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-600 outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-gray-700" />
                    <input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="GitHub URL (optional)" className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-600 outline-none" />
                  </div>
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <button onClick={() => setShowProfileModal(null)} className="px-4 py-2 rounded-lg border-2 border-gray-200">Cancel</button>
                  <button onClick={saveProfileAndApply} className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold">Continue & Apply</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmId && (
          <>
            <motion.div className="fixed inset-0 bg-black/50 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmId(null)} />
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div className="w-full max-w-md bg-white rounded-2xl p-6 text-center shadow-2xl">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                <h3 className="mt-3 text-xl font-bold text-gray-900">Application sent!</h3>
                <p className="mt-1 text-sm text-gray-600">Well let you know when the organization views your application.</p>
                <button onClick={() => setConfirmId(null)} className="mt-5 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold">Done</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Applications settings */}
      <AnimatePresence>
        {appsSettingsOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/50 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAppsSettingsOpen(false)} />
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
              <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Customize Your Applications</h3>
                <div className="space-y-3 text-sm">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={appsShowOrg} onChange={(e) => setAppsShowOrg(e.target.checked)} /> Show organization</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={appsShowDeadline} onChange={(e) => setAppsShowDeadline(e.target.checked)} /> Show deadline</label>
                  <div>
                    <div className="font-medium mb-1">Sort by</div>
                    <select value={appsSortBy} onChange={(e: ChangeEvent<HTMLSelectElement>) => setAppsSortBy(e.target.value as 'recent' | 'deadline' | 'title')} className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-600 outline-none">
                      <option value="recent">Recently posted</option>
                      <option value="deadline">Nearest deadline</option>
                      <option value="title">Title (A-Z)</option>
                    </select>
                  </div>
                </div>
                <div className="mt-5 flex justify-end">
                  <button onClick={() => setAppsSettingsOpen(false)} className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold">Done</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}