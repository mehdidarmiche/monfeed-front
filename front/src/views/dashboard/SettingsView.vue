<template>
  <DashboardLayout>
    <div class="max-w-2xl mx-auto mt-10 space-y-10">
      <!-- Section mot de passe -->
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
            class="w-fit px-3 flex bg-gray-700 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Mettre à jour le mot de passe
          </button>
        </form>
      </div>

      <!-- Section suppression -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Supprimer mon compte</h2>
        <form @submit.prevent="deleteAccount" class="space-y-4">
          <button
            type="submit"
            class="w-fit px-3 flex bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Supprimer mon compte
          </button>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'

const currentPassword = ref('')
const newPassword = ref('')
const router = useRouter()

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

const deleteAccount = async () => {
  const confirmDelete = confirm('Es-tu sûr de vouloir supprimer ton compte ? Cette action est irréversible.')
  if (!confirmDelete) return

  const jwt = localStorage.getItem('jwt')

  try {
    const res = await fetch('http://localhost:1337/api/me', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    if (res.ok) {
      alert('Compte supprimé ✅')
      localStorage.removeItem('jwt')
      router.push('/login')
    } else {
      alert('Erreur lors de la suppression du compte ❌')
    }
  } catch (error) {
    console.error(error)
    alert('Erreur serveur.')
  }
}
</script>
