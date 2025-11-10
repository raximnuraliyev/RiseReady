export type TeamMember = {
  id: string
  name: string
  avatar: string
}

export type Task = {
  id: string
  title: string
  done: boolean
  assigneeId?: string
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
  assigneeId?: string
}