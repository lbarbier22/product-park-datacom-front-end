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

<style scoped src="../styles/AppAlert.css"></style>
