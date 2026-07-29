import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUiStore } from '../src/stores/ui.store'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('ui.store', () => {
  it('toggles loading state', () => {
    const store = useUiStore()

    store.setLoading(true)
    expect(store.loading).toBe(true)

    store.setLoading(false)
    expect(store.loading).toBe(false)
  })

  it('stores and clears error and success messages', () => {
    const store = useUiStore()

    store.setError('Oops')
    store.setSuccess('Done')

    expect(store.errorMessage).toBe('Oops')
    expect(store.successMessage).toBe('Done')

    store.clearMessages()

    expect(store.errorMessage).toBe('')
    expect(store.successMessage).toBe('')
  })
})
