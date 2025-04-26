<template>
  <DashboardLayout>
    <div class="max-w-2xl mx-auto mt-10 space-y-10">
      <!-- Modifier email -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Modifier l'email</h2>
        <form @submit.prevent="updateEmail" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nouvel email</label>
            <input
              type="email"
              v-model="newEmail"
              required
              class="w-full p-2 border rounded-lg focus:ring focus:ring-purple-400"
            />
          </div>
          <button
            type="submit"
            class="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
          >
            Mettre à jour l'email
          </button>
        </form>
      </div>

      <!-- Modifier mot de passe -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Modifier le mot de passe</h2>
        <form @submit.prevent="updatePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Mot de passe actuel</label>
            <input
              type="password"
              v-model="currentPassword"
              required
              class="w-full p-2 border rounded-lg focus:ring focus:ring-purple-400"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              v-model="newPassword"
              required
              class="w-full p-2 border rounded-lg focus:ring focus:ring-purple-400"
            />
          </div>
          <button
            type="submit"
            class="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
          >
            Mettre à jour le mot de passe
          </button>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'

const newEmail = ref('')
const currentPassword = ref('')
const newPassword = ref('')

const updateEmail = async () => {
  const jwt = localStorage.getItem('jwt')

  try {
    const res = await fetch('http://localhost:1337/api/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify({ email: newEmail.value })
    })

    if (res.ok) {
      alert('Email mis à jour ✅')
      newEmail.value = ''
    } else {
      alert("Erreur lors de la mise à jour de l'email ❌")
    }
  } catch (error) {
    console.error(error)
    alert('Erreur serveur.')
  }
}

const updatePassword = async () => {
  const jwt = localStorage.getItem('jwt')

  try {
    const res = await fetch('http://localhost:1337/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify({
        currentPassword: currentPassword.value,
        password: newPassword.value,
        passwordConfirmation: newPassword.value
      })
    })

    if (res.ok) {
      alert('Mot de passe changé ✅')
      currentPassword.value = ''
      newPassword.value = ''
    } else {
      alert('Erreur lors du changement de mot de passe ❌')
    }
  } catch (error) {
    console.error(error)
    alert('Erreur serveur.')
  }
}
</script>
