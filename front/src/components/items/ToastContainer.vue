<template>
  <div class="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
    <transition-group name="toast-fade" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        @click="$emit('remove', toast.id)"
        :class="[ 
          'flex items-center gap-3 px-5 py-4 rounded-lg shadow-lg text-white cursor-pointer transition transform hover:scale-105',
          toast.type === 'success'
            ? 'bg-green-500'
            : toast.type === 'error'
              ? 'bg-red-500'
              : 'bg-blue-500'
        ]"
      >
        <div v-if="toast.type === 'success'">✅</div>
        <div v-else-if="toast.type === 'error'">❌</div>
        <div v-else>ℹ️</div>

        <div class="text-sm font-medium">
          {{ toast.message }}
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
defineProps({
  toasts: Array
})

defineEmits(['remove'])
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.4s ease;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
