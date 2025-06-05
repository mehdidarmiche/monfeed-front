<template>
  <DashboardLayout>
    <div class="flex p-6 gap-6">
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
          <div class="inline-flex items-center px-2 py-1 bg-red-500 text-white text-xs rounded-full">
            {{ post.unansweredCount }} commentaire(s) à répondre
          </div>
        </div>
      </div>

      <!-- Bloc de réponse droite -->
      <div class="flex-1 border rounded-xl p-6 shadow space-y-4" v-if="selectedPost && selectedComment">
        <!-- En-tête -->
        <div class="flex justify-between items-center mb-4">
          <div class="text-sm text-gray-500">Ajouté le {{ formatDate(selectedComment.date) }}</div>
          <button
            @click="markAsAnswered"
            class="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-100"
          >
            Marquer comme répondu
          </button>
        </div>

        <!-- Commentaire sélectionné -->
        <div>
          <div class="font-semibold text-gray-800 mb-1">{{ selectedComment.author }}</div>
          <div class="text-gray-700 mb-2">{{ selectedComment.content }}</div>
          <div class="text-xs text-gray-500">{{ formatRelativeDate(selectedComment.date) }}</div>
        </div>

        <!-- Zone de réponse -->
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
              class="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M2.94 2.94a1.5 1.5 0 012.12 0L10 7.88l4.94-4.94a1.5 1.5 0 112.12 2.12L12.12 10l4.94 4.94a1.5 1.5 0 01-2.12 2.12L10 12.12l-4.94 4.94a1.5 1.5 0 01-2.12-2.12L7.88 10 2.94 5.06a1.5 1.5 0 010-2.12z"
                />
              </svg>
              Envoyer
            </button>

            <button class="px-3 py-1 rounded border text-sm text-yellow-600 hover:bg-yellow-50">
              Sélectionner un ton
            </button>

            <button class="px-3 py-1 rounded bg-gradient-to-r from-primary via-purple-600 to-secondary text-white text-sm">
              Reformuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { ref, computed } from 'vue'

// Mock data
const posts = ref([
  {
    id: 1,
    title: 'Nouveau service lancé 🚀',
    date: '2025-06-01',
    unansweredCount: 3,
    comments: [
      {
        id: 101,
        author: 'emma',
        content: 'Super service !',
        date: '2025-06-05T08:30:00'
      },
      {
        id: 102,
        author: 'alex',
        content: 'Bravo pour cette nouveauté',
        date: '2025-06-05T09:00:00'
      }
    ]
  },
  {
    id: 2,
    title: 'Promo spéciale juin',
    date: '2025-05-28',
    unansweredCount: 1,
    comments: [
      {
        id: 201,
        author: 'sophie',
        content: 'J’adore cette promo !',
        date: '2025-06-04T10:00:00'
      }
    ]
  }
])

const selectedPost = ref(null)
const selectedComment = ref(null)
const responseText = ref('')

// Tri des posts par nombre de commentaires non répondus (desc)
const sortedPosts = computed(() => {
  return posts.value.slice().sort((a, b) => b.unansweredCount - a.unansweredCount)
})

function selectPost(post) {
  selectedPost.value = post
  selectedComment.value = post.comments[0] ?? null
  responseText.value = ''
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}

function formatRelativeDate(dateStr) {
  // Ici tu peux mettre une lib style dayjs pour mieux formater
  const date = new Date(dateStr)
  const diff = Math.floor((Date.now() - date.getTime()) / 60000)
  if (diff < 1) return 'À l’instant'
  if (diff < 60) return `${diff} min`
  const hours = Math.floor(diff / 60)
  return `${hours}h`
}

function sendResponse() {
  if (!responseText.value.trim()) return
  console.log('Envoyé :', responseText.value)
  // ICI tu mets ta logique API pour envoyer la réponse
  responseText.value = ''
}

function markAsAnswered() {
  console.log('Commentaire marqué comme répondu')
  // ICI tu mets ta logique API pour marquer répondu
}
</script>
