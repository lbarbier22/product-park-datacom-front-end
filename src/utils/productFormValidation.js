export function validateProductStep1(formData) {
  const errors = {}

  if (!formData.name || formData.name.trim().length < 3 || formData.name.trim().length > 100) {
    errors.name = 'Le nom doit contenir entre 3 et 100 caractères.'
  }

  if (!formData.reference || formData.reference.trim().length === 0) {
    errors.reference = 'La référence est obligatoire.'
  }

  if (formData.description && formData.description.trim().length > 1000) {
    errors.description = 'La description ne doit pas dépasser 1000 caractères.'
  }

  return errors
}

export function validateProductStep2(formData) {
  const errors = {}

  if (!formData.category || formData.category.trim().length === 0) {
    errors.category = 'La catégorie est obligatoire.'
  }

  if (!formData.manufacturer || formData.manufacturer.trim().length === 0) {
    errors.manufacturer = 'Le fabricant est obligatoire.'
  } else if (formData.manufacturer.trim().length > 150) {
    errors.manufacturer = 'Le fabricant ne doit pas dépasser 150 caractères.'
  }

  if (!formData.country || formData.country.trim().length === 0) {
    errors.country = 'Le pays est obligatoire.'
  }

  return errors
}

export function validateProductStep3(formData) {
  const errors = {}

  if (!formData.lotNumber || formData.lotNumber.trim().length === 0) {
    errors.lotNumber = 'Le numéro de lot est obligatoire.'
  }

  if (formData.comment && formData.comment.trim().length > 1000) {
    errors.comment = 'Le commentaire ne doit pas dépasser 1000 caractères.'
  }

  return errors
}
