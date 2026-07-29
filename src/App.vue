<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppAlert from './components/AppAlert.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import { useUiStore } from './stores/ui.store'

const uiStore = useUiStore()
const isLoading = computed(() => uiStore.loading)
const errorMessage = computed(() => uiStore.errorMessage)
const successMessage = computed(() => uiStore.successMessage)
</script>

<template>
  <div class="app-shell">
    <AppHeader />

    <main class="app-main">
      <AppAlert v-if="errorMessage" :message="errorMessage" type="error" title="Erreur" />
      <AppAlert v-if="successMessage" :message="successMessage" type="success" title="Succès" />
      <div v-if="isLoading" class="loading-wrapper">
        <LoadingSpinner />
      </div>
      <RouterView />
    </main>
  </div>
</template>
