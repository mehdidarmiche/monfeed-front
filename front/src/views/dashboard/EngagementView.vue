<template>
  <DashboardLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Gérer l’engagement</h1>

      <!-- Loader global -->
      <div v-if="isTransitioning" class="flex justify-center items-center py-10">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-secondary"
        ></div>
      </div>

      <!-- Steps -->
      <transition name="fade-slide" mode="out-in">
        <div :key="currentStep" v-if="!isTransitioning">
          <!-- Step 1 : Choisir réseau -->
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

          <!-- Step 2 : Choisir page -->
          <div v-if="currentStep === 2">
            <button @click="goBack" class="mb-4 text-blue-500">← Retour</button>
            <FacebookPageSelector
              :pages="pages"
              :loading="loadingPages"
              :selectedPage="selectedPage"
              @select="handleSelectPage"
            />
          </div>

          <!-- Step 3 : Engagement -->
          <div v-if="currentStep === 3" class="flex gap-6">
            <button @click="goBack" class="absolute top-20 left-6 text-blue-500">← Retour</button>

            <!-- Sidebar gauche -->
            <div class="w-1/4 space-y-4">
              <div
                v-for="post in sortedPosts.slice(0, 4)"
                :key="post.id"
                @click="selectPost(post)"
                :class="[
                  'cursor-pointer p-4 rounded-xl shadow border',
                  selectedPost?.id === post.id ? 'border-primary bg-gray-50' : 'border-gray-200'
                ]"
              >
                <div class="font-semibold text-gray-800 truncate mb-1">{{ post.title }}</div>
                <div class="text-sm text-gray-500 mb-2">{{ formatDate(post.date) }}</div>
                <div
                  class="inline-flex items-center px-2 py-1 bg-red-500 text-white text-xs rounded-full"
                >
                  {{ post.unansweredCount }} commentaire(s) à répondre
                </div>
              </div>
            </div>

            <!-- Bloc réponse droite -->
            <div
              class="flex-1 border rounded-xl w-40 p-6 shadow space-y-4"
              v-if="selectedPost && selectedComment"
            >
              <div class="text-sm text-gray-500 mb-4">
                Ajouté le {{ formatDate(selectedComment.date) }}
              </div>

              <div>
                <div class="font-semibold text-gray-800 mb-1">{{ selectedComment.author }}</div>
                <div class="text-gray-700 mb-2">{{ selectedComment.content }}</div>
                <div class="text-xs text-gray-500">
                  {{ formatRelativeDate(selectedComment.date) }}
                </div>
              </div>

              <!-- Boutons navigation commentaires -->
              <div class="flex gap-2 mb-4">
                <button
                  @click="prevComment"
                  :disabled="currentCommentIndex === 0"
                  class="px-3 py-1 border rounded text-sm"
                >
                  ← Commentaire précédent
                </button>
                <button
                  @click="nextComment"
                  :disabled="currentCommentIndex >= selectedPost.comments.length - 1"
                  class="px-3 py-1 border rounded text-sm"
                >
                  Commentaire suivant →
                </button>
                <div v-if="selectedPost?.commentsNext" class="mt-2">
                  <button
                    @click="loadMoreComments"
                    class="px-3 py-1 border rounded text-sm text-blue-600 hover:bg-blue-50"
                  >
                    Charger plus de commentaires
                  </button>
                </div>
              </div>

              <!-- Zone réponse -->
              <div class="space-y-2">
                <textarea
                  v-model="responseText"
                  rows="4"
                  placeholder="Votre réponse..."
                  class="w-full p-2 border rounded"
                ></textarea>

                <div class="flex gap-2">
                  <button
                    @click="sendResponse"
                    :disabled="sendingResponse"
                    class="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      v-if="sendingResponse"
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

                    <span>
                      {{ sendingResponse ? 'Envoi...' : 'Envoyer' }}
                    </span>
                  </button>

                  <button
                    class="px-3 py-1 rounded border text-sm text-yellow-600 hover:bg-yellow-50"
                  >
                    Sélectionner un ton
                  </button>

                  <button
                    class="px-3 py-1 rounded bg-gradient-to-r from-primary via-purple-600 to-secondary text-white text-sm"
                  >
                    Reformuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </DashboardLayout>
  <ToastContainer :toasts="toasts" @remove="removeToast" />
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import FacebookPageSelector from '@/components/dashboard/post/facebook/FacebookPageSelector.vue'
import ToastContainer from '@/components/items/ToastContainer.vue'

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

