import type { Role } from './RoleInterface'

export interface UserFetch {
  message: string
  data: UserWithRole[] | Role[] | UserWithRole
}
export interface UserWithRole {
  id: number
  name: string
  email: string
  created_at: Date
  updated_at: Date
  role: Role
}
export interface SearchUserForm {
  search: string
}
export interface UserForm {
  name: string
  email: string
  password: string
  role: Role | null
}
