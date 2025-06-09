<template>
  <DashboardLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Créer un nouveau post</h1>

      <!-- ✅ Stepper -->
      <div class="flex items-center mb-8">
        <div
          v-for="step in 3"
          :key="step"
          class="flex-1 h-2 mx-1 rounded transition-all duration-300"
          :class="currentStep >= step ? 'bg-secondary' : 'bg-gray-300'"
        ></div>
      </div>

      <!-- ✅ Loader global -->
      <div v-if="isTransitioning" class="flex justify-center items-center py-10">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-secondary"
        ></div>
      </div>

      <!-- ✅ Steps avec transitions -->
      <transition name="fade-slide" mode="out-in">
        <div :key="currentStep" v-if="!isTransitioning">
          <!-- Step 1️⃣ -->
          <div v-if="currentStep === 1">
            <h2 class="text-xl font-semibold mb-4">Choisir un réseau social</h2>

            <div class="flex flex-wrap gap-6">
              <button
                v-for="network in networks"
                :key="network.name"
                @click="handleSelectNetwork(network.name)"
                class="flex flex-col items-center px-4 py-4 bg-gray-100 rounded-lg shadow hover:bg-primary transition duration-300 w-24 h-24 justify-center group"
              >
                <img
                  :src="network.icon"
                  :alt="network.name"
                  class="w-10 h-10 mb-2 transition duration-300 group-hover:filter group-hover:brightness-0 group-hover:invert"
                />
                <span class="text-sm font-medium group-hover:text-white transition duration-300">
                  {{ network.name }}
                </span>
              </button>
            </div>
          </div>

          <!-- Step 2️⃣ -->
          <div v-if="currentStep === 2">
            <button @click="goBack" class="mb-4 text-blue-500">← Retour</button>
            <FacebookPageSelector
              :pages="pages"
              :loading="loadingPages"
              :selectedPage="selectedPage"
              @select="handleSelectPage"
            />
          </div>

          <!-- Step 3️⃣ -->
          <div v-if="currentStep === 3" class="flex gap-6">
            <div class="w-full">
              <button @click="goBack" class="mb-4 text-blue-500">← Retour</button>

              <!-- FACEBOOK -->
              <PostForm
                v-if="selectedNetwork === 'Facebook'"
                :selectedPage="selectedPage"
                v-model:message="message"
                v-model:images="images"
                :generatingAi="generatingAI"
                :publishing="publishing"
                :isUploadingImages="isUploadingImages"
                @generate-ai="generatePostWithAI"
                @publish="publishPost"
                @remove-image="removeImage"
                @handle-drop="handleDrop"
                @handle-file-change="handleFileChange"
              />

              <!-- THREADS -->
              <PostFormThreads
                v-if="selectedNetwork === 'Threads'"
                :selectedPage="selectedPage"
                v-model:message="message"
                :generatingAi="generatingAI"
                :publishing="publishing"
                @generate-ai="generatePostWithAI"
                @publish="publishPost"
              />
            </div>

            <!-- PREVIEW -->
            <PostPreview
              v-if="selectedNetwork === 'Facebook'"
              :selectedPage="selectedPage"
              :pageProfilePicture="pageProfilePicture"
              :message="message"
              :images="images"
              :isUploadingImages="isUploadingImages"
              @remove-image="removeImage"
            />

            <PostPreviewThreads
              v-if="selectedNetwork === 'Threads'"
              :selectedPage="selectedPage"
              :message="message"
            />
          </div>
        </div>
      </transition>
    </div>
  </DashboardLayout>

  <!-- ✅ Toasts PRO -->
  <div class="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
    <transition-group name="toast-fade" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        @click="removeToast(toast.id)"
        :class="[
          'flex items-center gap-3 px-5 py-4 rounded-lg shadow-lg text-white cursor-pointer transition transform hover:scale-105',
          toast.type === 'success'
            ? 'bg-green-500'
            : toast.type === 'error'
              ? 'bg-red-500'
              : 'bg-blue-500'
        ]"
      >
        <div v-if="toast.type === 'success'">✅</div>
        <div v-else-if="toast.type === 'error'">❌</div>
        <div v-else>ℹ️</div>

        <div class="text-sm font-medium">
          {{ toast.message }}
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import FacebookPageSelector from '@/components/dashboard/post/facebook/FacebookPageSelector.vue'
import PostForm from '@/components/dashboard/post/facebook/PostForm.vue'
import PostPreview from '@/components/dashboard/post/facebook/PostPreview.vue'