const networks = [
  { name: 'Facebook', icon: '/icons/facebook.svg' },
  { name: 'Instagram', icon: '/icons/instagram.svg' },
  { name: 'LinkedIn', icon: '/icons/linkedin.svg' },
  { name: 'Pinterest', icon: '/icons/pinterest.svg' }
]

const currentStep = ref(1)
const isTransitioning = ref(false)

const selectedNetwork = ref(null)
const pages = ref([])
const loadingPages = ref(false)
const selectedPage = ref(null)

const posts = ref([])
const selectedPost = ref(null)
const selectedComment = ref(null)
const currentCommentIndex = ref(0)
const responseText = ref('')
const sendingResponse = ref(false)

const sortedPosts = computed(() => {
  return posts.value
    .map((post) => ({
      ...post,
      unansweredCount: post.comments?.filter((c) => !c.isReplied).length || 0
    }))
    .filter((post) => post.unansweredCount > 0)
    .sort((a, b) => b.unansweredCount - a.unansweredCount)
})

const handleSelectNetwork = async (network) => {
  isTransitioning.value = true

  selectedNetwork.value = network
  selectedPage.value = null
  posts.value = []
  selectedPost.value = null
  selectedComment.value = null
  currentCommentIndex.value = 0
  responseText.value = ''

  if (network === 'Facebook') {
    loadingPages.value = true

    try {
      const token = localStorage.getItem('jwt')
      const res = await axios.get('http://localhost:1337/api/social-account/facebook/pages', {
        headers: { Authorization: `Bearer ${token}` }
      })
      pages.value = res.data?.data || []
    } catch (err) {
      console.error('Erreur récupération pages:', err.response?.data || err.message)
      pages.value = []
    } finally {
      loadingPages.value = false
    }

    setTimeout(() => {
      currentStep.value = 2
      isTransitioning.value = false
    }, 500)
  } else {
    showToast('Ce réseau social n’est pas encore implémenté.', 'info')
    isTransitioning.value = false
  }
}

const handleSelectPage = async (page) => {
  isTransitioning.value = true
  selectedPage.value = page
  posts.value = []

  let resPosts = null

  try {
    resPosts = await axios.get(`https://graph.facebook.com/v22.0/${page.id}/posts`, {
      params: {
        access_token: page.access_token,
        fields: 'id,message,created_time'
      }
    })
    console.log('✅ Fetched posts with /posts')
    console.log('Page access token:', page.access_token)
  } catch (err) {
    console.error('❌ /posts failed:', err.response?.data || err.message)
    posts.value = []
    isTransitioning.value = false
    return
  }

  const pagePosts = (resPosts.data?.data || []).map((post) => ({
    id: post.id,
    title: post.message || '(Pas de texte)',
    date: post.created_time,
    comments: [],
    commentsNext: null
  }))

  // 🔥 Promise.all pour charger les comments en parallèle → beaucoup plus rapide
  await Promise.all(
    pagePosts.map(async (post) => {
      const postId = post.id
      console.log(`💬 Fetch comments for ${postId}`)

      try {
        const resComments = await axios.get(`https://graph.facebook.com/v22.0/${postId}/comments`, {
          params: {
            access_token: page.access_token,
            fields: 'id,message,from,created_time,is_hidden',
            limit: 10
          }
        })

        post.comments = (resComments.data?.data || []).map((comment) => ({
          id: comment.id,
          content: comment.message,
          author: comment.from?.name || 'Anonyme',
          date: comment.created_time,
          isReplied: false
        }))

        post.commentsNext = resComments.data?.paging?.next || null
      } catch (err) {
        console.error(
          `❌ Error fetching comments for ${postId}:`,
          err.response?.data || err.message
        )
        post.comments = []
        post.commentsNext = null
      }
    })
  )

  posts.value.push(...pagePosts)
  console.log('Posts with comments:', posts.value)

  setTimeout(() => {
    currentStep.value = 3
    isTransitioning.value = false
  }, 500)
}

