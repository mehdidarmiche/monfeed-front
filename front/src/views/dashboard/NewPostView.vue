<template>
  <DashboardLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Créer un nouveau post</h1>

      <!-- 1️⃣ Choix du réseau social -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2">Choisir un réseau social</h2>
        <div class="flex gap-4">
          <button
            v-for="network in networks"
            :key="network"
            @click="selectNetwork(network)"
            :class="[
              'px-4 py-2 rounded',
              selectedNetwork === network ? 'bg-primary text-white' : 'bg-gray-200'
            ]"
          >
            {{ network }}
          </button>
        </div>
      </div>

      <!-- 2️⃣ Si Facebook sélectionné → choix des pages -->
      <div v-if="selectedNetwork === 'Facebook'" class="mb-6">
        <h2 class="text-xl font-semibold mb-2">Choisir une page Facebook</h2>

        <div v-if="loadingPages" class="text-gray-500 mb-2">Chargement des pages...</div>

        <div v-if="pages.length === 0 && !loadingPages" class="text-gray-500 mb-2">
          Aucune page trouvée.
        </div>

        <div class="flex flex-wrap gap-4">
          <button
            v-for="page in pages"
            :key="page.id"
            @click="selectPage(page)"
            :class="[
              'px-4 py-2 rounded border',
              selectedPage?.id === page.id ? 'bg-primary text-white' : 'bg-white'
            ]"
          >
            {{ page.name }}
          </button>
        </div>
      </div>

      <!-- 3️⃣ Si page sélectionnée → Formulaire + Preview -->
      <div v-if="selectedPage" class="flex mt-6 gap-6">
        <!-- Formulaire à gauche -->
        <div class="w-1/2">
          <h2 class="text-xl font-semibold mb-4">Poster sur "{{ selectedPage.name }}"</h2>

          <textarea
            v-model="message"
            rows="4"
            placeholder="Votre message..."
            class="w-full p-2 border rounded mb-2"
          ></textarea>

          <!-- Bouton IA sous textarea -->
          <button
            @click="generatePostWithAI"
            :disabled="generatingAI"
            class="bg-secondary text-white px-3 py-1 rounded mb-4 flex items-center gap-2"
          >
            <svg
              v-if="generatingAI"
              class="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            {{ generatingAI ? 'Génération en cours...' : 'Générer avec IA' }}
          </button>

          <!-- Drag & Drop Zone -->
          <div
            class="mb-4 p-4 border-2 border-dashed rounded text-center cursor-pointer hover:bg-gray-100 transition"
            @dragover.prevent
            @drop.prevent="handleDrop"
            @click="$refs.fileInput.click()"
          >
            <p class="text-gray-600 mb-2">
              Glissez-déposez vos images ici ou cliquez pour sélectionner
            </p>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              @change="handleFileChange"
              class="hidden"
            />
          </div>

          <!-- Loading des images -->
          <div v-if="isUploadingImages" class="text-gray-500 mb-2 flex items-center gap-2">
            <svg
              class="animate-spin h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Chargement des images...
          </div>

          <!-- Bouton publier -->
          <button
            @click="publishPost"
            :disabled="publishing"
            class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2"
          >
            <svg
              v-if="publishing"
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            {{ publishing ? 'Publication en cours...' : 'Publier' }}
          </button>
        </div>

        <!-- Preview à droite (style post Facebook) -->
        <div class="w-1/2 bg-gray-100 p-4 border rounded">
          <h2 class="text-xl font-semibold mb-4">Aperçu du post</h2>
          <div class="bg-white rounded shadow p-4">
            <!-- En-tête -->
            <div class="flex items-center mb-4">
              <img
                v-if="pageProfilePicture"
                :src="pageProfilePicture"
                alt="Page profile"
                class="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div v-else class="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>

              <div>
                <p class="font-semibold">{{ selectedPage.name }}</p>
                <p class="text-sm text-gray-500">Just now</p>
              </div>
            </div>

            <!-- Texte -->
            <p class="mb-4 whitespace-pre-line text-gray-800">{{ message }}</p>

            <!-- Images avec bouton supprimer -->
            <div v-if="images.length > 0 && !isUploadingImages" class="grid grid-cols-2 gap-2">
              <div v-for="(file, index) in images" :key="index" class="relative group">
                <img
                  :src="getObjectUrl(file)"
                  alt="Preview"
                  class="w-full object-cover rounded border"
                />
                <button
                  @click="removeImage(index)"
                  class="absolute top-1 right-1 bg-red-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition"
                  title="Supprimer l'image"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'