import PostFormThreads from '@/components/dashboard/post/threads/PostForm.vue'
import PostPreviewThreads from '@/components/dashboard/post/threads/PostPreview.vue'

const networks = [
  { name: 'Facebook', icon: '/icons/facebook.svg' },
  { name: 'Instagram', icon: '/icons/instagram.svg' },
  { name: 'LinkedIn', icon: '/icons/linkedin.svg' },
  { name: 'Pinterest', icon: '/icons/pinterest.svg' },
  { name: 'Threads', icon: '/icons/threads.svg' }
]

const selectedNetwork = ref(null)
const currentStep = ref(1)
const isTransitioning = ref(false)

const pages = ref([])
const loadingPages = ref(false)
const selectedPage = ref(null)

const message = ref('')
const images = ref([])
const isUploadingImages = ref(false)
const pageProfilePicture = ref('')
const publishing = ref(false)
const generatingAI = ref(false)

// ⭐️ Toast PRO
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

// ⭐️ Sélection réseau
const handleSelectNetwork = async (network) => {
  isTransitioning.value = true

  selectedNetwork.value = network
  selectedPage.value = null
  message.value = ''
  images.value = []
  pageProfilePicture.value = ''

  if (network === 'Facebook') {
    loadingPages.value = true

    try {
      const token = localStorage.getItem('jwt')
      const res = await axios.get('http://localhost:1337/api/social-account/facebook/pages', {
        headers: { Authorization: `Bearer ${token}` }
      })
      pages.value = res.data?.data || []
    } catch (err) {
      console.error('❌ Erreur récupération pages:', err.response?.data || err.message)
      pages.value = []
      showToast('Erreur lors de la récupération des pages.', 'error')
    } finally {
      loadingPages.value = false
    }

    setTimeout(() => {
      currentStep.value = 2
      isTransitioning.value = false
    }, 500)
  } else if (network === 'Threads') {
    try {
      const token = localStorage.getItem('jwt')

      // On récupère directement le compte Threads via le nouveau endpoint propre
      const res = await axios.get('http://localhost:1337/api/social-account/threads/account', {
        headers: { Authorization: `Bearer ${token}` }
      })

      // On met à jour selectedPage directement
      selectedPage.value = res.data

      // Go Step 3
      setTimeout(() => {
        currentStep.value = 3
        isTransitioning.value = false
      }, 500)
    } catch (err) {
      console.error('❌ Erreur récupération Threads account:', err.response?.data || err.message)
      showToast('Erreur lors de la récupération du compte Threads.', 'error')
      isTransitioning.value = false
    }
  } else {
    showToast('Ce réseau social n’est pas encore implémenté.', 'info')
    isTransitioning.value = false
  }
}

// ⭐️ Sélection page
const handleSelectPage = async (page) => {
  isTransitioning.value = true

  selectedPage.value = page
  pageProfilePicture.value = ''

  const pageId = page.id
  const pageAccessToken = page.access_token

  try {
    const res = await axios.get(`https://graph.facebook.com/v22.0/${pageId}/picture`, {
      params: { access_token: pageAccessToken, type: 'large', redirect: false }
    })

    pageProfilePicture.value = res.data?.data?.url || ''
  } catch (err) {
    console.error('❌ Erreur récupération photo de profil:', err.response?.data || err.message)
    showToast('Erreur lors de la récupération de la photo de profil.', 'error')
    pageProfilePicture.value = ''
  }

  setTimeout(() => {
    currentStep.value = 3
    isTransitioning.value = false
  }, 500)
}

