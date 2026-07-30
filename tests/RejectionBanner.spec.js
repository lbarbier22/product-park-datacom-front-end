import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RejectionBanner from '../src/components/RejectionBanner.vue'

describe('RejectionBanner', () => {
  it('does not render when no reason is provided', () => {
    const wrapper = mount(RejectionBanner)
    expect(wrapper.find('.rejection-banner').exists()).toBe(false)
  })

  it('does not render when reason is an empty string', () => {
    const wrapper = mount(RejectionBanner, {
      props: { rejectionReason: '' },
    })
    expect(wrapper.find('.rejection-banner').exists()).toBe(false)
  })

  it('renders the rejection reason when provided', () => {
    const wrapper = mount(RejectionBanner, {
      props: { rejectionReason: 'Numéro de lot invalide' },
    })

    expect(wrapper.find('.rejection-banner').exists()).toBe(true)
    expect(wrapper.text()).toContain('Produit refusé - motif : Numéro de lot invalide')
  })
})