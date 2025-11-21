import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Mail,
  Smartphone,
  Lock,
  Eye,
  Award,
  Users,
  Briefcase,
  Check,
  AlertCircle,
  Zap,
  Settings as SettingsIcon,
} from 'lucide-react'
import ApiClient from '../../utils/apiClient'
import useAuth from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'

type NotificationType = 'reminders' | 'achievements' | 'social' | 'career'
type NotificationChannel = 'email' | 'push'
type Theme = 'light' | 'dark' | 'system'

interface NotificationSettings {
  reminders?: boolean
  achievements?: boolean
  social?: boolean
  career?: boolean
}

interface UserSettings {
  notifications?: {
    email?: NotificationSettings
    push?: NotificationSettings
  }
  privacy?: {
    profileVisible?: boolean
    statsVisible?: boolean
  }
  theme?: Theme
}

const SettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth()
  const { setTheme } = useTheme()
  
  const initialSettings: UserSettings = {
    notifications: {
      email: {
        reminders: true,
        achievements: true,
        social: true,
        career: true,
      },
      push: {
        reminders: true,
        achievements: true,
        social: true,
        career: true,
      },
    },
    privacy: {
      profileVisible: true,
      statsVisible: true,
    },
    theme: 'system',
  }

  const [settings, setSettings] = useState<UserSettings>(
    (user as unknown as { settings?: UserSettings })?.settings || initialSettings
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'appearance'>('notifications')

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const toggleNotification = (channel: NotificationChannel, type: NotificationType) => {
    setSettings(prev => {
      const channelSettings = prev.notifications?.[channel] || {}
      return {
        ...prev,
        notifications: {
          ...(prev.notifications || {}),
          [channel]: {
            ...channelSettings,
            [type]: !(channelSettings[type] === true)
          }
        }
      }
    })
  }

  const togglePrivacy = (setting: 'profileVisible' | 'statsVisible') => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...(prev.privacy || {}),
        [setting]: !((prev.privacy || {})[setting] === true)
      }
    }))
  }

  const save = async () => {
    try {
      setSaving(true)
      await ApiClient.put('/users/me/settings', settings as unknown as Record<string, unknown>)
      setMessage({ text: 'Settings saved successfully', type: 'success' })
      if (refreshUser) {
        await refreshUser()
      }
    } catch {
      setMessage({ text: 'Failed to save settings', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const notificationOptions: Array<{ key: NotificationType; label: string; icon: React.FC<{ className?: string }>; description: string }> = [
    { key: 'reminders', label: 'Reminders', icon: Bell, description: 'Task reminders and deadlines' },
    { key: 'achievements', label: 'Achievements', icon: Award, description: 'New badges and milestones' },
    { key: 'social', label: 'Social', icon: Users, description: 'Friend requests and messages' },
    { key: 'career', label: 'Career', icon: Briefcase, description: 'Job opportunities' },
  ]

  const getNotificationValue = (channel: NotificationChannel, type: NotificationType): boolean => {
    return (settings.notifications?.[channel]?.[type] === true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-white/20 backdrop-blur-xl border border-white/30">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-white/80 mt-1 text-sm">Customize your experience and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'privacy', label: 'Privacy & Visibility', icon: Lock },
            { id: 'appearance', label: 'Appearance', icon: Zap },
          ].map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              whileHover={{ y: -2 }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Email Notifications */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Email Notifications</h3>
                    <p className="text-xs text-gray-600 mt-1">Receive notifications via email</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notificationOptions.map(option => (
                    <motion.label
                      key={`email-${option.key}`}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={getNotificationValue('email', option.key)}
                        onChange={() => toggleNotification('email', option.key)}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                        <div className="text-xs text-gray-600">{option.description}</div>
                      </div>
                      <option.icon className="w-4 h-4 text-gray-400" />
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Push Notifications */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <Smartphone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Push Notifications</h3>
                    <p className="text-xs text-gray-600 mt-1">Receive push notifications on your device</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notificationOptions.map(option => (
                    <motion.label
                      key={`push-${option.key}`}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={getNotificationValue('push', option.key)}
                        onChange={() => toggleNotification('push', option.key)}
                        className="w-4 h-4 text-green-600 rounded cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                        <div className="text-xs text-gray-600">{option.description}</div>
                      </div>
                      <option.icon className="w-4 h-4 text-gray-400" />
                    </motion.label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Privacy Settings</h3>
                    <p className="text-xs text-gray-600 mt-1">Control who can see your information</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50 cursor-pointer transition-all"
                  >
                    <div>
                      <div className="font-medium text-gray-900">Public Profile</div>
                      <div className="text-xs text-gray-600 mt-1">Allow others to view your profile</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!settings.privacy?.profileVisible}
                      onChange={() => togglePrivacy('profileVisible')}
                      className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                    />
                  </motion.label>

                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50 cursor-pointer transition-all"
                  >
                    <div>
                      <div className="font-medium text-gray-900">Visible Statistics</div>
                      <div className="text-xs text-gray-600 mt-1">Share your stats and achievements</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!settings.privacy?.statsVisible}
                      onChange={() => togglePrivacy('statsVisible')}
                      className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                    />
                  </motion.label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <motion.div
              key="appearance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                    <Zap className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Theme</h3>
                    <p className="text-xs text-gray-600 mt-1">Choose your preferred visual theme</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'light' as const, label: 'Light', description: 'Bright and clean' },
                    { value: 'dark' as const, label: 'Dark', description: 'Easy on the eyes' },
                    { value: 'system' as const, label: 'System', description: 'Follow device settings' },
                  ].map(theme => (
                    <motion.label
                      key={theme.value}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        settings.theme === theme.value
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-100 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="theme"
                        value={theme.value}
                        checked={settings.theme === theme.value}
                        onChange={(e) => {
                          const newTheme = e.target.value as Theme;
                          setSettings(s => ({ ...s, theme: newTheme }));
                          setTheme(newTheme);
                        }}
                        className="sr-only"
                      />
                      <div className="font-medium text-gray-900 text-sm">{theme.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{theme.description}</div>
                      {settings.theme === theme.value && (
                        <Check className="w-5 h-5 text-indigo-600 mt-2" />
                      )}
                    </motion.label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save Button and Messages */}
        <div className="mt-8 flex items-center gap-4 sticky bottom-4">
          <motion.button
            onClick={save}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold shadow-lg disabled:opacity-50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </motion.button>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {message.type === 'success' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
