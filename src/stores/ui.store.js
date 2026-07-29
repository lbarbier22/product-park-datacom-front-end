import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    loading: false,
    errorMessage: '',
    successMessage: '',
  }),
  actions: {
    setLoading(value) {
      this.loading = Boolean(value)
    },
    setError(message) {
      this.errorMessage = message || ''
    },
    setSuccess(message) {
      this.successMessage = message || ''
    },
    clearMessages() {
      this.errorMessage = ''
      this.successMessage = ''
    },
  },
})
