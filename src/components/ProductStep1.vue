<template>
  <div class="step-card">
    <h2>Étape 1 - Informations générales</h2>

    <form class="step-form" @submit.prevent="emitNext">
      <FormField id="name" :modelValue="formData.name" label="Nom" :required="true" :maxlength="100" :error="errors.name" @update:modelValue="value => updateField('name', value)" />
      <FormField id="reference" :modelValue="formData.reference" label="Référence" :required="true" :error="errors.reference" @update:modelValue="value => updateField('reference', value)" />
      <FormField id="description" :modelValue="formData.description" label="Description" type="textarea" :maxlength="1000" :rows="4" :error="errors.description" @update:modelValue="value => updateField('description', value)" />

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
