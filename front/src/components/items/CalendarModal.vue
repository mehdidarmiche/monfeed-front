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
        <div class="flex justify-end gap-2">
          <button type="button" @click="emit('close')" class="px-4 py-1 border rounded">
            Annuler
          </button>
          <button type="submit" class="px-4 py-1 bg-blue-600 text-white rounded">Ajouter</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  event: Object
})

const emit = defineEmits(['submit', 'close'])

// copie locale modifiable
const localEvent = reactive({
  title: '',
  startTime: '',
  endTime: ''
})

// synchronisation à chaque fois que la prop "event" change
watch(
  () => props.event,
  (newEvent) => {
    if (newEvent) {
      localEvent.title = newEvent.title || ''
      localEvent.startTime = newEvent.startTime || ''
      localEvent.endTime = newEvent.endTime || ''
    }
  },
  { immediate: true }
)

const onSubmit = () => {
  emit('submit', { ...localEvent }) // envoie une copie
}
</script>
