import React, { useState } from 'react'
import ApiClient from '../../utils/apiClient'
import useAuth from '../../hooks/useAuth'
import { UserSettings } from '../../types/settings'

const SettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth()
  const initial: UserSettings = (user as unknown as { settings?: UserSettings })?.settings || {
    notifications: { email: { reminders: true }, push: { reminders: true } },
    privacy: { profile: 'connections', email: 'private', activity: 'connections' }
  }

  const [settings, setSettings] = useState<UserSettings>(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const toggleNotification = (channel: 'email' | 'push') => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...(prev.notifications || {}),
        [channel]: {
          ...((prev.notifications || {})[channel] || {}),
          reminders: !(((prev.notifications || {})[channel] || {}).reminders === true)
        }
      }
    }))
  }

  const save = async () => {
    try {
      setSaving(true)
      await ApiClient.put('/users/me/settings', settings as unknown as Record<string, unknown>)
      setMessage('Settings saved')
      // Refresh user data in-place so UI updates without full reload
      if (refreshUser) {
        await refreshUser()
      } else {
        setTimeout(() => window.location.reload(), 800)
      }
    } catch {
      setMessage('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
        <h1 className="text-2xl font-bold text-[#1F4E79] mb-4">Settings</h1>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Notifications</h2>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium">Email reminders</div>
                <div className="text-sm text-gray-500">Receive reminder emails</div>
              </div>
              <input
                type="checkbox"
                checked={!!settings.notifications?.email?.reminders}
                onChange={() => toggleNotification('email')}
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium">Push reminders</div>
                <div className="text-sm text-gray-500">Receive push notifications</div>
              </div>
              <input
                type="checkbox"
                checked={!!settings.notifications?.push?.reminders}
                onChange={() => toggleNotification('push')}
              />
            </label>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Privacy</h2>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium">Profile visibility</div>
                <div className="text-sm text-gray-500">Who can see your profile</div>
              </div>
              <select
                value={settings.privacy?.profile || 'connections'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSettings(s => ({ ...s, privacy: { ...(s.privacy || {}), profile: e.target.value as 'public' | 'connections' | 'private' } }))}
                className="border rounded px-2 py-1"
              >
                <option value="public">Public</option>
                <option value="connections">Connections</option>
                <option value="private">Private</option>
              </select>
            </label>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-[#1F4E79] text-white rounded-md"
          >
            {saving ? 'Saving...' : 'Save settings'}
          </button>
          {message && <div className="text-sm text-gray-600">{message}</div>}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
