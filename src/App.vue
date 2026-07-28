<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <h1>DATACOM Frontend</h1>
      <nav>
        <RouterLink to="/">Accueil</RouterLink>
        <RouterLink to="/login">Connexion</RouterLink>
        <RouterLink to="/products">Produits</RouterLink>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>
