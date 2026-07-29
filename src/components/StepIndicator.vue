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

<style scoped>
.step-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.step-pill {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border: 2px solid #cbd5e1;
  color: #64748b;
  background: #f8fafc;
}
.step-pill.past {
  background: #dcfce7;
  border-color: #22c55e;
  color: #166534;
}
.step-pill.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}
.step-pill.future {
  background: #f8fafc;
  color: #64748b;
}
.step-label {
  margin-left: 0.25rem;
  font-weight: 600;
  color: #334155;
}
</style>
