<template>
  <section class="login-view">
    <h1>Connexion</h1>

    <form @submit.prevent="onSubmit" class="login-form">
      <div class="field">
        <label for="login">Login</label>
        <input id="login" v-model="login" autocomplete="username" />
      </div>

      <div class="field">
        <label for="password">Mot de passe</label>
        <input id="password" type="password" v-model="password" autocomplete="current-password" />
      </div>

      <button type="submit" :disabled="uiStore.loading">
        {{ uiStore.loading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { useUiStore } from '../stores/ui.store'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const uiStore = useUiStore()

const login = ref('')
const password = ref('')

const initialMessage = route.query.message
if (typeof initialMessage === 'string' && initialMessage) {
  uiStore.setError(initialMessage)
}

async function onSubmit() {
  uiStore.clearMessages()
  if (!login.value || !password.value) {
    uiStore.setError('Veuillez saisir le login et le mot de passe.')
    return
  }

  uiStore.setLoading(true)
  try {
    await auth.login({ login: login.value, password: password.value })
    router.push('/products')
  } catch (e) {
    const message = e?.response?.data?.message || 'Identifiants incorrects'
    uiStore.setError(message)
  } finally {
    uiStore.setLoading(false)
  }
}
</script>

<style scoped>
.login-view { max-width: 420px; margin: 2rem auto; }
.field { margin-bottom: 1rem; }
label { display:block; margin-bottom: .25rem; }
input { width:100%; padding:.5rem; box-sizing:border-box }
button[disabled] { opacity: .6 }
</style>
