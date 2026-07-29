<template>
  <div v-if="message" class="alert" :class="type">
    <strong>{{ title }}</strong>
    <div>{{ message }}</div>
  </div>
</template>

<script setup>
defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'error' },
  title: { type: String, default: 'Erreur' },
})
</script>

<style scoped>
.alert {
  margin: 1rem 0;
  padding: 0.9rem 1rem;
  border-radius: 6px;
  border: 1px solid transparent;
}
.alert.error {
  background: #fef2f2;
  border-color: #fecaca;
  color: #991b1b;
}
.alert.success {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
}
</style>
