import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../src/stores/auth.store'
import { login as loginApi } from '../src/services/api'

vi.mock('../src/services/api', () => ({
  login: vi.fn(),
}))

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
  vi.clearAllMocks()
})

function base64Url(obj) {
  const json = JSON.stringify(obj)
  const b64 = Buffer.from(json).toString('base64')
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

describe('auth.store', () => {
  it('restores state from a valid JWT in localStorage', () => {
    const payload = { sub: 'tester', firstname: 'Jean', lastname: 'Dupont', role: 'ADMIN' }
    const token = `header.${base64Url(payload)}.signature`
    localStorage.setItem('token', token)

    const store = useAuthStore()
    store.restoreFromLocalStorage()

    expect(store.token).toBe(token)
    expect(store.login).toBe('tester')
    expect(store.firstname).toBe('Jean')
    expect(store.lastname).toBe('Dupont')
    expect(store.role).toBe('ADMIN')
  })

  it('clears storage when token invalid', () => {
    localStorage.setItem('token', 'invalid.token')
    const store = useAuthStore()
    store.restoreFromLocalStorage()
    expect(store.token).toBe('')
    expect(localStorage.getItem('token')).toBe(null)
  })

  it('persists auth data after a successful login', async () => {
    loginApi.mockResolvedValue({
      data: {
        token: 'abc.def.ghi',
        login: 'tester',
        firstname: 'Jean',
        lastname: 'Dupont',
        role: 'ADMIN',
      },
    })

    const store = useAuthStore()
    await store.login({ login: 'tester', password: 'secret' })

    expect(store.isAuthenticated).toBe(true)
    expect(store.role).toBe('ADMIN')
    expect(localStorage.getItem('token')).toBe('abc.def.ghi')
  })

  it('clears auth state on logout', () => {
    const store = useAuthStore()
    store.token = 'abc'
    store.login = 'tester'
    store.firstname = 'Jean'
    store.lastname = 'Dupont'
    store.role = 'ADMIN'

    store.logout()

    expect(store.isAuthenticated).toBe(false)
    expect(store.login).toBe('')
    expect(localStorage.getItem('token')).toBe(null)
  })
})
