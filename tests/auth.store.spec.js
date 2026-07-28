import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../src/stores/auth.store'

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
})

function base64Url(obj) {
  const json = JSON.stringify(obj)
  const b64 = Buffer.from(json).toString('base64')
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

describe('auth.store - restoreFromLocalStorage', () => {
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
})
