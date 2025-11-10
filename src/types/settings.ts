export type NotificationSettings = {
  email?: {
    events?: boolean
    messages?: boolean
    reminders?: boolean
    updates?: boolean
  }
  push?: {
    events?: boolean
    messages?: boolean
    reminders?: boolean
    updates?: boolean
  }
}

export type PrivacySettings = {
  profile?: 'public' | 'private' | 'connections'
  email?: 'public' | 'private' | 'connections'
  activity?: 'public' | 'private' | 'connections'
  github?: 'public' | 'private' | 'connections'
  linkedin?: 'public' | 'private' | 'connections'
}

export type UserSettings = {
  notifications?: Partial<NotificationSettings>
  privacy?: Partial<PrivacySettings>
}