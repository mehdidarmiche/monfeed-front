<script setup>
import { ref, onMounted, watch } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'
const isDark = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('theme')
  isDark.value = saved === 'dark'

  document.documentElement.classList.toggle('dark', isDark.value)
})

watch(isDark, (val) => {
  document.documentElement.classList.toggle('dark', val)
  localStorage.setItem('theme', val ? 'dark' : 'light')
})
</script>

<template>
  <button
    @click="isDark = !isDark"
    class="p-2 rounded-full border mx-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow transition duration-300 hover:scale-105"
    aria-label="Toggle dark mode"
  >
    <component :is="isDark ? Moon : Sun" class="w-5 h-5" />
  </button>
</template>
