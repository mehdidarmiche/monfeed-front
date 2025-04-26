<script setup>
import {
  House,
  Calendar,
  SquareDashedMousePointer,
  MessagesSquare,
  Hash,
  Settings,
  LogOut
} from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isActive = (path) => {
  return route.path === path
    ? 'text-blue-600 font-bold' // actif
    : 'text-gray-700 hover:text-blue-500' // pas actif
}

const logout = () => {
  localStorage.removeItem('jwt')
  router.push('/login')
}
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-white">
      <div class="p-6 text-xl font-bold text-blue-600">
        <h1
          class="text-3xl font-bold leading-tight uppercase bg-gradient-to-r from-primary via-purple-600 to-secondary text-transparent bg-clip-text w-fit"
        >
          MONFEED
        </h1>
      </div>
      <nav class="mt-6 px-4">
        <div class="flex items-center w-fit my-3">
          <House class="shadow-lg mr-2 p-2 w-8 h-8" />
          <router-link to="/dashboard" class="block font-semibold" :class="isActive('/dashboard')"
            >Tableau de bord</router-link
          >
        </div>

        <span class="font-semibold text-gray-400">Gestion des posts</span>

        <div class="flex items-center w-fit my-3">
          <Calendar class="shadow-lg mr-2 p-2 w-8 h-8" />
          <router-link
            to="/dashboard/calendar"
            class="block font-semibold"
            :class="isActive('/dashboard/calendar')"
            >Calendrier</router-link
          >
        </div>

        <div class="flex items-center w-fit my-3">
          <SquareDashedMousePointer class="shadow-lg mr-2 p-2 w-8 h-8" />
          <router-link
            to="/dashboard/new-post"
            class="block font-semibold"
            :class="isActive('/dashboard/new-post')"
            >Nouvelle publication</router-link
          >
        </div>

        <div class="flex items-center w-fit my-3">
          <MessagesSquare class="shadow-lg mr-2 p-2 w-8 h-8" />
          <router-link
            to="/dashboard/engagement"
            class="block font-semibold"
            :class="isActive('/dashboard/engagement')"
            >Engagement</router-link
          >
        </div>

        <div class="flex items-center w-fit my-3">
          <Hash class="shadow-lg mr-2 p-2 w-8 h-8" />
          <router-link
            to="/dashboard/social-accounts"
            class="block font-semibold"
            :class="isActive('/dashboard/social-accounts')"
            >Comptes sociaux</router-link
          >
        </div>

        <span class="font-semibold text-gray-400 mt-3">Paramètres</span>

        <div class="flex items-center w-fit my-3">
          <Settings class="shadow-lg mr-2 p-2 w-8 h-8" />
          <router-link
            to="/dashboard/settings"
            class="block font-semibold"
            :class="isActive('/dashboard/settings')"
            >Paramètres</router-link
          >
        </div>
      </nav>
    </aside>

    <div class="flex flex-col flex-1">
      <header class="flex items-center justify-between px-6 py-4 bg-white">
        <h1 class="text-xl font-semibold text-gray-800">Tableau de bord</h1>
        <div class="flex items-center space-x-4">
          <button
            class="bg-white text-primary px-4 py-2 rounded-lg border border-primary hover:bg-primary hover:text-white transition"
          >
            Nouvelle publication
          </button>
          <button class="text-gray-600 hover:text-red-500 transition" @click="logout">
            <LogOut />
          </button>
        </div>
      </header>

      <!-- Slot for page content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
