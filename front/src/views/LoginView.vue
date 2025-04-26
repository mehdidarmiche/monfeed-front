<script setup>
import LoginForm from '../components/auth/LoginForm.vue'
import DarkBtn from '@/components/items/DarkBtn.vue'
</script>

<template>
  <main>
    <section class="min-h-screen flex items-center justify-center bg-white px-4 dark:bg-dark-bg">
      <LoginForm />
      <DarkBtn class="absolute top-8 right-5" />
    </section>
  </main>
</template>

<style scoped>
section {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