const networks = ['Facebook', 'Instagram', 'LinkedIn', 'Pinterest']
const selectedNetwork = ref(null)

const pages = ref([])
const loadingPages = ref(false)
const selectedPage = ref(null)

const message = ref('')
const images = ref([])
const isUploadingImages = ref(false)
const pageProfilePicture = ref('')
const publishing = ref(false)
const generatingAI = ref(false)

const selectNetwork = async (network) => {
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
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      pages.value = res.data?.data || []
    } catch (err) {
      console.error('❌ Erreur récupération pages:', err.response?.data || err.message)
      pages.value = []
    } finally {
      loadingPages.value = false
    }
  }
}

const selectPage = async (page) => {
  selectedPage.value = page
  pageProfilePicture.value = ''

  const pageId = page.id
  const pageAccessToken = page.access_token

  try {
    const res = await axios.get(`https://graph.facebook.com/v22.0/${pageId}/picture`, {
      params: {
        access_token: pageAccessToken,
        type: 'large',
        redirect: false
      }
    })

    pageProfilePicture.value = res.data?.data?.url || ''
  } catch (err) {
    console.error('❌ Erreur récupération photo de profil:', err.response?.data || err.message)
    pageProfilePicture.value = ''
  }
}

const handleFileChange = (event) => {
  const files = event.target.files
  isUploadingImages.value = true

  setTimeout(() => {
    images.value = Array.from(files)
    isUploadingImages.value = false
  }, 300)
}

const handleDrop = (event) => {
  const files = event.dataTransfer.files
  isUploadingImages.value = true

  setTimeout(() => {
    images.value = Array.from(files)
    isUploadingImages.value = false
  }, 300)
}

const removeImage = (index) => {
  images.value.splice(index, 1)
}

const getObjectUrl = (file) => {
  return URL.createObjectURL(file)
}

const generatePostWithAI = async () => {
  if (!selectedPage.value) {
    alert("Choisissez d'abord une page.")
    return
  }

  generatingAI.value = true

  try {
    const res = await axios.post('http://localhost:1337/api/post/generate-post-message', {
      message: message.value
    })

    const aiText = res.data?.data || ''
    message.value = aiText
  } catch (err) {
    console.error('❌ Erreur IA:', err.response?.data || err.message)
    alert('Erreur lors de la génération IA.')
  } finally {
    generatingAI.value = false
  }
}

const publishPost = async () => {
  if (!selectedPage.value) return

  publishing.value = true

  const pageId = selectedPage.value.id
  const pageAccessToken = selectedPage.value.access_token

  try {
    if (images.value.length === 0) {
      await axios.post(`https://graph.facebook.com/v22.0/${pageId}/feed`, null, {
        params: {
          access_token: pageAccessToken,
          message: message.value
        }
      })

      alert('Post texte publié avec succès !')
    } else {
      const attachedMedia = []

      for (const file of images.value) {
        const formData = new FormData()
        formData.append('access_token', pageAccessToken)
        formData.append('published', 'false')
        formData.append('source', file)

        const resPhoto = await axios.post(
          `https://graph.facebook.com/v22.0/${pageId}/photos`,
          formData
        )
        attachedMedia.push({ media_fbid: resPhoto.data.id })
      }

      await axios.post(`https://graph.facebook.com/v22.0/${pageId}/feed`, null, {
        params: {
          access_token: pageAccessToken,
          message: message.value,
          attached_media: attachedMedia
        }
      })

      alert('Post avec images publié avec succès !')
    }

    message.value = ''
    images.value = []
  } catch (err) {
    console.error('❌ Erreur publication:', err.response?.data || err.message)
    alert('Erreur lors de la publication.')
  } finally {
    publishing.value = false
  }
}
</script>
