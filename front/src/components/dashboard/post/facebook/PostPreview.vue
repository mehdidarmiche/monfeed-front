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
          <p class="text-gray-500 text-xs">Just now · 🌍</p>
        </div>
      </div>

      <!-- Texte -->
      <p v-if="message" class="mb-4 whitespace-pre-line text-gray-800">{{ message }}</p>

      <!-- Images dynamique -->
      <div v-if="images.length > 0 && !isUploadingImages" class="mb-4">
        <!-- 1 image -->
        <div v-if="images.length === 1" class="relative group">
          <img
            :src="getObjectUrl(images[0])"
            alt="Preview"
            class="w-full max-h-[600px] object-cover rounded border"
          />
          <button
            @click="$emit('remove-image', 0)"
            class="absolute top-1 right-1 bg-red-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition"
            title="Supprimer l'image"
          >
            ✕
          </button>
        </div>

        <!-- 2 images -->
        <div v-else-if="images.length === 2" class="grid grid-cols-2 gap-1">
          <div v-for="(file, index) in images" :key="index" class="relative group">
            <img
              :src="getObjectUrl(file)"
              alt="Preview"
              class="w-full h-72 object-cover rounded border"
            />
            <button
              @click="$emit('remove-image', index)"
              class="absolute top-1 right-1 bg-red-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition"
              title="Supprimer l'image"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- 3 images -->
        <div v-else-if="images.length === 3" class="grid grid-cols-2 gap-1 grid-rows-2">
          <div class="relative group row-span-2">
            <img
              :src="getObjectUrl(images[0])"
              alt="Preview"
              class="w-full h-full object-cover rounded border"
            />
            <button
              @click="$emit('remove-image', 0)"
              class="absolute top-1 right-1 bg-red-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition"
              title="Supprimer l'image"
            >
              ✕
            </button>
          </div>
          <div v-for="(file, index) in images.slice(1)" :key="index + 1" class="relative group">
            <img
              :src="getObjectUrl(file)"
              alt="Preview"
              class="w-full h-72 object-cover rounded border"
            />
            <button
              @click="$emit('remove-image', index + 1)"
              class="absolute top-1 right-1 bg-red-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition"
              title="Supprimer l'image"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- 4+ images -->
        <div v-else class="grid grid-cols-2 gap-1">
          <div v-for="(file, index) in images.slice(0, 4)" :key="index" class="relative group">
            <img
              :src="getObjectUrl(file)"
              alt="Preview"
              class="w-full h-64 object-cover rounded border"
            />
            <!-- Si c'est la 4ème image ET il reste d'autres images -->
            <div
              v-if="index === 3 && images.length > 4"
              class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold"
            >
              +{{ images.length - 4 }}
            </div>
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

      <!-- Réactions / Like / Commenter / Partager -->
      <div class="border-t pt-2 text-gray-600 text-sm flex justify-between items-center">
        <div class="flex space-x-6 text-sm font-medium mt-2 text-gray-500">
          <div class="flex items-center space-x-1 cursor-pointer hover:text-blue-600">
            <span>👍</span>
            <span>J'aime</span>
          </div>
          <div class="flex items-center space-x-1 cursor-pointer hover:text-blue-600">
            <span>💬</span>
            <span>Commenter</span>
          </div>
          <div class="flex items-center space-x-1 cursor-pointer hover:text-blue-600">
            <span>↗️</span>
            <span>Partager</span>
          </div>
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
