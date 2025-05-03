<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const register = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Les mots de passe ne correspondent pas.')
    return
  }

  try {
    const response = await api.post('/auth/local/register', {
      username: email.value,
      email: email.value,
      password: password.value
    })

    console.log('Token reçu :', response.data.jwt)
    router.push('/login')
  } catch (err) {
    const message = err.response?.data?.error?.message || 'Erreur lors de l’inscription.'
    alert(message)
    console.error(err)
  }
}
</script>

<template>
  <div class="flex items-center justify-center w-full h-full py-20">
    <div
      class="w-full max-w-md bg-white dark:border dark:border-gray-400 dark:text-white dark:bg-gray-700 p-8 rounded-2xl shadow-xl self-center"
    >
      <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Créer un compte
      </h2>

      <form @submit.prevent="register" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-white"
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
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-white"
            >Mot de passe</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white dark:bg-gray-700"
          />
        </div>

        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700 dark:text-white"
            >Confirmer le mot de passe</label
          >
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white dark:bg-gray-700"
          />
        </div>

        <button
          type="submit"
          class="w-full py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-primary via-purple-600 to-secondary hover:opacity-90 transition"
        >
          S'inscrire
        </button>
      </form>

      <p class="text-sm text-center text-gray-600 mt-6 dark:text-white">
        Vous avez déjà un compte ?
        <a href="/login" class="text-purple-600 font-medium hover:underline">Se connecter</a>
      </p>
    </div>
  </div>
</template>
