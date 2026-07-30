import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProductStep3 from '../src/components/ProductStep3.vue'

const baseFormData = {
  lot: '',
  certification: '',
  comment: '',
}

describe('ProductStep3', () => {
  it('displays validation errors passed by the parent', () => {
    const wrapper = mount(ProductStep3, {
      props: {
        formData: baseFormData,
        errors: { lot: 'Le numéro de lot est obligatoire.' },
      },
    })

    expect(wrapper.text()).toContain('Le numéro de lot est obligatoire.')
  })

  it('emits update when the comment field changes', async () => {
    const wrapper = mount(ProductStep3, {
      props: { formData: baseFormData, errors: {} },
    })

    await wrapper.get('#comment').setValue('Note à destination du VALIDATOR')

    expect(wrapper.emitted('update')[0][0]).toEqual({ comment: 'Note à destination du VALIDATOR' })
  })

  it('emits next on form submission', async () => {
    const wrapper = mount(ProductStep3, {
      props: { formData: baseFormData, errors: {} },
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('next')).toBeTruthy()
  })

  it('disables the submit button while isSubmitting is true', () => {
    const wrapper = mount(ProductStep3, {
      props: { formData: baseFormData, errors: {}, isSubmitting: true },
    })

    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined()
  })
})