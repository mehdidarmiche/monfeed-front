<template>
  <DashboardLayout>
    <div class="p-4">
      <div v-if="loading">Chargement...</div>

      <div v-else>
        <!-- Comptes liés -->
        <div class="grid grid-cols-6 gap-4 mb-6">
          <!-- Facebook -->
          <div
            v-if="facebookAccount"
            class="relative flex flex-col items-center justify-center bg-white rounded-xl shadow p-4 w-full max-w-[220px]"
          >
            <div class="absolute top-2 right-2">
              <div class="relative">
                <button @click="toggleMenu('facebook')" class="text-gray-400 hover:text-gray-600">
                  <EllipsisVertical class="w-4 h-4" />
                </button>
                <div
                  v-if="showMenu === 'facebook'"
                  class="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10"
                >
                  <button
                    @click="
                      () => {
                        unlinkAccount(facebookAccount.id)
                        showMenu = null
                      }
                    "
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Dissocier
                  </button>
                </div>
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
            <p class="text-xs text-gray-500 mt-1 text-center">
              Ajouté le {{ facebookAccount.createdAt }}
            </p>
          </div>

          <!-- LinkedIn -->
          <div
            v-if="linkedinAccount"
            class="relative flex flex-col items-center justify-center bg-white rounded-xl shadow p-4 w-full max-w-[220px]"
          >
            <div class="absolute top-2 right-2">
              <div class="relative">
                <button @click="toggleMenu('linkedin')" class="text-gray-400 hover:text-gray-600">
                  <EllipsisVertical class="w-4 h-4" />
                </button>
                <div
                  v-if="showMenu === 'linkedin'"
                  class="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10"
                >
                  <button
                    @click="
                      () => {
                        unlinkAccount(linkedinAccount.id)
                        showMenu = null
                      }
                    "
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Dissocier
                  </button>
                </div>
              </div>
            </div>
            <p class="font-semibold text-center text-lg mb-2">{{ linkedinAccount.username }}</p>
            <p class="text-xs text-gray-500 mt-1 text-center">Compte LinkedIn lié</p>
            <p class="text-xs text-gray-500 mt-1 text-center">
              Ajouté le {{ linkedinAccount.createdAt }}
            </p>
          </div>

          <!-- Threads -->
          <div
            v-if="threadsAccount"
            class="relative flex flex-col items-center justify-center bg-white rounded-xl shadow p-4 w-full max-w-[220px]"
          >
            <div class="absolute top-2 right-2">
              <div class="relative">
                <button @click="toggleMenu('threads')" class="text-gray-400 hover:text-gray-600">
                  <EllipsisVertical class="w-4 h-4" />
                </button>
                <div
                  v-if="showMenu === 'threads'"
                  class="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10"
                >
                  <button
                    @click="
                      () => {
                        unlinkAccount(threadsAccount.id)
                        showMenu = null
                      }
                    "
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Dissocier
                  </button>
                </div>
              </div>
            </div>
            <div class="w-14 h-14 mb-3">
              <img
                :src="threadsAccount.pictureUrl"
                alt="Photo de profil"
                class="w-full h-full object-cover rounded"
              />
            </div>
            <p class="font-semibold text-center text-lg mb-2">{{ threadsAccount.username }}</p>
            <p class="text-xs text-gray-500 mt-1 text-center">Compte Threads lié</p>
            <p class="text-xs text-gray-500 mt-1 text-center">
              Ajouté le {{ threadsAccount.createdAt }}
            </p>
          </div>
        </div>

        <!-- Boutons connexion -->
        <div class="flex flex-col space-y-3">
          <button
            v-if="!facebookAccount"
            @click="connectFacebook"
            :disabled="loading"
            class="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl shadow hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Connecter mon compte Facebook
          </button>

          <button
            v-if="!linkedinAccount"
            @click="connectLinkedin"
            :disabled="loading"
            class="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl shadow hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Connecter mon compte LinkedIn
          </button>

          <button
            v-if="!threadsAccount"
            @click="connectThreads"
            :disabled="loading"
            class="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Connecter mon compte Threads
          </button>
          <!-- TEST DEV: Injecter token Threads -->
          <div class="flex items-center space-x-2">
            <input
              v-model="manualThreadsToken"
              type="text"
              placeholder="Token Threads (dev)"
              class="flex-1 px-3 py-2 border rounded w-full text-sm"
            />
            <button
              @click="injectThreadsToken"
              :disabled="loading || !manualThreadsToken"
              class="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lier avec token
            </button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
  <ToastContainer :toasts="toasts" @remove="removeToast" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import ToastContainer from '@/components/items/ToastContainer.vue'
import { EllipsisVertical } from 'lucide-vue-next'

const facebookAccount = ref(null)
const linkedinAccount = ref(null)
const threadsAccount = ref(null)
const loading = ref(true)

const showMenu = ref(null)

