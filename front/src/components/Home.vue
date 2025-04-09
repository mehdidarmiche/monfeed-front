<script setup>
defineOptions({
  name: 'HomePage'
})

import { Check } from 'lucide-vue-next'
</script>

<template>
  <header class="flex items-center justify-between mx-14 mt-8">
    <h1
      class="text-4xl font-bold leading-tight uppercase bg-gradient-to-r from-primary via-purple-500 to-secondary text-transparent bg-clip-text w-fit"
    >
      MONFEED
    </h1>
    <nav class="flex items-center">
      <ul class="flex">
        <li class="mx-4"><a href="#about">About</a></li>
        <li class="mx-4"><a href="#services">Services</a></li>
        <li class="mx-4"><a href="#contact">Contact</a></li>
      </ul>
    </nav>
    <a
      class="py-2 px-4 rounded-full cursor-pointer text-lg bg-gradient-to-r from-primary via-purple-600 to-secondary text-white font-semibold"
      href="#Dashboard"
    >
      tableau de bord</a
    >
  </header>
  <main>
    <div class="hero-header mt-24 mx-14">
      <h2 class="text-4xl text-center font-bold">
        Dominez les réseaux sociaux <br />Maximisez votre impact avec l'IA.
      </h2>
      <p class="mt-4 text-center text-lg w-5/12 mx-auto">
        Créez, planifiez, publiez et gérez aisément votre présence sur les réseaux sociaux. Grâce à
        monfeed.com propulsée par l’IA.
      </p>
      <a
        href="#projects"
        class="mt-8 mx-auto w-fit flex px-6 py-3 font-bold bg-purple-600 text-white rounded"
      >
        Essayer gratuitement
      </a>
      <div class="mt-3 flex mx-auto w-fit">
        <span class="text-center mx-2 flex"> <Check class="mx-1" />Aucune carte requise</span>
        <span class="text-center mx-2 flex"> <Check class="mx-1" />Annulable à tout moment</span>
      </div>
    </div>
    <section
      class="py-8 px-6 mx-14 my-16 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 text-white text-center rounded-3xl shadow-inner"
    >
      <h2 class="text-3xl font-bold mb-10">Generate posts with our AI agent</h2>

      <div
        class="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 backdrop-blur-md"
      >
        <video class="w-full h-auto" muted autoplay>
          <source src="/videos/demo_monfeed.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>

    <div class="grid grid-cols-12 grid-rows-12 gap-4 mx-14 mb-12 text-gray-800">
      <!-- Bloc 1 -->
      <div
        class="col-span-7 row-span-3 p-6 rounded-2xl shadow-lg flex items-center flex-col md:flex-row gap-4 h-full"
      >
        <img src="/images/Caption.jpg" alt="Génération de contenu" class="w-1/3" />
        <div>
          <h3 class="text-xl font-bold mb-2">Générez des contenus en un clic</h3>
          <p>
            Transformez vos idées en légendes et posts en un rien de temps. Avec un clic, utilisez
            notre IA pour améliorer vos posts, générer des idées et même traduire votre contenu.
          </p>
        </div>
      </div>

      <!-- Bloc 2 -->
      <div
        class="col-span-5 row-span-6 col-start-8 bg-white p-6 rounded-2xl shadow-lg text-center flex flex-col items-center h-full"
      >
        <img src="/images/Emotion.jpg" alt="Analyse de sentiment" class="mb-2" />
        <h3 class="text-xl font-bold mb-2">Priorisez les conversations importantes</h3>
        <p>
          Avec notre analyse de sentiment IA, saisissez l’émotion derrière chaque commentaire et
          répondez en conséquence.
        </p>
      </div>

      <!-- Bloc 3 -->
      <div
        class="col-span-7 row-span-3 row-start-4 bg-white p-6 rounded-2xl shadow-lg flex items-center flex-col md:flex-row gap-4 h-full"
      >
        <img src="/images/Calendar.jpg" alt="Planification" class="w-1/3" />
        <div>
          <h3 class="text-xl font-bold mb-2">Planifiez votre programme idéal</h3>
          <p>
            Planifiez et postez en avance. Gagnez du temps et optimisez l’engagement avec une
            diffusion au moment idéal.
          </p>
        </div>
      </div>

      <!-- Bloc 4 -->
      <div
        class="col-span-12 row-span-3 row-start-7 bg-white p-6 rounded-2xl shadow-lg items-center flex flex-col md:flex-row gap-4 h-full"
      >
        <img
          src="/images/Analytics.jpg"
          alt="Analyse de performance"
          class="w-1/4"
        />
        <div>
          <h3 class="text-xl font-bold mb-2">Mesurez, apprenez, développez</h3>
          <p>
            MonFeed étudie vos données et vous indique quand, quoi et à quelle fréquence publier
            pour maximiser vos résultats.
          </p>
        </div>
      </div>

      <!-- Bloc 5 -->
      <div
        class="col-span-6 row-span-3 row-start-10 bg-white p-6 rounded-2xl shadow-lg text-center flex flex-col items-center h-full"
      >
        <img src="/images/Response.jpg" alt="Réponses intelligentes" class="w-1/2 mb-4" />
        <h3 class="text-xl font-bold mb-2">Des réponses adaptées et rapides</h3>
        <p>
          D’un clic, choisissez le ton et reformulez grâce à l’IA pour offrir la meilleure réponse
          en tenant compte du ressenti de votre client.
        </p>
      </div>

      <!-- Bloc 6 -->
      <div
        class="col-span-6 row-span-3 col-start-7 row-start-10 bg-white p-6 rounded-2xl shadow-lg text-center flex flex-col items-center h-full"
      >
        <img src="/images/Moderation.jpg" alt="Réponses enregistrées" class="w-1/2 mb-4" />
        <h3 class="text-xl font-bold mb-2">Réduisez de moitié le temps de réponse</h3>
        <p>
          Sauvegardez des réponses toutes prêtes pour une utilisation future, répondez plus vite et
          plus efficacement.
        </p>
      </div>
    </div>
  </main>
</template>
