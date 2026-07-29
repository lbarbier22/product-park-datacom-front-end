<template>
  <div v-if="reason" class="rejection-banner" role="alert">
    <span class="rejection-icon" aria-hidden="true">⚠</span>
    <span class="rejection-text">Produit refusé - motif : {{ reason }}</span>
  </div>
</template>

<script setup>
defineProps({
  reason: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.rejection-banner {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 6px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  font-weight: 600;
}
.rejection-icon {
  font-size: 1.1rem;
  line-height: 1;
}
.rejection-text {
  font-weight: 600;
}
</style>