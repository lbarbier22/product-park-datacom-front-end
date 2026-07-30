<template>
  <div class="step-card">
    <h2>Étape 3 - Conformité</h2>

    <form class="step-form" @submit.prevent="emitNext">
      <FormField id="lotNumber" :modelValue="formData.lotNumber" label="Numéro de lot" :required="true" :error="errors.lotNumber" @update:modelValue="value => updateField('lotNumber', value)" />
      <FormField id="certification" :modelValue="formData.certification" label="Certification" @update:modelValue="value => updateField('certification', value)" />
      <FormField id="comment" :modelValue="formData.comment" label="Commentaire" type="textarea" :maxlength="1000" :rows="4" :error="errors.comment" @update:modelValue="value => updateField('comment', value)" />

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
