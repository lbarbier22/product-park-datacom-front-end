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

			<div v-if="error" class="error">{{ error }}</div>

			<button type="submit" :disabled="loading">
				{{ loading ? 'Connexion...' : 'Se connecter' }}
			</button>
		</form>
	</section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

const router = useRouter()
const auth = useAuthStore()

const login = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
	error.value = ''
	if (!login.value || !password.value) {
		error.value = 'Veuillez saisir le login et le mot de passe.'
		return
	}

	loading.value = true
	try {
		await auth.login({ login: login.value, password: password.value })
		router.push('/products')
	} catch (e) {
		error.value = e?.response?.data?.message || 'Identifiants incorrects'
	} finally {
		loading.value = false
	}
}
</script>

<style scoped>
.login-view { max-width: 420px; margin: 2rem auto; }
.field { margin-bottom: 1rem; }
label { display:block; margin-bottom: .25rem; }
input { width:100%; padding:.5rem; box-sizing:border-box }
.error { color: #b00020; margin-bottom: .5rem }
button[disabled] { opacity: .6 }
</style>