const goBack = () => {
  isTransitioning.value = true
  setTimeout(() => {
    if (currentStep.value === 3) currentStep.value = 2
    else if (currentStep.value === 2) currentStep.value = 1
    isTransitioning.value = false
  }, 300)
}

function selectPost(post) {
  selectedPost.value = post
  currentCommentIndex.value = 0
  updateSelectedComment()
}

function updateSelectedComment() {
  if (selectedPost.value && selectedPost.value.comments.length > 0) {
    selectedComment.value = selectedPost.value.comments[currentCommentIndex.value]
  } else {
    selectedComment.value = null
  }
}

function nextComment() {
  if (!selectedPost.value) return
  if (currentCommentIndex.value < selectedPost.value.comments.length - 1) {
    currentCommentIndex.value++
    updateSelectedComment()
  }
}

function prevComment() {
  if (!selectedPost.value) return
  if (currentCommentIndex.value > 0) {
    currentCommentIndex.value--
    updateSelectedComment()
  }
}

async function loadMoreComments() {
  if (!selectedPost.value || !selectedPost.value.commentsNext) return

  try {
    const res = await axios.get(selectedPost.value.commentsNext)
    const newComments = (res.data?.data || []).map((comment) => ({
      id: comment.id,
      content: comment.message,
      author: comment.from?.name || 'Anonyme',
      date: comment.created_time,
      isReplied: false
    }))

    selectedPost.value.comments.push(...newComments)
    selectedPost.value.commentsNext = res.data?.paging?.next || null

    console.log('➡️ Loaded more comments:', newComments)
  } catch (err) {
    console.error('❌ Error loading more comments:', err.response?.data || err.message)
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}

function formatRelativeDate(dateStr) {
  const date = new Date(dateStr)
  const diff = Math.floor((Date.now() - date.getTime()) / 60000)
  if (diff < 1) return 'À l’instant'
  if (diff < 60) return `${diff} min`
  const hours = Math.floor(diff / 60)
  return `${hours}h`
}

async function sendResponse() {
  if (!responseText.value.trim()) {
    showToast('Le texte de réponse est vide.', 'info')
    return
  }

  if (!selectedComment.value || !selectedPost.value || !selectedPage.value) {
    showToast('Aucun commentaire sélectionné.', 'error')
    return
  }

  const commentId = selectedComment.value.id
  const pageAccessToken = selectedPage.value.access_token
  const messageToSend = responseText.value.trim()

  console.log('✉️ Envoi de la réponse :', messageToSend)
  console.log('🗨️ Sur le commentaire ID :', commentId)

  sendingResponse.value = true

  try {
    // Envoyer la réponse
    await axios.post(`https://graph.facebook.com/v22.0/${commentId}/comments`, null, {
      params: {
        access_token: pageAccessToken,
        message: messageToSend
      }
    })

    console.log('✅ Réponse envoyée, vérification...')

    // Petite pause pour laisser Facebook indexer (optionnel, souvent utile)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Vérifier si la réponse apparaît bien
    const resReplies = await axios.get(`https://graph.facebook.com/v22.0/${commentId}/comments`, {
      params: {
        access_token: pageAccessToken,
        fields: 'id,message,from,created_time',
        limit: 10
      }
    })

    const replies = resReplies.data?.data || []

    const found = replies.some((reply) => reply.message?.trim() === messageToSend)

    if (found) {
      console.log('✅ Vérification OK : réponse trouvée')
      selectedComment.value.isReplied = true

      // Mettre à jour le unansweredCount du post
      selectedPost.value.unansweredCount = selectedPost.value.comments.filter(
        (c) => !c.isReplied
      ).length

      // Reset champ et passer au suivant
      responseText.value = ''
      nextComment()

      // 👉 Toast success
      showToast('Réponse envoyée avec succès !', 'success')
    } else {
      console.warn('⚠️ Réponse pas trouvée lors de la vérification')
      showToast('Réponse envoyée, mais non retrouvée (à vérifier).', 'info')
    }
  } catch (err) {
    console.error('❌ Erreur envoi/vérification réponse :', err.response?.data || err.message)
    showToast('Erreur lors de l’envoi de la réponse.', 'error')
  } finally {
    sendingResponse.value = false
  }
}
</script>

<style scoped>
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
</style>
