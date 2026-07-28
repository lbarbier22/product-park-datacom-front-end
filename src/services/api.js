import axios from 'axios'
import router from '../router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Request interceptor: inject token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }
  return config
})

// Response interceptor: if 401 -> logout + redirect to /login with message
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status
    if (status === 401) {
      // try to call the auth store logout if available, otherwise clear localStorage
      try {
        const mod = await import('../stores/auth.store')
        const authStore = mod.useAuthStore()
        authStore.logout()
      } catch (e) {
        localStorage.removeItem('token')
      }

      try {
        router.push({ path: '/login', query: { message: 'Votre session a expiré, veuillez vous reconnecter' } })
      } catch (e) {
        // ignore router errors
      }
    }

    return Promise.reject(error)
  }
)

export const login = (credentials) => api.post('/auth/login', credentials)

export default api
