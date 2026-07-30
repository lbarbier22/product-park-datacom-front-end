<template>
  <div class="step-card">
    <h2>Étape 3 - Conformité</h2>

    <form class="step-form" @submit.prevent="emitNext">
      <FormField id="lot" :modelValue="formData.lot" label="Numéro de lot" :required="true" :error="errors.lot" @update:modelValue="value => updateField('lot', value)" />
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

<style scoped>
.step-card { padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; }
.step-form { display: flex; flex-direction: column; gap: 0.9rem; }
button { align-self: flex-start; padding: 0.55rem 0.9rem; border: none; border-radius: 6px; background: #2563eb; color: #fff; cursor: pointer; }
button[disabled] { opacity: 0.6; cursor: not-allowed; }
.server-error { color: #b91c1c; font-size: 0.9rem; }
</style>
