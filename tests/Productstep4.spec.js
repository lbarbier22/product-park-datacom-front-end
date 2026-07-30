import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProductStep4 from '../src/components/ProductStep4.vue'

const formData = {
  name: 'Produit final',
  reference: 'REF-42',
  description: '',
  category: 'Electro',
  subcategory: '',
  manufacturer: 'Acme',
  country: 'France',
  lot: 'LOT-1',
  certification: '',
  comment: '',
}

describe('ProductStep4', () => {
  it('renders every field from the previous steps in read-only mode', () => {
    const wrapper = mount(ProductStep4, {
      props: { formData, errors: {} },
    })

    expect(wrapper.text()).toContain('Produit final')
    expect(wrapper.text()).toContain('REF-42')
    expect(wrapper.text()).toContain('Electro')
    expect(wrapper.text()).toContain('Acme')
    expect(wrapper.text()).toContain('France')
    expect(wrapper.text()).toContain('LOT-1')
    // no input/textarea/select should exist: pure read-only recap
    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.find('textarea').exists()).toBe(false)
    expect(wrapper.find('select').exists()).toBe(false)
  })

  it('shows a dash for optional empty fields left blank', () => {
    const wrapper = mount(ProductStep4, {
      props: { formData, errors: {} },
    })

    const certificationLine = wrapper.findAll('.summary-item').find((el) =>
      el.text().startsWith('Certification :')
    )
    expect(certificationLine.text()).toContain('-')
  })

  it('emits submit when the button is clicked, not next', async () => {
    const wrapper = mount(ProductStep4, {
      props: { formData, errors: {} },
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('next')).toBeFalsy()
  })

  it('disables the submit button while isSubmitting is true', () => {
    const wrapper = mount(ProductStep4, {
      props: { formData, errors: {}, isSubmitting: true },
    })

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })
})