<template>
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
          <img :src="getObjectUrl(file)" alt="Preview" class="w-full object-cover rounded border" />
          <button
            @click="$emit('remove-image', index)"
            class="absolute top-1 right-1 bg-red-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition"
            title="Supprimer l'image"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectedPage: {
    type: Object,
    required: true
  },
  pageProfilePicture: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  images: {
    type: Array,
    required: true
  },
  isUploadingImages: {
    type: Boolean,
    required: true
  }
})

defineEmits(['remove-image'])

const getObjectUrl = (file) => {
  return URL.createObjectURL(file)
}
</script>
