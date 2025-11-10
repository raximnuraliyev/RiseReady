# RiseReady - Dynamic Implementation Guide

This guide documents how to make all pages fully dynamic with backend integration.

## ✅ Already Created

### Models
- ✅ User.js (updated with all profile fields)
- ✅ Notification.js
- ✅ CalendarEvent.js
- ✅ Skill.js (NEW)
- ✅ Budget.js (NEW)
- ✅ CheckIn.js (NEW)
- ✅ FocusSession.js (NEW)
- ✅ Badge.js (NEW)
- ✅ Project.js (NEW)
- ✅ Community.js (NEW - Group & Post)
- ✅ Internship.js (NEW - with Netflix/Discord/Telegram)
- ✅ Career.js (NEW - Mentor, Resource, CareerTask)
- ✅ InternshipApplication.js
- ✅ CareerPath.js

### Controllers
- ✅ authController.js (updated)
- ✅ userController.js (updated)
- ✅ skillsController.js (NEW)

## 🔧 Implementation Pattern

For each feature, follow this pattern:

### 1. Controller (server/src/controllers/)
```javascript
import { Model } from '../models/Model.js'

export async function getItems(req, res) {
  const items = await Model.find({ userId: req.user.id })
  res.json(items)
}

export async function createItem(req, res) {
  const item = await Model.create({ ...req.body, userId: req.user.id })
  res.status(201).json(item)
}

export async function updateItem(req, res) {
  const item = await Model.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  )
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(item)
}

export async function deleteItem(req, res) {
  await Model.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
  res.json({ success: true })
}
```

### 2. Routes (server/src/routes/)
```javascript
import { Router } from 'express'
import { authRequired } from '../middleware/auth.js'
import { getItems, createItem, updateItem, deleteItem } from '../controllers/controller.js'

const router = Router()

router.get('/', authRequired, getItems)
router.post('/', authRequired, createItem)
router.put('/:id', authRequired, updateItem)
router.delete('/:id', authRequired, deleteItem)

export default router
```

### 3. Register in app.js
```javascript
import itemRoutes from './routes/items.js'
app.use('/api/items', itemRoutes)
```

### 4. Frontend Hook (src/hooks/)
```typescript
import { useState, useEffect } from 'react'

export function useItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchItems = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/items', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  const createItem = async (itemData) => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(itemData)
    })
    const newItem = await res.json()
    setItems([...items, newItem])
    return newItem
  }

  const updateItem = async (id, updates) => {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })
    const updated = await res.json()
    setItems(items.map(item => item._id === id ? updated : item))
    return updated
  }

  const deleteItem = async (id) => {
    const token = localStorage.getItem('token')
    await fetch(`/api/items/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setItems(items.filter(item => item._id !== id))
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return { items, loading, createItem, updateItem, deleteItem, refetch: fetchItems }
}
```

## 📋 TODO: Create These Controllers

### 1. budgetController.js
```javascript
import { BudgetItem } from '../models/Budget.js'

export async function getBudgetItems(req, res)
export async function createBudgetItem(req, res)
export async function updateBudgetItem(req, res)
export async function deleteBudgetItem(req, res)
export async function getBudgetSummary(req, res) // Calculate income/expense totals
```

### 2. checkInsController.js
```javascript
import { CheckIn } from '../models/CheckIn.js'

export async function getCheckIns(req, res)
export async function createCheckIn(req, res)
export async function getStreak(req, res) // Calculate current streak
export async function getBestDay(req, res) // Find best mood day this week
export async function getStats(req, res) // Weekly/monthly stats
```

### 3. focusController.js
```javascript
import { FocusSession } from '../models/FocusSession.js'

export async function getFocusSessions(req, res)
export async function createSession(req, res)
export async function getStreak(req, res)
export async function getTotalTime(req, res) // This week/month
```

### 4. badgesController.js
```javascript
import { UserBadge, BadgeDefinition } from '../models/Badge.js'

export async function getUserBadges(req, res)
export async function getAllBadgeDefinitions(req, res)
export async function awardBadge(req, res) // Admin/system only
export async function checkAndAwardBadges(userId) // Background function
```

### 5. projectsController.js
```javascript
import { Project } from '../models/Project.js'

export async function getProjects(req, res)
export async function createProject(req, res)
export async function updateProject(req, res)
export async function deleteProject(req, res)
export async function toggleMilestone(req, res)
```

### 6. communityController.js
```javascript
import { Group, Post } from '../models/Community.js'

