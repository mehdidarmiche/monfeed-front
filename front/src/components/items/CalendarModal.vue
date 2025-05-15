<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Créer un événement</h2>
      <form @submit.prevent="onSubmit">
        <label class="block mb-2">
          Titre :
          <input v-model="localEvent.title" class="border w-full px-2 py-1 rounded mt-1" required />
        </label>
        <label class="block mb-2">
          Heure de début :
          <input
            type="time"
            v-model="localEvent.startTime"
            class="border w-full px-2 py-1 rounded mt-1"
            required
          />
        </label>
        <label class="block mb-4">
          Heure de fin :
          <input
            type="time"
            v-model="localEvent.endTime"
            class="border w-full px-2 py-1 rounded mt-1"
            required
          />
        </label>

        <!-- Description + IA -->
        <label class="block mb-4">
          Description :
          <textarea
            v-model="localEvent.description"
            rows="3"
            class="border w-full px-2 py-1 rounded mt-1"
            placeholder="Ajoutez une description ou générez-en une"
          ></textarea>
          <button
            type="button"
            @click="generateDescription"
            class="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded flex items-center"
            :disabled="loading"
          >
            <span v-if="loading" class="loader mr-2"></span>
            Générer avec l'IA
          </button>
        </label>

        <div class="flex justify-end gap-2">
          <button type="button" @click="emit('close')" class="px-4 py-1 border rounded">
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-1 bg-blue-600 text-white rounded"
            :disabled="!localEvent.description"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  event: Object
})

const emit = defineEmits(['submit', 'close'])

const loading = ref(false)

const localEvent = reactive({
  title: '',
  startTime: '',
  endTime: '',
  description: ''
})

watch(
  () => props.event,
  (newEvent) => {
    if (newEvent) {
      localEvent.title = newEvent.title || ''
      localEvent.startTime = newEvent.startTime || ''
      localEvent.endTime = newEvent.endTime || ''
      localEvent.description = newEvent.description || ''
    }
  },
  { immediate: true }
)

const onSubmit = () => {
  emit('submit', { ...localEvent })
}

const generateDescription = async () => {
  if (!localEvent.title) return

  loading.value = true

  try {

    const res = await fetch('http://localhost:1337/api/events/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: localEvent.title
      })
    })

    const data = await res.json()
    localEvent.description = data.description
  } catch (err) {
    console.error('Erreur appel backend IA :', err)
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.loader {
  border: 2px solid #e5e7eb;
  border-top: 2px solid #4b5563;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
