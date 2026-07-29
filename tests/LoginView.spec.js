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

const routes = [{ path: '/login', component: LoginView }]

function mountLoginView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  return mount(LoginView, {
    global: {
      plugins: [createPinia(), router],
    },
  })
}

describe('LoginView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    loginMock.mockReset()
    loginMock.mockResolvedValue({})
  })

  it('shows an error when fields are empty', async () => {
    const wrapper = mountLoginView()
    await wrapper.find('form').trigger('submit.prevent')

    const uiStore = useUiStore()
    expect(uiStore.errorMessage).toBe('Veuillez saisir le login et le mot de passe.')
  })

  it('submits credentials and updates the UI state', async () => {
    const wrapper = mountLoginView()
    await wrapper.get('input[id="login"]').setValue('tester')
    await wrapper.get('input[id="password"]').setValue('secret')
    await wrapper.find('form').trigger('submit.prevent')

    const uiStore = useUiStore()
    expect(uiStore.loading).toBe(false)
  })
})
