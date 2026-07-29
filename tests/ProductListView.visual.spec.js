import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import ProductListView from '../src/views/ProductListView.vue'

const mockFetchList = vi.fn()

vi.mock('../src/stores/auth.store', () => ({
  useAuthStore: () => ({
    role: 'ADMIN',
  }),
}))

vi.mock('../src/stores/product.store', () => ({
  useProductStore: () => ({
    products: [
      {
        id: 1,
        name: 'Produit Alpha',
        status: 'DRAFT',
        currentStep: 'Création',
        createdBy: 'alice',
        createdAt: '2025-01-15T10:00:00Z',
      },
      {
        id: 2,
        name: 'Produit Beta',
        status: 'VALIDATED',
        currentStep: 'Validation',
        createdBy: 'bob',
        createdAt: '2025-02-01T12:00:00Z',
      },
      {
        id: 3,
        name: 'Produit Gamma',
        status: 'REJECTED',
        currentStep: 'Rejet',
        createdBy: 'charlie',
        createdAt: '2025-03-10T15:30:00Z',
      },
    ],
    fetchList: mockFetchList,
  }),
}))

describe('ProductListView visual test', () => {
  beforeEach(() => {
    mockFetchList.mockReset()
  })

  it('renders a mocked product table for visual review', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/products/:id/edit', name: 'edit' }],
    })

    const wrapper = mount(ProductListView, {
      global: {
        plugins: [router],
      },
    })

    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('Liste des produits')
    expect(wrapper.text()).toContain('Produit Alpha')
    expect(wrapper.text()).toContain('Produit Beta')
    expect(wrapper.text()).toContain('Produit Gamma')
    expect(wrapper.text()).toContain('DRAFT')
    expect(wrapper.text()).toContain('VALIDATED')
    expect(wrapper.text()).toContain('REJECTED')
  })
})
