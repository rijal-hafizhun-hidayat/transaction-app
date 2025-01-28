import type { Role } from './RoleInterface'

export interface AuthFetch {
  message: string
  data: Auth
}
export interface Auth {
  id: number
  name: string
  email: string
  role: Role
}
export interface LoginForm {
  email: string
  password: string
}
export interface LoginFetch {
  statusCode: number
  message: string
  data: Token
}
export interface Token {
  token: string
}
