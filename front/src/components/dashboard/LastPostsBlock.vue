<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const posts = ref([])
const loading = ref(false)

const fetchFacebookPagesAndPosts = async () => {
  try {
    loading.value = true

    const token = localStorage.getItem('jwt')
    console.log('🔑 JWT:', token)

    const res = await axios.get('http://localhost:1337/api/social-account/facebook/pages', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const pagesData = res.data?.data || []

    posts.value = []

    for (const page of pagesData) {
      const resPosts = await axios.get(`https://graph.facebook.com/v22.0/${page.id}/posts`, {
        params: {
          access_token: page.access_token,
          fields: 'id,message,created_time,permalink_url'
        }
      })

      const pagePosts = (resPosts.data?.data || []).map((post) => ({
        ...post,
        pageName: page.name,
        network: 'Facebook' // Pour l’instant on fixe
      }))

      posts.value.push(...pagePosts)
    }

    // Trier et garder les 5 derniers
    posts.value.sort((a, b) => new Date(b.created_time) - new Date(a.created_time))
    posts.value = posts.value.slice(0, 5)

    console.log('📝 Last 5 posts:', posts.value)
  } catch (err) {
    console.error('Erreur récupération posts:', err)
    posts.value = []
  } finally {
    loading.value = false
  }
}

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

onMounted(() => {
  fetchFacebookPagesAndPosts()
})
</script>

<template>
  <div class="bg-transparent">
    <h2 class="text-xl font-semibold mb-4">Derniers posts</h2>

    <div v-if="loading" class="text-white">Chargement...</div>

    <div v-else-if="posts.length === 0" class="text-white">Aucun post trouvé.</div>

    <div v-else class="space-y-4">
      <div
        v-for="post in posts"
        :key="post.id"
        class="p-3 border rounded-lg bg-white text-black hover:shadow transition"
      >
        <!-- Texte -->
        <div class="font-medium mb-1">
          {{ post.message ? post.message.slice(0, 30) + (post.message.length > 30 ? '...' : '') : '(Pas de texte)' }}
        </div>

        <!-- Date + heure + réseau -->
        <div class="text-sm text-gray-500">
          📅 {{ formatDate(post.created_time) }} - {{ formatHour(post.created_time) }} • 🌐 {{ post.network }}
        </div>

        <!-- Lien -->
        <div class="text-sm text-blue-500 mt-1">
          <a :href="post.permalink_url" target="_blank" class="hover:underline">Voir le post</a>
        </div>
      </div>
    </div>
  </div>
</template>
