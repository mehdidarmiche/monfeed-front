<script setup>
defineOptions({
  name: 'HomePage'
})
</script>

<template>
  <header class="flex justify-between mx-8 mt-8">
    <h1 class="text-3xl font-bold uppercase">Mon feed</h1>
    <nav class="flex items-center justify-between">
      <ul class="flex">
        <li class="mx-4"><a href="#about">About</a></li>
        <li class="mx-4"><a href="#services">Services</a></li>
        <li class="mx-4"><a href="#contact">Contact</a></li>
      </ul>
    </nav>
    <a href="#Dashboard"> tableau de bord</a>
  </header>
  <main>
    <div class="hero-header mt-24 mx-8">
      <h2 class="text-4xl text-center font-bold">
        Dominez les réseaux sociaux <br>Maximisez votre impact avec l'IA.
      </h2>
      <p class="mt-4 text-center text-lg">
        Créez, planifiez, publiez et gérez aisément votre présence sur les réseaux sociaux. Grâce à
        monfeed.com propulsée par l’IA
      </p>
      <a href="#projects" class="mt-8 mx-auto w-fit flex px-6 py-3 bg-blue-500 text-white rounded">
        Essayer gratuitement
      </a>
    </div>
  </main>
</template>
