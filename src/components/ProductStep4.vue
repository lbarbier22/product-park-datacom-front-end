<template>
  <div class="step-card">
    <h2>Étape 4 - Récapitulatif</h2>

    <div class="summary-list">
      <div class="summary-item"><strong>Nom :</strong> {{ formData.name }}</div>
      <div class="summary-item"><strong>Référence :</strong> {{ formData.reference }}</div>
      <div class="summary-item"><strong>Description :</strong> {{ formData.description || '-' }}</div>
      <div class="summary-item"><strong>Catégorie :</strong> {{ formData.category }}</div>
      <div class="summary-item"><strong>Sous-catégorie :</strong> {{ formData.subcategory || '-' }}</div>
      <div class="summary-item"><strong>Fabricant :</strong> {{ formData.manufacturer }}</div>
      <div class="summary-item"><strong>Pays :</strong> {{ formData.country }}</div>
      <div class="summary-item"><strong>Numéro de lot :</strong> {{ formData.lot }}</div>
      <div class="summary-item"><strong>Certification :</strong> {{ formData.certification || '-' }}</div>
      <div class="summary-item"><strong>Commentaire :</strong> {{ formData.comment || '-' }}</div>
    </div>

    <div v-if="errors.server" class="server-error">{{ errors.server }}</div>

    <button type="button" :disabled="isSubmitting" @click="emitSubmit">Soumettre</button>
  </div>
</template>

<script setup>
defineProps({
  formData: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  isSubmitting: { type: Boolean, default: false },
})

const emit = defineEmits(['submit'])

function emitSubmit() {
  emit('submit')
}
</script>

<style scoped>
.step-card { padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; }
.summary-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
.summary-item { padding: 0.45rem 0; border-bottom: 1px solid #f1f5f9; }
button { padding: 0.55rem 0.9rem; border: none; border-radius: 6px; background: #16a34a; color: #fff; cursor: pointer; }
button[disabled] { opacity: 0.6; cursor: not-allowed; }
.server-error { color: #b91c1c; font-size: 0.9rem; margin-bottom: 0.8rem; }
</style>
