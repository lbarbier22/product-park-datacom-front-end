import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    login: '',
    firstname: '',
    lastname: '',
    role: '',
  }),
  actions: {
    loginUser(payload) {
      this.token = payload.token || ''
      this.login = payload.login || ''
      this.firstname = payload.firstname || ''
      this.lastname = payload.lastname || ''
      this.role = payload.role || ''

      if (this.token) {
        localStorage.setItem('token', this.token)
      } else {
        localStorage.removeItem('token')
      }
    },
    logout() {
      this.token = ''
      this.login = ''
      this.firstname = ''
      this.lastname = ''
      this.role = ''
      localStorage.removeItem('token')
    },
  }),
})
