<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Page introuvable</h2>

    <p>
      La page que vous recherchez n'existe pas ou a été déplacée.
    </p>

    <RouterLink to="/" class="btn-home">
      Retour à l'accueil
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped src="../styles/NotFound.css"></style>