export async function getGroups(req, res)
export async function createGroup(req, res)
export async function joinGroup(req, res)
export async function leaveGroup(req, res)
export async function getGroupPosts(req, res)
export async function createPost(req, res)
export async function likePost(req, res)
export async function commentOnPost(req, res)
```

### 7. internshipsController.js
```javascript
import { Internship } from '../models/Internship.js'
import { InternshipApplication } from '../models/InternshipApplication.js'

export async function getInternships(req, res) // All active internships
export async function createInternship(req, res) // Admin only
export async function apply(req, res) // Create application
export async function getMyApplications(req, res)
export async function updateApplicationStatus(req, res)
```

### 8. careerController.js
```javascript
import { Mentor, Resource, CareerTask } from '../models/Career.js'

export async function getMentors(req, res)
export async function getResources(req, res)
export async function getMyTasks(req, res)
export async function createTask(req, res)
export async function toggleTask(req, res)
```

### 9. notificationsController.js
```javascript
import { Notification } from '../models/Notification.js'

export async function getNotifications(req, res)
export async function markAsRead(req, res)
export async function markAllAsRead(req, res)
export async function deleteNotification(req, res)
```

## 🎯 User Level System

The user level should be calculated based on overall activity. Add this to User model:

```javascript
// In User.js
UserSchema.virtual('level').get(function() {
  // Calculate level based on various activities
  const points = this.totalPoints || 0
  return Math.floor(points / 100) + 1 // 1 level per 100 points
})

UserSchema.methods.addPoints = async function(points) {
  this.totalPoints = (this.totalPoints || 0) + points
  await this.save()
  // Check for level-up badges
  await checkAndAwardBadges(this._id)
}
```

Add to schema:
```javascript
totalPoints: { type: Number, default: 0 },
```

Award points for:
- Completing a focus session: +10
- Checking in: +5
- Completing a project milestone: +20
- Completing a career task: +15
- Earning a badge: +25
- Posting in community: +5

## 🔄 Next Steps

1. **Create all controllers** following the pattern above
2. **Create all routes** for each controller
3. **Register routes** in app.js
4. **Create frontend hooks** for each feature
5. **Update pages** to use the hooks instead of static data
6. **Add user level** calculation and display
7. **Implement badge checking** after each activity
8. **Add Discord bot integration** endpoints for mentors/resources

## 📱 Page-by-Page Updates Needed

### NotificationsPage.tsx
- Replace static notifications with `useNotifications()` hook
- Add mark as read functionality
- Real-time updates (optional: WebSocket)

### SkillsPage.tsx
- Replace static skills with `useSkills()` hook
- Add create/edit/delete modals
- Practice button increases level
- Display user level badge dynamically

### BudgetPage.tsx
- Replace all static data with `useBudget()` hook
- Add income/expense forms
- Calculate totals dynamically
- Monthly recurring items

### WellbeingPage.tsx
- Use `useCheckIns()` hook
- Calculate streak automatically
- Find best day from data
- Fetch mental health articles from API or external source

### FocusPage.tsx
- Use `useFocusSessions()` hook
- Track timer and save to DB
- Calculate current streak
- Sync level with user level system
- Display badges from `useBadges()` hook

### CareerPage.tsx
- Use `useMentors()`, `useResources()`, `useTasks()` hooks
- Discord bot integration ready (discordId field in Mentor model)
- Dynamic task creation and completion

### CommunityPage.tsx
- Use `useGroups()` and `usePosts()` hooks
- Join/leave groups
- Create posts and comments
- Like functionality

### ProjectsPage.tsx
- Use `useProjects()` hook
- Create/edit projects with milestones
- Toggle milestone completion
- Team members management

### InternshipsPage.tsx
- Use `useInternships()` and `useApplications()` hooks
- Filter by Netflix/Discord/Telegram
- Apply to internships
- Track application status

## 🚀 Quick Start Implementation Order

**Priority 1 (Most Visible):**
1. Skills page (simple CRUD)
2. User level system
3. Focus sessions

**Priority 2 (Core Features):**
4. Budget manager
5. Projects
6. Notifications

**Priority 3 (Social Features):**
7. Community
8. Internships
9. Career resources

**Priority 4 (Health & Analytics):**
10. Well-being check-ins
11. Calendar (already has backend)
12. Badges system

This modular approach allows you to implement features incrementally while keeping the app functional.
