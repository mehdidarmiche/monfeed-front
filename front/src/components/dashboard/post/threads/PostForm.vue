<template>
  <div class="w-1/2">
    <h2 class="text-xl font-semibold mb-4">Poster sur "@{{ selectedPage?.username }}"</h2>

    <!-- Zone texte -->
    <textarea
      :value="localMessage"
      @input="onInput"
      rows="5"
      placeholder="Votre post Threads... (max 500 caractères)"
      class="w-full p-2 border rounded mb-2 resize-none"
      maxlength="500"
    ></textarea>

    <!-- Bouton IA -->
    <button
      @click="$emit('generate-ai')"
      :disabled="generatingAi"
      class="bg-secondary text-white px-3 py-1 rounded mb-4 flex items-center gap-2"
    >
      <svg
        v-if="generatingAi"
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
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      {{ generatingAi ? 'Génération en cours...' : 'Générer avec IA' }}
    </button>

    <!-- Bouton publier -->
    <button
      @click="$emit('publish')"
      :disabled="publishing"
      class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2"
    >
      <svg
        v-if="publishing"
        class="animate-spin h-5 w-5 text-white"
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
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      {{ publishing ? 'Publication en cours...' : 'Publier' }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  selectedPage: {
    type: Object,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  generatingAi: {
    type: Boolean,
    required: true
  },
  publishing: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['generate-ai', 'publish', 'update:message'])

const localMessage = ref(props.message)

watch(
  () => props.message,
  (newVal) => {
    localMessage.value = newVal
  }
)

function onInput(event) {
  localMessage.value = event.target.value
  emit('update:message', localMessage.value)
}
</script>
