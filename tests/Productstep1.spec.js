import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProductStep1 from '../src/components/ProductStep1.vue'

const baseFormData = {
  name: '',
  reference: '',
  description: '',
}

describe('ProductStep1', () => {
  it('displays validation errors passed by the parent', () => {
    const wrapper = mount(ProductStep1, {
      props: {
        formData: baseFormData,
        errors: { name: 'Le nom doit contenir entre 3 et 100 caractères.' },
      },
    })

    expect(wrapper.text()).toContain('Le nom doit contenir entre 3 et 100 caractères.')
  })

  it('emits an update event with the field name and value on input', async () => {
    const wrapper = mount(ProductStep1, {
      props: { formData: baseFormData, errors: {} },
    })

    await wrapper.get('#name').setValue('Produit test')

    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('update')[0][0]).toEqual({ name: 'Produit test' })
  })

  it('emits next on form submission', async () => {
    const wrapper = mount(ProductStep1, {
      props: { formData: baseFormData, errors: {} },
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('next')).toBeTruthy()
  })

  it('disables the submit button while isSubmitting is true', () => {
    const wrapper = mount(ProductStep1, {
      props: { formData: baseFormData, errors: {}, isSubmitting: true },
    })

    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined()
  })
})