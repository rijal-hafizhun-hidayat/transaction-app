import api from '@/plugin/api'
import type { AxiosError, AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

interface Fetch {
  message: string
  data: Auth
}
interface Auth {
  id: number
  name: string
  email: string
  role: Role
}
interface Role {
  id: number
  name: string
  created_at: Date
  updated_at: Date
}
interface FormLogin {
  email: string
  password: string
}
interface Login {
  statusCode: number
  message: string
  data: Token
}
interface Token {
  token: string
}

export const useAuthStore = defineStore('auth', () => {
  const auth: Ref<Auth | null> = ref(null)
  const token: Ref<string | null> = ref(null)

  async function login(formLogin: FormLogin) {
    const result: AxiosResponse<Login> = await api.post<Login>('login', {
      email: formLogin.email,
      password: formLogin.password,
    })

    const data = result.data.data as Token
    token.value = data.token
    sessionStorage.setItem('token', token.value)
  }

  async function currentUser(): Promise<void> {
    try {
      const result: AxiosResponse<Fetch> = await api.get('current-user')
      auth.value = result.data.data as Auth
    } catch (error) {
      const err = error as AxiosError
      console.log(err)
    }
  }

  async function logout() {
    try {
      await api.post('logout')
      auth.value = null
      token.value = null
      sessionStorage.removeItem('token')
    } catch (error) {
      const err = error as AxiosError
      console.log(err)
    }
  }

  function unauthorized() {
    auth.value = null
    token.value = null
    sessionStorage.removeItem('token')
  }

  async function hasRoleAdmin(roles: string[]) {
    if (auth.value === null) {
      await currentUser()
    }

    return roles.includes(auth.value?.role.name as string)
  }

  return {
    auth,
    token,
    login,
    currentUser,
    logout,
    hasRoleAdmin,
    unauthorized,
  }
})
