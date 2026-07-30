import { describe, expect, it } from 'vitest'
import {
  validateProductStep1,
  validateProductStep2,
  validateProductStep3,
} from '../src/utils/productFormValidation'

describe('validateProductStep1', () => {
  it('rejects a name shorter than 3 characters', () => {
    const errors = validateProductStep1({ name: 'ab', reference: 'REF-1' })
    expect(errors.name).toBeDefined()
  })

  it('rejects a name longer than 100 characters', () => {
    const errors = validateProductStep1({ name: 'a'.repeat(101), reference: 'REF-1' })
    expect(errors.name).toBeDefined()
  })

  it('requires a reference', () => {
    const errors = validateProductStep1({ name: 'Produit valide', reference: '' })
    expect(errors.reference).toBeDefined()
  })

  it('rejects a description longer than 1000 characters', () => {
    const errors = validateProductStep1({
      name: 'Produit valide',
      reference: 'REF-1',
      description: 'a'.repeat(1001),
    })
    expect(errors.description).toBeDefined()
  })

  it('accepts a fully valid step 1', () => {
    const errors = validateProductStep1({
      name: 'Produit valide',
      reference: 'REF-1',
      description: 'Description courte',
    })
    expect(errors).toEqual({})
  })
})

describe('validateProductStep2', () => {
  it('requires a category', () => {
    const errors = validateProductStep2({ category: '', manufacturer: 'Acme', country: 'France' })
    expect(errors.category).toBeDefined()
  })

  it('requires a manufacturer', () => {
    const errors = validateProductStep2({ category: 'Electro', manufacturer: '', country: 'France' })
    expect(errors.manufacturer).toBeDefined()
  })

  it('rejects a manufacturer longer than 150 characters', () => {
    const errors = validateProductStep2({
      category: 'Electro',
      manufacturer: 'a'.repeat(151),
      country: 'France',
    })
    expect(errors.manufacturer).toBeDefined()
  })

  it('requires a country', () => {
    const errors = validateProductStep2({ category: 'Electro', manufacturer: 'Acme', country: '' })
    expect(errors.country).toBeDefined()
  })

  it('accepts a fully valid step 2', () => {
    const errors = validateProductStep2({
      category: 'Electro',
      subcategory: '',
      manufacturer: 'Acme',
      country: 'France',
    })
    expect(errors).toEqual({})
  })
})

describe('validateProductStep3', () => {
  it('requires a lot number', () => {
    const errors = validateProductStep3({ lot: '' })
    expect(errors.lot).toBeDefined()
  })

  it('rejects a comment longer than 1000 characters', () => {
    const errors = validateProductStep3({ lot: 'LOT-1', comment: 'a'.repeat(1001) })
    expect(errors.comment).toBeDefined()
  })

  it('accepts a fully valid step 3 with optional fields empty', () => {
    const errors = validateProductStep3({ lot: 'LOT-1', certification: '', comment: '' })
    expect(errors).toEqual({})
  })
})