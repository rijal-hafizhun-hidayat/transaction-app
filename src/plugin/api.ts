import axios, { AxiosError } from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '@/router'

const api = axios.create({
  baseURL: 'https://transaction-app.bebs.cloud/api',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  NProgress.start()
  if (sessionStorage.getItem('token')) {
    config.headers['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    NProgress.done()
    return response
  },
  (error) => {
    const err = error as AxiosError
    console.log(err)
    NProgress.done()
    if (err.response?.status === 403 || err.response?.status === 401) {
      router.push({
        name: 'login.index',
      })
    }
    return Promise.reject(error)
  },
)

export default api
