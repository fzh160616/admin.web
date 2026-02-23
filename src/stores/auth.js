import { defineStore } from 'pinia'
import { login as loginApi } from '../api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    lastLoginAt: '',
  }),
  actions: {
    async login(payload) {
      const { data } = await loginApi(payload)
      const token = data?.data?.token || ''
      this.lastLoginAt = data?.data?.last_login_at || ''
      this.token = token
      if (token) localStorage.setItem('token', token)
      return data
    },
    logout() {
      this.token = ''
      this.lastLoginAt = ''
      localStorage.removeItem('token')
    },
  },
})
