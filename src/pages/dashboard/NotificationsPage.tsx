import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Timer,
  Award,
  AlertTriangle,
  Info,
  MessageCircle,
  Briefcase,
  Check,
  X
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useNotifications } from '../../hooks/useNotifications'

export type NotificationType = 'reminder' | 'achievement' | 'alert' | 'update' | 'social' | 'opportunity' | 'career'
export type Severity = 'high' | 'medium' | 'low'

export type Notification = {
  _id: string
  type: NotificationType
  priority: Severity
  title: string
  message: string
  createdAt: string
  isRead: boolean
  link?: string
}

const typeMeta: Record<NotificationType, { label: string; icon: React.ComponentType<Record<string, unknown>> }> = {
  reminder: { label: 'Reminders', icon: Timer },
  achievement: { label: 'Achievements', icon: Award },
  alert: { label: 'Alerts', icon: AlertTriangle },
  update: { label: 'Updates', icon: Info },
  social: { label: 'Social', icon: MessageCircle },
  opportunity: { label: 'Opportunities', icon: Briefcase },
  career: { label: 'Career', icon: Briefcase },
}

export default function NotificationsPage() {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications()
  const [filterType, setFilterType] = useState<'all' | NotificationType>('all')
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [severity, setSeverity] = useState<'all' | Severity>('all')

  const filtered = useMemo(() =>
    notifications.filter(n => (filterType === 'all' || n.type === filterType)
      && (severity === 'all' || n.priority === severity)
      && (!onlyUnread || !n.isRead)
    ), [notifications, filterType, severity, onlyUnread])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-gray-600">Loading notifications...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#37A6FF] to-[#1F4E79] text-white grid place-items-center shadow"><Bell className="w-6 h-6" /></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-600">{unreadCount} unread</p>
            </div>
          </div>
          <button onClick={markAllAsRead} className="px-4 py-2 rounded-xl border-2 border-gray-200 text-sm hover:bg-gray-50">Mark all as read</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters + List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button onClick={() => setFilterType('all')} className={`px-3 py-1.5 rounded-full border text-sm ${filterType==='all'?'bg-[#EAF7FF] border-[#37A6FF] text-[#1F4E79]':'border-gray-200'}`}>All</button>
            {Object.entries(typeMeta).map(([key, meta]) => (
              <button key={key} onClick={() => setFilterType(key as NotificationType)} className={`px-3 py-1.5 rounded-full border text-sm flex items-center gap-1 ${filterType===key?'bg-[#EAF7FF] border-[#37A6FF] text-[#1F4E79]':'border-gray-200'}`}>
                <meta.icon className="w-4 h-4" /> {meta.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <label className="inline-flex items-center gap-1 text-sm"><input type="checkbox" checked={onlyUnread} onChange={e=>setOnlyUnread(e.target.checked)} /> Unread only</label>
              <select value={severity} onChange={(e: ChangeEvent<HTMLSelectElement>)=>setSeverity(e.target.value as 'all' | Severity)} className="px-3 py-1.5 rounded-full border text-sm border-gray-200">
                <option value="all">All severities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* List */}
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((n) => {
                const MetaIcon = typeMeta[n.type]?.icon || Bell
                const accent = n.priority==='high' ? 'border-l-4 border-red-500' : n.priority==='medium' ? 'border-l-4 border-[#FFB600]' : 'border-l-4 border-[#37A6FF]'
                return (
                  <motion.div key={n._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className={`bg-white rounded-xl shadow p-4 border border-gray-100 ${accent}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 grid place-items-center text-[#1F4E79]"><MetaIcon className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-semibold ${n.isRead?'text-gray-600':'text-[#1F4E79]'}`}>{n.title}</div>
                            {n.message && <div className="text-sm text-gray-600">{n.message}</div>}
                          </div>
                          <div className="text-xs text-gray-500 whitespace-nowrap">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</div>
                        </div>
                        {n.link && (
                          <a href={n.link} className="mt-2 inline-flex items-center gap-1 text-sm text-[#1F4E79] underline">View</a>
                        )}
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          {!n.isRead && <button onClick={()=>markAsRead(n._id)} className="px-2 py-1 rounded border border-gray-200 inline-flex items-center gap-1 hover:bg-gray-50"><Check className="w-3 h-3"/> Mark read</button>}
                          <button onClick={()=>deleteNotification(n._id)} className="px-2 py-1 rounded border border-gray-200 inline-flex items-center gap-1 hover:bg-gray-50"><X className="w-3 h-3"/> Dismiss</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            {filtered.length===0 && (
              <div className="p-12 text-center bg-white rounded-xl border border-gray-100 text-gray-600">No notifications match your filters.</div>
            )}
          </div>
        </div>

        {/* Preferences side */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
            <div className="font-bold text-[#1F4E79] mb-2">Preferences</div>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Reminders</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Social</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Achievements</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Opportunities</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Updates</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Alerts</label>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
            <div className="font-bold text-[#1F4E79] mb-2">Quiet hours</div>
            <div className="flex items-center gap-2 text-sm">
              <input type="time" defaultValue="22:00" className="px-2 py-1 rounded border border-gray-200"/>
              <span>to</span>
              <input type="time" defaultValue="07:00" className="px-2 py-1 rounded border border-gray-200"/>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 border border-gray-100 text-sm text-gray-600">
            Notifications are now fully dynamic and saved to your account.
          </div>
        </div>
      </div>
    </div>
  )
}