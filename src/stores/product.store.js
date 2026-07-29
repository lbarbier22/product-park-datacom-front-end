import { defineStore } from 'pinia'
import { getProducts } from '../services/api'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
  }),
  actions: {
    async fetchList(statusFilter = '') {
      const response = await getProducts(statusFilter || undefined)
      this.products = response?.data || []
      return this.products
    },
  },
})
