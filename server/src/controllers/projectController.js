import { Project } from '../models/Project.js'

// Get all projects for a user (both member and leader)
export async function getUserProjects(req, res) {
  try {
    const projects = await Project.find({
      $or: [
        { members: req.user.id },
        { leaderId: req.user.id }
      ]
    }).populate('members', 'name avatar')
      .populate('leaderId', 'name avatar')
      .sort('-createdAt')
    
    res.json(projects)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
}

// Create a new project
export async function createProject(req, res) {
  try {
    const { title, description, dueDate } = req.body
    
    const joinCode = await Project.generateJoinCode()
    const project = new Project({
      title,
      description,
      dueDate,
      leaderId: req.user.id,
      members: [req.user.id], // Leader is also a member
      joinCode
    })
    
    await project.save()
    
    const populated = await project.populate([
      { path: 'members', select: 'name avatar' },
      { path: 'leaderId', select: 'name avatar' }
    ])
    
    res.status(201).json(populated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' })
  }
}

// Update project details (title, description, dueDate)
export async function updateProject(req, res) {
  try {
    const { projectId } = req.params
    const { title, description, dueDate } = req.body
    
    const project = await Project.findById(projectId)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    
    // Only leader can update project details
    if (project.leaderId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only project leader can update details' })
    }
    
    project.title = title || project.title
    project.description = description ?? project.description
    project.dueDate = dueDate || project.dueDate
    
    await project.save()
    const populated = await project.populate([
      { path: 'members', select: 'name avatar' },
      { path: 'leaderId', select: 'name avatar' }
    ])
    
    res.json(populated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' })
  }
}

// Join project with code
export async function joinProject(req, res) {
  try {
    const { joinCode } = req.body
    
    const project = await Project.findOne({ joinCode })
    if (!project) return res.status(404).json({ error: 'Invalid join code' })
    
    // Check if already a member
    if (project.members.includes(req.user.id)) {
      return res.status(400).json({ error: 'Already a member' })
    }
    
    project.members.push(req.user.id)
    await project.save()
    
    const populated = await project.populate([
      { path: 'members', select: 'name avatar' },
      { path: 'leaderId', select: 'name avatar' }
    ])
    
    res.json(populated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to join project' })
  }
}

// Leave project
export async function leaveProject(req, res) {
  try {
    const { projectId } = req.params
    
    const project = await Project.findById(projectId)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    
    // Leader can't leave, must transfer leadership first
    if (project.leaderId.toString() === req.user.id) {
      return res.status(400).json({ error: 'Leader cannot leave project' })
    }
    
    project.members = project.members.filter(id => id.toString() !== req.user.id)
    await project.save()
    
    res.json({ message: 'Left project successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to leave project' })
  }
}

// Add task
export async function addTask(req, res) {
  try {
    const { projectId } = req.params
    const { title, assigneeId } = req.body
    
    const project = await Project.findById(projectId)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    
    // Only members can add tasks
    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ error: 'Not a project member' })
    }
    
    project.tasks.push({ title, assigneeId })
    project.updateProgress()
    await project.save()
    
    const populated = await project.populate([
      { path: 'members', select: 'name avatar' },
      { path: 'leaderId', select: 'name avatar' }
    ])
    
    res.json(populated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task' })
  }
}

// Toggle task status
export async function toggleTask(req, res) {
  try {
    const { projectId, taskId } = req.params
    
    const project = await Project.findById(projectId)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    
    // Only members can toggle tasks
    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ error: 'Not a project member' })
    }
    
    const task = project.tasks.id(taskId)
    if (!task) return res.status(404).json({ error: 'Task not found' })
    
    task.done = !task.done
    project.updateProgress()
    await project.save()
    
    const populated = await project.populate([
      { path: 'members', select: 'name avatar' },
      { path: 'leaderId', select: 'name avatar' }
    ])
    
    res.json(populated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle task' })
  }
}

// Add message
export async function addMessage(req, res) {
  try {
    const { projectId } = req.params
    const { text } = req.body
    
    const project = await Project.findById(projectId)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    
    // Only members can add messages
    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ error: 'Not a project member' })
    }
    
    project.messages.push({ author: req.user.id, text })
    await project.save()
    
    const populated = await project.populate([
      { path: 'members', select: 'name avatar' },
      { path: 'leaderId', select: 'name avatar' },
      { path: 'messages.author', select: 'name avatar' }
    ])
    
    res.json(populated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add message' })
  }
}

// Upload file
export async function uploadFile(req, res) {
  try {
    const { projectId } = req.params
    const { name, size, url } = req.body // URL would come from your file upload service
    
    const project = await Project.findById(projectId)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    
    // Only members can upload files
    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ error: 'Not a project member' })
    }
    
    project.files.push({ name, size, url })
    await project.save()
    
    const populated = await project.populate([
      { path: 'members', select: 'name avatar' },
      { path: 'leaderId', select: 'name avatar' }
    ])
    
    res.json(populated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' })
  }
}