const toasts = ref([])
let toastIdCounter = 0

const showToast = (message, type = 'success') => {
  const id = toastIdCounter++
  const toast = { id, message, type }
  toasts.value.push(toast)

  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, 4000)
}

const removeToast = (id) => {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

const toggleMenu = (provider) => {
  showMenu.value = showMenu.value === provider ? null : provider
}

const manualThreadsToken = ref('')

const injectThreadsToken = async () => {
  try {
    await fetch('http://localhost:1337/api/social-account/threads/link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({ access_token: manualThreadsToken.value })
    })

    await fetchSocialAccount()
    manualThreadsToken.value = ''
    showToast('Compte Threads lié avec succès !', 'success')
  } catch (err) {
    console.error('Erreur lors de l’injection du token Threads :', err)
    showToast('Erreur lors de l’injection du token Threads.', 'error')
  }
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

const connectLinkedin = () => {
  const clientId = '78grxq225dt6tc'
  const redirectUri = 'http://localhost:5173/dashboard/social-accounts'
  const scope = 'openid profile email'
  const state = 'monfeedlinkedin123'

  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}&scope=${encodeURIComponent(scope)}`

  window.location.href = url
}

const connectThreads = () => {
  const clientId = '1390201078985063'
  const redirectUri = 'http://localhost:5173/dashboard/social-accounts'
  const state = 'monfeedthreads123'
  const scope = 'threads_basic,threads_content_publish,threads_manage_insights'

  const url = `https://threads.net/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&response_type=code&state=${state}`

  window.location.href = url
}

const fetchThreadsProfile = async () => {
  try {
    const res = await fetch('http://localhost:1337/api/social-account/threads/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    })

    if (!res.ok) {
      throw new Error(`Erreur HTTP: ${res.status}`)
    }

    const data = await res.json()

    if (threadsAccount.value) {
      threadsAccount.value.pictureUrl = data.threads_profile_picture_url || ''
    }
  } catch (err) {
    console.error('Erreur lors du fetch du profil Threads :', err)
  }
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
    const li = items.find((acc) => acc?.provider === 'linkedin')
    const th = items.find((acc) => acc?.provider === 'threads')

    if (fb) {
      facebookAccount.value = {
        id: fb.id,
        username: fb.username,
        createdAt: new Date(fb.createdAt).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        pictureUrl: `https://graph.facebook.com/${fb.account_id}/picture?type=normal&access_token=${encodeURIComponent(fb.access_token)}`
      }
    } else {
      facebookAccount.value = null
    }

    if (li) {
      linkedinAccount.value = {
        id: li.id,
        username: li.username,
        createdAt: new Date(li.createdAt).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      }
    } else {
      linkedinAccount.value = null
    }

    if (th) {
      threadsAccount.value = {
        id: th.id,
        username: th.username,
        createdAt: new Date(th.createdAt).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        pictureUrl: '' // sera rempli après
      }

      // Appeler l'API Threads pour récupérer la photo de profil
      await fetchThreadsProfile()
    } else {
      threadsAccount.value = null
    }
  } catch (err) {
    console.error('Erreur lors du fetch des comptes sociaux :', err)
    facebookAccount.value = null
    linkedinAccount.value = null
    threadsAccount.value = null
  }
}

const unlinkAccount = async (id) => {
  try {
    if (!id) return
    await fetch(`http://localhost:1337/api/social-account/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    })
    await fetchSocialAccount()
  } catch (err) {
    console.error('Erreur lors de la suppression :', err)
  }
}

const submitFacebookCodeToBackend = async (code) => {
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
    console.error('Erreur lors de l’envoi du code Facebook à Strapi :', err)
  }
}

const submitLinkedinCodeToBackend = async (code) => {
  try {
    await fetch('http://localhost:1337/api/social-account/linkedin/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({ code })
    })
  } catch (err) {
    console.error('Erreur lors de l’envoi du code LinkedIn à Strapi :', err)
  }
}

const submitThreadsCodeToBackend = async (code) => {
  try {
    await fetch('http://localhost:1337/api/social-account/threads/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({ code })
    })
  } catch (err) {
    console.error('Erreur lors de l’envoi du code Threads à Strapi :', err)
  }
}

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')

  if (code && state === 'monfeed123') {
    await submitFacebookCodeToBackend(code)
    await fetchSocialAccount()
    window.history.replaceState({}, '', '/dashboard/social-accounts')
  } else if (code && state === 'monfeedlinkedin123') {
    await submitLinkedinCodeToBackend(code)
    await fetchSocialAccount()
    window.history.replaceState({}, '', '/dashboard/social-accounts')
  } else if (code && state === 'monfeedthreads123') {
    await submitThreadsCodeToBackend(code)
    await fetchSocialAccount()
    window.history.replaceState({}, '', '/dashboard/social-accounts')
  } else {
    await fetchSocialAccount()
  }

  loading.value = false
})
</script>
