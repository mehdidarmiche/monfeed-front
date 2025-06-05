<template>
  <DashboardLayout>
    <div class="p-6 space-y-6">

      <!-- Header bienvenue -->
      <h1 class="text-3xl font-bold">👋 Bienvenue, Hudayfa</h1>

      <!-- Première ligne : Résumé + Actions rapides -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <!-- Posts publiés -->
        <div class="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl p-4 shadow flex flex-col justify-between">
          <div class="text-lg font-semibold">Posts publiés cette semaine</div>
          <div class="text-4xl font-bold mt-2">10</div>
        </div>

        <!-- Engagement -->
        <div class="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl p-4 shadow flex flex-col justify-between">
          <div class="text-lg font-semibold">Engagement total</div>
          <div class="text-4xl font-bold mt-2">520</div>
        </div>

        <!-- Évolution -->
        <div class="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl p-4 shadow flex flex-col justify-between">
          <div class="text-lg font-semibold">Évolution</div>
          <div class="text-4xl font-bold mt-2">+12%</div>
        </div>

        <!-- Actions rapides -->
        <div class="bg-white rounded-xl p-4 shadow flex flex-col justify-between">
          <h2 class="text-xl font-semibold mb-4">Actions rapides</h2>
          <button class="bg-primary text-white py-2 px-4 rounded mb-2">Créer un post</button>
          <button class="bg-primary text-white py-2 px-4 rounded mb-2">Planifier un post</button>
          <button class="bg-primary text-white py-2 px-4 rounded">Ajouter un compte</button>
        </div>

      </div>

      <!-- Deuxième ligne : Planning + Derniers posts -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

        <!-- Planning à venir -->
        <div class="bg-white rounded-xl p-4 shadow md:col-span-2">
          <!-- Mini calendrier ici -->
          <PlanningBlock />
        </div>

        <!-- Dernières publications -->
        <div class="rounded-xl p-4 shadow bg-gradient-to-r from-primary via-purple-600 to-secondary text-white">
  <LastPostsBlock />
</div>


      </div>

      <!-- Troisième ligne : Suggestions IA -->
      <div class="grid grid-cols-1">
        <div class="bg-white rounded-xl p-4 shadow">
          <h2 class="text-xl font-semibold mb-4">🧠 Suggestions IA</h2>
          <p>💡 "Parlez de la journée mondiale de l’environnement."</p>
          <p>🔥 Hashtags : #Environnement #Sustainability</p>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import PlanningBlock from '@/components/dashboard/PlanningBlock.vue';
import LastPostsBlock from '@/components/dashboard/LastPostsBlock.vue'
import '../../assets/CalendarView.scss'
</script>
