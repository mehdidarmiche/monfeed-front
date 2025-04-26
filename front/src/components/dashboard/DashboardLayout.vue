<script setup>
import {
  House,
  Calendar,
  SquareDashedMousePointer,
  MessagesSquare,
  Hash,
  Settings
} from 'lucide-vue-next'
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
          <House class="shadow-lg mr-2 p-2 w-8 h-8" /><a
            href="#"
            class="block font-semibold text-gray-700 hover:text-blue-500"
            >Tableau de bord</a
          >
        </div>
        <span class="font-semibold text-gray-400">Gestion des posts</span>
        <div class="flex items-center w-fit my-3">
          <Calendar class="shadow-lg mr-2 p-2 w-8 h-8" /><a
            href="#"
            class="block text-gray-700 font-semibold hover:text-blue-500"
            >Calendrier</a
          >
        </div>
        <div class="flex items-center w-fit my-3">
          <SquareDashedMousePointer class="shadow-lg mr-2 p-2 w-8 h-8" />
          <a href="#" class="block text-gray-700 font-semibold hover:text-blue-500"
            >Nouvelle publication</a
          >
        </div>
        <div class="flex items-center w-fit my-3">
          <MessagesSquare class="shadow-lg mr-2 p-2 w-8 h-8" />
          <a href="#" class="block text-gray-700 font-semibold hover:text-blue-500">Engagement</a>
        </div>
        <div class="flex items-center w-fit my-3">
          <Hash class="shadow-lg mr-2 p-2 w-8 h-8" />
          <a href="#" class="block text-gray-700 font-semibold hover:text-blue-500"
            >Comptes sociaux</a
          >
        </div>
        <span class="font-semibold text-gray-400 mt-3">paramétres</span>
        <div class="flex items-center w-fit my-3">
          <Settings class="shadow-lg mr-2 p-2 w-8 h-8" />
          <a href="#" class="block text-gray-700 font-semibold hover:text-blue-500">Paramètres</a>
        </div>
      </nav>
    </aside>
    <div class="flex flex-col flex-1">
      <header class="flex items-center justify-between px-6 py-4 bg-white">
        <h1 class="text-xl font-semibold text-gray-800">Tableau de bord</h1>
        <div class="flex items-center space-x-4">
          <button
            class="bg-white text-primary px-4 py-2 rounded-lg border border-primary hover:bg-blue-700 hover:text-white transition"
          >
            Nouvelle publication
          </button>
          <button class="text-gray-600 hover:text-red-500 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
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
