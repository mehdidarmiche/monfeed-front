<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axios'

const password = ref('')
const confirmPassword = ref('')
const message = ref('')
const loading = ref(false)

const route = useRoute()
const router = useRouter()
const token = route.query.code // Strapi envoie ?code=xxxx dans l'URL

const resetPassword = async () => {
  if (password.value !== confirmPassword.value) {
    message.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  loading.value = true
  message.value = ''

  try {
    const res = await api.post('/auth/reset-password', {
      code: token,
      password: password.value,
      passwordConfirmation: confirmPassword.value
    })

    message.value = 'Mot de passe réinitialisé avec succès.'
    setTimeout(() => router.push('/login'), 2000)
  } catch (err) {
    console.error(err)
    message.value = err.response?.data?.error?.message || 'Erreur réseau.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-purple-50 to-blue-100 px-4"
  >
    <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        Réinitialiser le mot de passe
      </h2>

      <form @submit.prevent="resetPassword" class="space-y-6">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Nouveau mot de passe</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700"
            >Confirmer le mot de passe</label
          >
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:opacity-90 transition disabled:opacity-50"
        >
          {{ loading ? 'Réinitialisation...' : 'Réinitialiser' }}
        </button>

        <p v-if="message" class="text-sm text-center mt-4 text-purple-700">{{ message }}</p>
      </form>
    </div>
  </section>
</template>

<style scoped>
section {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
