<template>
  <div v-if="rejectionReason" class="rejection-banner" role="alert">
    <span class="rejection-icon" aria-hidden="true">⚠</span>
    <span class="rejection-text">Produit refusé - motif : {{ rejectionReason }}</span>
  </div>
</template>

<script setup>
defineProps({
  rejectionReason: {
    type: String,
    default: '',
  },
})
</script>

<style scoped src="../styles/RejectionBanner.css"></style>