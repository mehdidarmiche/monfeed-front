<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md relative">
      <button
        @click="$emit('close')"
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        aria-label="Fermer"
      >
        <X class="w-6 h-6" />
      </button>

      <h2 class="text-xl font-semibold mb-4">Détails de l’événement</h2>
      <p class="mb-2"><strong>Titre :</strong> {{ event?.title }}</p>
      <p class="mb-2"><strong>Début :</strong> {{ formatDate(event?.start) }}</p>
      <p class="mb-4"><strong>Fin :</strong> {{ formatDate(event?.end) }}</p>
      <p class="mb-4"><strong>Description :</strong> {{ event?.description || 'Aucune' }}</p>

      <div class="flex justify-end gap-2">
        <button @click="$emit('delete')" class="px-4 py-1 bg-red-600 text-white rounded">Supprimer</button>
        <button @click="$emit('edit')" class="px-4 py-1 bg-blue-600 text-white rounded">Modifier</button>
      </div>
    </div>
  </div>
</template>


<script setup>
defineProps({
  show: Boolean,
  event: Object
})

const formatDate = (date) => {
  return date ? new Date(date).toLocaleString() : ''
}

import { X } from 'lucide-vue-next'
</script>
