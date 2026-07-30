<template>
  <div class="step-card">
    <h2>Étape 3 - Conformité</h2>

    <form class="step-form" @submit.prevent="emitNext">
      <FormField id="lot" :modelValue="formData.lot" label="Numéro de lot" :required="true" :error="errors.lot" @update:modelValue="value => updateField('lot', value)" />
      <FormField id="certification" :modelValue="formData.certification" label="Certification" @update:modelValue="value => updateField('certification', value)" />
      <div v-if="errors.server" class="server-error">{{ errors.server }}</div>
      <button type="submit" :disabled="isSubmitting">Suivant</button>
    </form>
  </div>
</template>

<script setup>
import FormField from './FormField.vue'

const props = defineProps({
  formData: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  isSubmitting: { type: Boolean, default: false },
})

const emit = defineEmits(['update', 'next'])

function updateField(field, value) {
  emit('update', { [field]: value })
}

function emitNext() {
  emit('next')
}
</script>

<style scoped src="../styles/ProductStep.css"></style>
