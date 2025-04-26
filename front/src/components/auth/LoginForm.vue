<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    const response = await fetch('http://localhost:1337/api/auth/local', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('jwt', data.jwt)
      router.push('/dashboard') // redirige vers une page protégée
    } else {
      alert(data.error?.message || 'Identifiants invalides.')
    }
  } catch (err) {
    alert('Erreur serveur.')
    console.error(err)
  }
}
</script>

<template>
  <div class="flex items-center justify-center w-full h-full py-20">
    <div
      class="w-full max-w-md bg-white dark:bg-dark-bg dark:border dark:border-white p-8 rounded-2xl shadow-xl self-center"
    >
      <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Connexion</h2>

      <form @submit.prevent="login" class="space-y-6 dark:text-white">
        <div>
          <label for="email" class="block text-sm font-medium dark:text-white text-gray-700"
            >Adresse email</label
          >
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white dark:bg-gray-700"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium dark:text-white text-gray-700"
            >Mot de passe</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white dark:bg-gray-700"
          />
          <div class="text-right mt-2">
            <router-link to="/login/forgot-password" class="text-sm text-secondary hover:underline"
              >Mot de passe oublié ?</router-link
            >
          </div>
        </div>

        <button
          type="submit"
          class="w-full py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-primary via-purple-600 to-secondary hover:opacity-90 transition"
        >
          Se connecter
        </button>
      </form>

      <p class="text-sm text-center text-gray-600 dark:text-gray-200 mt-6">
        Vous n'avez pas de compte ?
        <a href="/register" class="text-purple-600 font-medium hover:underline">Créer un compte</a>
      </p>
    </div>
  </div>
</template>
