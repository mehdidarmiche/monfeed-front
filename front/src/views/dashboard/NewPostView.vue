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
      <FacebookPageSelector
        v-if="selectedNetwork === 'Facebook'"
        :pages="pages"
        :loading="loadingPages"
        :selectedPage="selectedPage"
        @select="selectPage"
      />

      <!-- 3️⃣ Si page sélectionnée → Formulaire + Preview -->
      <div v-if="selectedPage" class="flex mt-6 gap-6">
        <PostForm
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

        <PostPreview
          :selectedPage="selectedPage"
          :pageProfilePicture="pageProfilePicture"
          :message="message"
          :images="images"
          :isUploadingImages="isUploadingImages"
          @remove-image="removeImage"
        />
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import FacebookPageSelector from '@/components/dashboard/post/facebook/FacebookPageSelector.vue'
import PostForm from '@/components/dashboard/post/facebook/PostForm.vue'
import PostPreview from '@/components/dashboard/post/facebook/PostPreview.vue'

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
