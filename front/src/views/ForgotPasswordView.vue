<script setup>
import { ref } from 'vue'

const email = ref('')
const message = ref('')
const loading = ref(false)

const sendResetLink = async () => {
  loading.value = true
  message.value = ''

  try {
    const res = await fetch('http://localhost:1337/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })

    const data = await res.json()

    if (res.ok) {
      message.value = 'Un lien de réinitialisation vous a été envoyé par email.'
    } else {
      message.value = data.error?.message || 'Une erreur est survenue.'
    }
  } catch (err) {
    console.error(err)
    message.value = 'Erreur de connexion au serveur.'
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
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Mot de passe oublié</h2>
      <p class="text-sm text-gray-600 text-center mb-6">
        Entrez votre adresse email pour recevoir un lien de réinitialisation.
      </p>

      <form @submit.prevent="sendResetLink" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Adresse email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:opacity-90 transition disabled:opacity-50"
        >
          {{ loading ? 'Envoi en cours...' : 'Envoyer le lien' }}
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
