export interface FetchRole {
  message: string
  data: Role[] | Role
}

export interface RoleForm {
  name: string
}

export interface Role {
  id: number
  name: string
  created_at: Date
  updated_at: Date
}
