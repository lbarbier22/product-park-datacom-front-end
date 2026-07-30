<template>
  <div class="not-found-message">
    <h2>Élément introuvable</h2>

    <p>
      L'élément demandé n'a pas été trouvé ou n'existe plus.
    </p>

    <RouterLink to="/" class="btn-back">
      Retour à l'accueil
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped src="../styles/NotFoundMessage.css"></style>