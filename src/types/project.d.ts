export type TeamMember = {
  id: string
  name: string
  avatar: string
}

export type Subtask = {
  id: string
  title: string
  completed: boolean
}

export type Task = {
  id: string
  title: string
  description?: string
  done: boolean
  assigneeId?: string
  assigneeName?: string
  importance: 'low' | 'medium' | 'high'
  isGeneral: boolean
  createdAt?: string
  dueDate?: string
  tags?: string[]
  status?: 'todo' | 'in-progress' | 'review' | 'done'
  subtasks?: Subtask[]
}

export type ProjectFile = {
  id: string
  name: string
  size: string
  uploadedAt: string
  url: string
}

export type ProjectMessage = {
  id: string
  author: TeamMember
  text: string
  timestamp: string
}

export type Project = {
  id: string
  title: string
  description?: string
  dueDate: string
  members: TeamMember[]
  leaderId: string
  progress: number
  joinCode: string
  tasks: Task[]
  files: ProjectFile[]
  messages: ProjectMessage[]
  createdAt: string
}

export type CreateProjectInput = {
  title: string
  description?: string
  dueDate: string
}

export type UpdateProjectInput = Partial<CreateProjectInput>

export type AddTaskInput = {
  title: string
  description?: string
  importance?: 'low' | 'medium' | 'high'
  isGeneral?: boolean
  assignedTo?: string
  dueDate?: string
  tags?: string[]
}