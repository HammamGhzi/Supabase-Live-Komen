export interface Comment {
  id: string
  author: string
  avatar: string
  text: string
  timestamp: Date
  isAI?: boolean
}

export interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  link?: string
}

export interface Skill {
  name: string
  level: number
  category: string
}
