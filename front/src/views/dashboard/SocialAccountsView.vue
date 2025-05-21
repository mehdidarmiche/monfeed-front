<template>
  <DashboardLayout>
    <div class="p-4">
      <div v-if="loading">Chargement...</div>

      <div v-else-if="facebookAccount">
        <div class="flex items-center gap-4 bg-gray-100 p-4 rounded shadow">
          <img
            :src="facebookAccount.pictureUrl"
            alt="Photo de profil"
            class="w-12 h-12 rounded-full"
          />
          <div>
            <p class="font-semibold">{{ facebookAccount.username }}</p>
            <p class="text-sm text-gray-500">Compte Facebook lié</p>
          </div>
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

const facebookAccount = ref(null)
const loading = ref(true)

const connectFacebook = () => {
  const clientId = '550779257825719'
  const redirectUri = 'http://localhost:5173/dashboard/social-accounts'
  const scope = 'pages_show_list,pages_manage_posts'
  const state = 'monfeed123'

  const url = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${scope}&response_type=code`
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
        username: fb.username,
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
