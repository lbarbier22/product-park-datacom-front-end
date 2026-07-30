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

<style scoped src="../styles/ProductStep.css"></style>
