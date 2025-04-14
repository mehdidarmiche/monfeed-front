<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' // 👈

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
    const response = await fetch('http://localhost:1337/api/auth/local/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: email.value, // Strapi exige un username
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (response.ok) {
      console.log('Token reçu :', data.jwt)
      router.push('/login')
    } else {
      alert(data.error?.message || 'Erreur lors de l’inscription.')
    }
  } catch (err) {
    console.error(err)
    alert('Erreur réseau ou serveur.')
  }
}
</script>

<template>
  <section
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-purple-50 to-blue-100 px-4"
  >
    <div class="flex items-center justify-center w-full h-full py-20">
      <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl self-center">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Créer un compte</h2>

        <form @submit.prevent="register" class="space-y-6">
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

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700"
              >Mot de passe</label
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
            class="w-full py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:opacity-90 transition"
          >
            S'inscrire
          </button>
        </form>

        <p class="text-sm text-center text-gray-600 mt-6">
          Vous avez déjà un compte ?
          <a href="/login" class="text-purple-600 font-medium hover:underline">Se connecter</a>
        </p>
      </div>
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
