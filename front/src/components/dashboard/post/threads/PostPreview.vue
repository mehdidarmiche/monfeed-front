<template>
  <div class="w-1/2 bg-gray-100 p-4 border rounded">
    <h2 class="text-xl font-semibold mb-4">Aperçu Threads</h2>

    <div class="bg-white rounded shadow p-4">
      <!-- En-tête -->
      <div class="flex items-center mb-4">
        <img
          v-if="selectedPage?.profile_picture_url"
          :src="selectedPage.profile_picture_url"
          alt="Profil Threads"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div
          v-else
          class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-lg font-bold"
        >
          @
        </div>
        <div class="ml-3">
          <p class="font-semibold">@{{ selectedPage?.username }}</p>
          <p class="text-gray-500 text-xs">Just now · Threads</p>
        </div>
      </div>

      <!-- Texte -->
      <p v-if="message" class="whitespace-pre-line text-gray-800 text-base leading-relaxed">
        {{ message }}
      </p>
      <p v-else class="text-gray-400 italic">Votre post Threads apparaîtra ici...</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectedPage: {
    type: Object,
    required: true
  },
  message: {
    type: String,
    required: true
  }
})
</script>
