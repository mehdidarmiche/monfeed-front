<template>
  <DashboardLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Historique des posts</h1>

      <div v-if="loading" class="mb-4 text-gray-500">Chargement...</div>

      <table class="min-w-full bg-white border border-gray-200" v-if="paginatedPosts.length > 0">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2 text-left border-b">Titre</th>
            <th class="px-4 py-2 text-left border-b">Date</th>
            <th class="px-4 py-2 text-left border-b">Heure</th>
            <th class="px-4 py-2 text-left border-b">Page</th>
            <th class="px-4 py-2 text-left border-b">Réseau social</th>
            <th class="px-4 py-2 text-left border-b">Lien</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in paginatedPosts" :key="post.id" class="hover:bg-gray-50">
            <td class="px-4 py-2 border-b">{{ post.message || '(Pas de texte)' }}</td>
            <td class="px-4 py-2 border-b">{{ formatDate(post.created_time) }}</td>
            <td class="px-4 py-2 border-b">{{ formatHour(post.created_time) }}</td>
            <td class="px-4 py-2 border-b">{{ post.pageName }}</td>
            <td class="px-4 py-2 border-b">Facebook</td>
            <td class="px-4 py-2 border-b">
              <a :href="post.permalink_url" target="_blank" class="text-blue-500 hover:underline"
                >Voir le post</a
              >
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="text-gray-500">Aucun post trouvé.</div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-4 space-x-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 bg-secondary text-white font-bold rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span class="px-3 py-1">{{ currentPage }} / {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 bg-secondary text-white font-bold rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'

// Réfs
const pages = ref([])
const posts = ref([])
const loading = ref(false)

const currentPage = ref(1)
const pageSize = 10

// Pagination calculée
const totalPages = computed(() => Math.ceil(posts.value.length / pageSize))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return posts.value.slice(start, start + pageSize)
})

// Naviguer entre les pages
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Récupérer les pages FB de l'utilisateur + tous les posts
const fetchFacebookPagesAndPosts = async () => {
  try {
    loading.value = true
    currentPage.value = 1 // reset page

    const token = localStorage.getItem('jwt')
    console.log('🔑 JWT:', token)

    const res = await axios.get('http://localhost:1337/api/social-account/facebook/pages', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    console.log('📄 Response brute:', res)
    const pagesData = res.data?.data || []
    pages.value = pagesData

    posts.value = [] // vider avant de remplir

    for (const page of pagesData) {
      console.log(`📄 Fetch posts for page: ${page.name} (${page.id})`)

      const resPosts = await axios.get(`https://graph.facebook.com/v22.0/${page.id}/posts`, {
        params: {
          access_token: page.access_token,
          fields: 'id,message,created_time,permalink_url'
        }
      })

      const pagePosts = (resPosts.data?.data || []).map((post) => ({
        ...post,
        pageName: page.name
      }))

      posts.value.push(...pagePosts)
    }

    // Trier les posts par date décroissante
    posts.value.sort((a, b) => new Date(b.created_time) - new Date(a.created_time))

    console.log('📝 All posts:', posts.value)
  } catch (err) {
    console.error('Erreur récupération pages ou posts:', err)
    posts.value = []
  } finally {
    loading.value = false
  }
}

// Formatage des dates
const formatDate = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleDateString()
}

const formatHour = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Initialisation
onMounted(() => {
  fetchFacebookPagesAndPosts()
})
</script>
