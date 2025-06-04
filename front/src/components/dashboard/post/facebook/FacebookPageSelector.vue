<template>
  <div class="mb-6">
    <h2 class="text-xl font-semibold mb-2">Choisir une page Facebook</h2>

    <div v-if="loading" class="text-gray-500 mb-2">Chargement des pages...</div>

    <div v-if="pages.length === 0 && !loading" class="text-gray-500 mb-2">Aucune page trouvée.</div>

    <div class="flex flex-wrap gap-4">
      <button
        v-for="page in pages"
        :key="page.id"
        @click="$emit('select', page)"
        :class="[
          'px-4 py-2 rounded border hover:bg-primary hover:text-white transition-colors',
          selectedPage?.id === page.id ? 'bg-primary text-white' : 'bg-white'
        ]"
      >
        {{ page.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  pages: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  },
  selectedPage: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])
</script>
