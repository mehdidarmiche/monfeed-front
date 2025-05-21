<template>
  <DashboardLayout>
    <div class="p-4">
      <div v-if="loading">Chargement...</div>

      <div v-else-if="facebookAccount" class="grid grid-cols-3 gap-4">
        <div
          class="relative flex flex-col items-center justify-center bg-white rounded-xl shadow p-4 w-full max-w-[220px]"
        >
          <!-- Bouton menu -->
          <div class="absolute top-2 right-2">
            <button @click="toggleMenu" class="text-gray-400 hover:text-gray-600">
              <EllipsisVertical class="w-4 h-4" />
            </button>

            <div
              v-if="showMenu"
              class="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10"
            >
              <button
                @click="unlinkFacebook"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Dissocier
              </button>
            </div>
          </div>

          <div class="w-14 h-14 mb-3">
            <img
              :src="facebookAccount.pictureUrl"
              alt="Photo de profil"
              class="w-full h-full object-cover rounded"
            />
          </div>
          <p class="font-semibold text-center">{{ facebookAccount.username }}</p>
          <p class="text-xs text-gray-500 mt-1 text-center">Compte Facebook lié</p>
          <p class="text-xs text-gray-500 mt-1 text-center"> Ajouté le {{ facebookAccount.createdAt }}</p>
        </div>
      </div>

      <div v-else>
        <button
          @click="connectFacebook"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Connecter mon compte Facebook
        </button>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { EllipsisVertical } from 'lucide-vue-next';

const facebookAccount = ref(null)
const loading = ref(true)
const showMenu = ref(false)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const connectFacebook = () => {
  const clientId = '550779257825719'
  const redirectUri = 'http://localhost:5173/dashboard/social-accounts'
  const scope = 'pages_show_list,pages_manage_posts'
  const state = 'monfeed123'

  const url = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}&scope=${scope}&response_type=code`

  window.location.href = url
}

const fetchSocialAccount = async () => {
  try {
    const res = await fetch('http://localhost:1337/api/social-account/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    })

    const data = await res.json()
    const items = Array.isArray(data.data) ? data.data : []

    const fb = items.find((acc) => acc?.provider === 'facebook')

    if (fb) {
      facebookAccount.value = {
        id: fb.id,
        username: fb.username,
        createdAt: new Date(fb.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
        pictureUrl: `https://graph.facebook.com/${fb.account_id}/picture?type=normal&access_token=${encodeURIComponent(fb.access_token)}`
      }
    } else {
      facebookAccount.value = null
    }
  } catch (err) {
    console.error('Erreur lors du fetch du compte Facebook :', err)
    facebookAccount.value = null
  }
}



const unlinkFacebook = async () => {
  try {
    if (!facebookAccount.value?.id) return
    await fetch(`http://localhost:1337/api/social-account/${facebookAccount.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    })
    facebookAccount.value = null
    showMenu.value = false
  } catch (err) {
    console.error('Erreur lors de la suppression :', err)
  }
}


const submitCodeToBackend = async (code) => {
  try {
    await fetch('http://localhost:1337/api/social-account/facebook/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({ code })
    })
  } catch (err) {
    console.error('Erreur lors de l’envoi du code à Strapi :', err)
  }
}

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')

  if (code) {
    await submitCodeToBackend(code)
    await fetchSocialAccount()
    window.history.replaceState({}, '', '/dashboard/social-accounts')
  } else {
    await fetchSocialAccount()
  }

  loading.value = false
})
</script>
