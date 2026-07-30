import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import LoginView from '../src/views/LoginView.vue'
import { useUiStore } from '../src/stores/ui.store'

const loginMock = vi.fn()

vi.mock('../src/stores/auth.store', () => ({
  useAuthStore: () => ({
    login: loginMock,
  }),
}))

const routes = [
  { path: '/login', component: LoginView },
  { path: '/products', component: { template: '<div>Products</div>' } },
]

function mountLoginView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  const wrapper = mount(LoginView, {
    global: {
      plugins: [createPinia(), router],
    },
  })

  return { wrapper, router }
}

describe('LoginView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    loginMock.mockReset()
    loginMock.mockResolvedValue({})
  })

  it('shows an error when fields are empty', async () => {
    const { wrapper } = mountLoginView()
    await wrapper.find('form').trigger('submit.prevent')

    const uiStore = useUiStore()
    expect(uiStore.errorMessage).toBe('Veuillez saisir le login et le mot de passe.')
  })

  it('submits credentials and updates the UI state', async () => {
    const { wrapper } = mountLoginView()
    await wrapper.get('input[id="login"]').setValue('tester')
    await wrapper.get('input[id="password"]').setValue('secret')
    await wrapper.find('form').trigger('submit.prevent')

    const uiStore = useUiStore()
    expect(uiStore.loading).toBe(false)
  })

  it('redirects to /products on successful login', async () => {
    loginMock.mockResolvedValue({ data: { token: 'abc', role: 'ADMIN' } })

    const { wrapper, router } = mountLoginView()
    await wrapper.get('input[id="login"]').setValue('admin')
    await wrapper.get('input[id="password"]').setValue('admin123')
    await wrapper.find('form').trigger('submit.prevent')
    await router.isReady()

    expect(loginMock).toHaveBeenCalledWith({ login: 'admin', password: 'admin123' })
    expect(router.currentRoute.value.path).toBe('/products')
  })

  it('shows the API error message on failed login, without saying which field is wrong', async () => {
    loginMock.mockRejectedValue({ response: { data: { message: 'Identifiants incorrects' } } })

    const { wrapper, router } = mountLoginView()
    await wrapper.get('input[id="login"]').setValue('admin')
    await wrapper.get('input[id="password"]').setValue('wrong-password')
    await wrapper.find('form').trigger('submit.prevent')

    const uiStore = useUiStore()
    expect(uiStore.errorMessage).toBe('Identifiants incorrects')
    // no redirection should happen on failure
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('falls back to a generic error message when the API gives no message', async () => {
    loginMock.mockRejectedValue(new Error('network down'))

    const { wrapper } = mountLoginView()
    await wrapper.get('input[id="login"]').setValue('admin')
    await wrapper.get('input[id="password"]').setValue('admin123')
    await wrapper.find('form').trigger('submit.prevent')

    const uiStore = useUiStore()
    expect(uiStore.errorMessage).toBe('Identifiants incorrects')
  })

  it('resets the loading state after a failed login', async () => {
    loginMock.mockRejectedValue({ response: { data: { message: 'Identifiants incorrects' } } })

    const { wrapper } = mountLoginView()
    await wrapper.get('input[id="login"]').setValue('admin')
    await wrapper.get('input[id="password"]').setValue('wrong-password')
    await wrapper.find('form').trigger('submit.prevent')

    const uiStore = useUiStore()
    expect(uiStore.loading).toBe(false)
  })
})