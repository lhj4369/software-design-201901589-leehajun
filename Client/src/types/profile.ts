export type HomeroomAssignment = {
  grade: number
  classRoom: number
  isViceHomeroom?: boolean
}

export type TeacherProfile = {
  role: 'teacher'
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  birthDate?: string
  homeroomAssignments?: HomeroomAssignment[]
}

export type StudentProfile = {
  role: 'student'
  id: string
  name: string
  email: string
  phone?: string
  grade?: number
  classRoom?: number
  number?: string
  birthDate?: string
  gender?: 'male' | 'female' | null
  address?: string
}

export type ParentProfile = {
  role: 'parent'
  id: string
  name: string
  email: string
  phone?: string
  birthDate?: string
  childStudentIds?: string[]
}

export type AuthUserProfile = TeacherProfile | StudentProfile | ParentProfile
