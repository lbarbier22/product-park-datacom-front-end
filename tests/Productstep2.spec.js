import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProductStep2 from '../src/components/ProductStep2.vue'

const baseFormData = {
  category: '',
  subcategory: '',
  manufacturer: '',
  country: '',
}

describe('ProductStep2', () => {
  it('displays validation errors passed by the parent', () => {
    const wrapper = mount(ProductStep2, {
      props: {
        formData: baseFormData,
        errors: { manufacturer: 'Le fabricant est obligatoire.' },
      },
    })

    expect(wrapper.text()).toContain('Le fabricant est obligatoire.')
  })

  it('renders the fixed list of countries as select options', () => {
    const wrapper = mount(ProductStep2, {
      props: { formData: baseFormData, errors: {} },
    })

    const options = wrapper.findAll('#country option').map((o) => o.text())
    expect(options).toContain('France')
    expect(options).toContain('Germany')
    expect(options).toContain('USA')
  })

  it('emits update when the country select changes', async () => {
    const wrapper = mount(ProductStep2, {
      props: { formData: baseFormData, errors: {} },
    })

    await wrapper.get('#country').setValue('Germany')

    expect(wrapper.emitted('update')[0][0]).toEqual({ country: 'Germany' })
  })

  it('emits next on form submission', async () => {
    const wrapper = mount(ProductStep2, {
      props: { formData: baseFormData, errors: {} },
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('next')).toBeTruthy()
  })
})