<template>
  <div class="step-indicator" aria-label="Étape du formulaire">
    <span class="step-label">Step {{ currentStep }} / 4</span>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    required: true,
  },
})
</script>

<style scoped>
.step-indicator {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 600;
  margin-bottom: 1rem;
}
</style>
