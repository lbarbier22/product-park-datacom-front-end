<template>
  <div class="step-indicator" aria-label="Étape du formulaire">
    <div v-for="step in 4" :key="step" class="step-pill" :class="getStepClass(step)">
      <span class="step-number">{{ step }}</span>
    </div>
    <span class="step-label">Step {{ currentStep }} / 4</span>
  </div>
</template>

<script setup>
const props = defineProps({
  currentStep: {
    type: Number,
    required: true,
  },
})

function getStepClass(step) {
  if (step < props.currentStep) return 'past'
  if (step === props.currentStep) return 'active'
  return 'future'
}
</script>

<style scoped src="../styles/StepIndicator.css"></style>
