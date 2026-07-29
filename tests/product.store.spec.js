import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useProductStore } from '../src/stores/product.store'
import { getProducts } from '../src/services/api'

vi.mock('../src/services/api', () => ({
  getProducts: vi.fn(),
}))

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('product.store', () => {
  it('fetches the product list with an optional status filter', async () => {
    getProducts.mockResolvedValue({
      data: [{ id: 1, name: 'Produit A', status: 'DRAFT' }],
    })

    const store = useProductStore()
    await store.fetchList('DRAFT')

    expect(getProducts).toHaveBeenCalledWith('DRAFT')
    expect(store.products).toHaveLength(1)
    expect(store.products[0].name).toBe('Produit A')
  })
})
