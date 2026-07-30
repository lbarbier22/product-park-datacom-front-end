import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { login as loginApi } from '../services/api'

const decodeToken = (token) => {
  try {
    return jwtDecode(token)
  } catch (error) {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    username: '',
    firstname: '',
    lastname: '',
    role: '',
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      const response = await loginApi(credentials)
      const payload = response.data || {}
      const token = payload.token || ''

      this.token = token
      this.username = payload.login || ''
      this.firstname = payload.firstname || ''
      this.lastname = payload.lastname || ''
      this.role = payload.role || ''

      if (token) {
        localStorage.setItem('token', token)
      }

      return payload
    },

    logout() {
      this.token = ''
      this.username = ''
      this.firstname = ''
      this.lastname = ''
      this.role = ''

      localStorage.removeItem('token')
    },

    restoreFromLocalStorage() {
      const token = localStorage.getItem('token')

      if (!token) {
        return
      }

      const decoded = decodeToken(token)

      if (!decoded) {
        this.logout()
        return
      }

      this.token = token
      this.username = decoded.sub || ''
      this.firstname = decoded.firstname || ''
      this.lastname = decoded.lastname || ''
      this.role = decoded.role || ''
    },
  },
})