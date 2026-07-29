<template>
  <div class="spinner" role="status" aria-label="Chargement">
    <div class="spinner-circle"></div>
  </div>
</template>

<style scoped>
.spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
}
.spinner-circle {
  width: 24px;
  height: 24px;
  border: 3px solid #dfe3ea;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