// ⭐️ Retour
const goBack = () => {
  isTransitioning.value = true
  setTimeout(() => {
    if (currentStep.value === 3) currentStep.value = 2
    else if (currentStep.value === 2) currentStep.value = 1
    isTransitioning.value = false
  }, 300)
}

// ⭐️ Reste du code
const handleFileChange = (event) => {
  const files = event.target.files
  isUploadingImages.value = true
  setTimeout(() => {
    images.value = [...images.value, ...Array.from(files)]
    isUploadingImages.value = false
  }, 300)
}

const handleDrop = (event) => {
  const files = event.dataTransfer.files
  isUploadingImages.value = true
  setTimeout(() => {
    images.value = [...images.value, ...Array.from(files)]
    isUploadingImages.value = false
  }, 300)
}

const removeImage = (index) => {
  images.value.splice(index, 1)
}

const generatePostWithAI = async () => {
  if (!selectedPage.value) {
    showToast("Choisissez d'abord une page.", 'info')
    return
  }

  generatingAI.value = true
  try {
    const res = await axios.post('http://localhost:1337/api/post/generate-post-message', {
      message: message.value
    })
    message.value = res.data?.data || ''
    showToast('Texte généré avec succès.', 'success')
  } catch (err) {
    console.error('❌ Erreur IA:', err.response?.data || err.message)
    showToast('Erreur lors de la génération IA.', 'error')
  } finally {
    generatingAI.value = false
  }
}

const publishPost = async () => {
  if (!selectedPage.value) return

  publishing.value = true

  if (selectedNetwork.value === 'Facebook') {
    const pageId = selectedPage.value.id
    const pageAccessToken = selectedPage.value.access_token

    try {
      if (images.value.length === 0) {
        await axios.post(`https://graph.facebook.com/v22.0/${pageId}/feed`, null, {
          params: { access_token: pageAccessToken, message: message.value }
        })
        showToast('Post texte publié avec succès !', 'success')
      } else {
        const attachedMedia = await Promise.all(
          images.value.map(async (file) => {
            const formData = new FormData()
            formData.append('access_token', pageAccessToken)
            formData.append('published', 'false')
            formData.append('source', file)

            const resPhoto = await axios.post(
              `https://graph.facebook.com/v22.0/${pageId}/photos`,
              formData
            )
            return { media_fbid: resPhoto.data.id }
          })
        )

        await axios.post(`https://graph.facebook.com/v22.0/${pageId}/feed`, null, {
          params: {
            access_token: pageAccessToken,
            message: message.value,
            attached_media: attachedMedia
          }
        })

        showToast('Post avec images publié avec succès !', 'success')
      }

      message.value = ''
      images.value = []
    } catch (err) {
      console.error('❌ Erreur publication Facebook:', err.response?.data || err.message)
      showToast('Erreur lors de la publication Facebook.', 'error')
    } finally {
      publishing.value = false
    }
  } else if (selectedNetwork.value === 'Threads') {
    try {
      const token = localStorage.getItem('jwt')

      // 👉 Appel au backend → c’est le backend qui parle à Threads (plus de CORS)
      await axios.post(
        'http://localhost:1337/api/social-account/threads/post',
        { message: message.value },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      showToast('Post Threads (texte) publié avec succès !', 'success')
      message.value = ''
      images.value = []
    } catch (err) {
      console.error('❌ Erreur publication Threads:', err.response?.data || err.message)
      showToast('Erreur lors de la publication Threads.', 'error')
    } finally {
      publishing.value = false
    }
  } else {
    showToast('Ce réseau social n’est pas encore implémenté.', 'info')
    publishing.value = false
  }
}
</script>

<!-- ✅ Transitions CSS -->
<style scoped>
/* ✅ Steps fade/slide */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* ✅ Toast transitions */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.4s ease;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
