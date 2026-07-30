import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createAppRouter } from '../src/router'

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
})

describe('router guards', () => {
  it('redirects unauthenticated users to login for protected routes', async () => {
    const router = createAppRouter()

    await router.push('/products')
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('redirects non-admin users away from admin routes', async () => {
    localStorage.setItem('token', 'fake-token')

    const router = createAppRouter()

    await router.push('/products/new')
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/products')
  })

  it('resolves an unknown URL to the not-found route (US-08.2)', async () => {
    const router = createAppRouter()

    await router.push('/this/route/does/not/exist')
    await router.isReady()

    expect(router.currentRoute.value.name).toBe('not-found')
  })
})