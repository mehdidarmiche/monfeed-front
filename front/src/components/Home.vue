<script setup>
defineOptions({
  name: 'HomePage'
})

import { Check, Facebook, Twitter, Instagram, Linkedin, Moon, Sun } from 'lucide-vue-next'
import { ref, onMounted, watch } from 'vue'

const isDark = ref(false)

onMounted(() => {
  // Appliquer la préférence sauvegardée
  const saved = localStorage.getItem('theme')
  isDark.value = saved === 'dark'

  document.documentElement.classList.toggle('dark', isDark.value)
})

watch(isDark, (val) => {
  document.documentElement.classList.toggle('dark', val)
  localStorage.setItem('theme', val ? 'dark' : 'light')
})

const open = ref(null)
const toggle = (index) => {
  open.value = open.value === index ? null : index
}

const faqs = [
  {
    question: 'Pourquoi planifier vos publications sur les réseaux sociaux ?',
    answer:
      'Planifier vos posts, c’est vous faire du bien. Voyez cela comme un geste pour vous-même. Un outil de planification fiable vous libère de votre téléphone ou ordinateur, vous offrant plus de temps pour faire ce que vous voulez.'
  },
  {
    question: "Quels réseaux sociaux sont pris en charge par l'outil de publication ?",
    answer:
      'Avec l’outil de publication de MonFeed, planifiez, programmez et publiez vos contenus (publication, carousel, stories et reels) pour Instagram et Facebook depuis un tableau de bord unique et simple.'
  },
  {
    question: 'Combien de temps les messages restent-ils dans la boîte de réception ?',
    answer:
      'En général, les conversations restent dans votre boîte de réception pendant six semaines.'
  },
  {
    question: "Avec quelles plateformes l'outil d'engagement est-il compatible ?",
    answer:
      'Avec l’outil d’engagement, répondez aisément et rapidement aux commentaires sur les Pages Facebook et les comptes professionnels Instagram.'
  },
  {
    question: "Qu'est-ce que l'analytique des médias sociaux ?",
    answer:
      'Nous définissons l’analytique des médias sociaux comme la démarche de collecte et d’analyse des données issues des réseaux sociaux, dans le but d’orienter notre stratégie marketing et d’évaluer notre performance par rapport à nos objectifs sur ces plateformes.'
  },
  {
    question: 'À quelle fréquence MonFeed met-il à jour ses analyses ?',
    answer:
      'MonFeed extrait des données des réseaux natifs, qui ne sont actualisés que périodiquement. Les métriques de Facebook proviennent de Facebook Insights, mis à jour une fois par jour. Instagram met à jour ses métriques tous les 48 heures.'
  }
]
</script>

<template>
  <div class="dark:bg-dark-bg">
    <header class="flex items-center justify-between mx-14 pt-8">
      <h1
        class="text-4xl font-bold leading-tight uppercase bg-gradient-to-r from-primary via-purple-500 to-secondary text-transparent bg-clip-text w-fit"
      >
        MONFEED
      </h1>
      <div class="flex items-center">
        <a
          class="dark:bg-white py-2 px-4 mx-2 rounded-full shadow-xl cursor-pointer font-bold border text-primary"
          href="/register"
          >S'inscrire</a
        >
        <a
          class="dark:bg-white py-2 px-4 mx-2 rounded-full shadow-xl cursor-pointer border font-bold text-secondary"
          href="/login"
        >
          Connexion</a
        >
        <button
          @click="isDark = !isDark"
          class="p-2 rounded-full border mx-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow transition duration-300 hover:scale-105"
          aria-label="Toggle dark mode"
        >
          <component :is="isDark ? Moon : Sun" class="w-5 h-5" />
        </button>
      </div>
    </header>
    <main>
      <div class="hero-header dark:text-white flex items-center justify-between mt-24 mx-14">
        <div class="hero-text w-1/2">
          <h2 class="text-4xl font-bold">
            Dominez les réseaux sociaux <br />Maximisez votre impact avec l'IA.
          </h2>
          <p class="mt-4 text-lg w-5/12">
            Créez, planifiez, publiez et gérez aisément votre présence sur les réseaux sociaux.
            Grâce à monfeed.com propulsée par l’IA.
          </p>
          <a
            href="#projects"
            class="mt-8 w-fit flex px-6 py-3 font-bold bg-purple-600 text-white rounded"
          >
            Essayer gratuitement
          </a>
          <div class="mt-3 flex w-fit">
            <span class="text-center mx-2 flex"> <Check class="mx-1" />Aucune carte requise</span>
            <span class="text-center mx-2 flex">
              <Check class="mx-1" />Annulable à tout moment</span
            >
          </div>
        </div>
        <div class="hero-image w-5/12">
          <img src="/images/hero-monfeed.png" alt="" />
        </div>
      </div>
      <section
        class="py-8 px-6 mx-auto w-10/12 my-16 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 text-white text-center rounded-3xl shadow-inner"
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

      <div class="grid grid-cols-12 grid-rows-12 gap-4 mx-auto w-10/12 mb-12 text-gray-800">
        <!-- Bloc 1 -->
        <div
          class="col-span-7 bg-white row-span-3 p-6 rounded-2xl shadow-lg flex items-center flex-col md:flex-row gap-4 h-full"
        >
          <img src="/images/Caption.jpg" alt="Génération de contenu" class="w-1/3" />
          <div>
            <h3 class="text-xl font-bold mb-2">Générez des contenus en un clic</h3>
            <p>
              MonFeed met la puissance de l’intelligence artificielle au service de votre
              créativité. Vous avez une idée ? L’IA la transforme instantanément en post percutant,
              rédige des légendes engageantes, propose des variantes et traduit automatiquement
              votre contenu si besoin. Créez mieux, plus vite — sans jamais manquer d’inspiration.
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
            Grâce à son analyse de sentiment basée sur l’IA, MonFeed détecte automatiquement
            l’émotion derrière chaque commentaire reçu. Qu’il s’agisse d’enthousiasme, de
            frustration ou de doute, vous comprenez instantanément le ressenti de votre communauté
            et adaptez vos réponses avec justesse. C’est plus qu’une réponse : c’est une relation
            humaine amplifiée par la technologie.
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
              MonFeed vous permet de planifier vos publications à l’avance pour garder une présence
              constante, même quand vous n’êtes pas connecté. En quelques clics, vous préparez votre
              contenu, et la plateforme se charge de le diffuser au moment le plus opportun pour
              maximiser l’engagement. Vous restez maître de votre stratégie, tout en libérant un
              temps précieux.
            </p>
          </div>
        </div>

        <!-- Bloc 4 -->
        <div
          class="col-span-12 row-span-3 row-start-7 bg-white p-6 rounded-2xl shadow-lg items-center flex flex-col md:flex-row gap-4 h-full"
        >
          <img src="/images/Analytics.jpg" alt="Analyse de performance" class="w-1/4" />
          <div>
            <h3 class="text-xl font-bold mb-2">Mesurez, apprenez, développez</h3>
            <p>
              MonFeed s’appuie sur l’intelligence artificielle pour analyser en profondeur vos
              performances sociales et vous offrir des recommandations sur-mesure. Plus besoin de
              deviner ce qui fonctionne : la plateforme vous guide vers les meilleurs créneaux de
              publication, identifie les types de contenus les plus engageants, et vous aide à
              trouver le bon rythme pour capter l’attention sans lasser votre audience. L’objectif ?
              <span class="font-semibold text-secondary"
                >Vous faire gagner en visibilité, en efficacité et en résultats.</span
              >
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
            MonFeed vous aide à répondre avec justesse, en un seul clic. Choisissez le ton,
            reformulez automatiquement vos messages, et laissez l’IA adapter votre réponse en
            fonction du ressenti du client. Vous gagnez en pertinence, sans perdre de temps.
          </p>
        </div>

        <!-- Bloc 6 -->
        <div
          class="col-span-6 row-span-3 col-start-7 row-start-10 bg-white p-6 rounded-2xl shadow-lg text-center flex flex-col items-center h-full"
        >
          <img src="/images/Moderation.jpg" alt="Réponses enregistrées" class="w-1/2 mb-4" />
          <h3 class="text-xl font-bold mb-2">Réduisez de moitié le temps de réponse</h3>
          <p>
            Avec les réponses enregistrées, vous n’avez plus besoin de tout réécrire. Enregistrez
            vos messages types, personnalisez-les à la volée, et gérez vos interactions à la vitesse
            de l’éclair. Votre temps est précieux, vos réponses aussi.
          </p>
        </div>
      </div>
      <section class="bg-white text-gray-900 dark:bg-dark-bg dark:text-white py-20 px-6" id="faq">
        <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 class="text-4xl font-bold mb-2">Foire aux questions</h2>
            <div
              class="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-4"
            ></div>
          </div>

          <div class="space-y-4">
            <div
              v-for="(faq, index) in faqs"
              :key="index"
              @click="toggle(index)"
              class="cursor-pointer rounded-xl border-l-4 border-secondary bg-gray-50 hover:bg-gray-100 transition px-6 py-5 dark:bg-gray-800"
            >
              <div class="flex justify-between items-center">
                <h3 class="font-semibold text-lg text-left">{{ faq.question }}</h3>
                <span class="text-primary font-bold text-xl">
                  {{ open === index ? '−' : '+' }}
                </span>
              </div>
              <p
                v-if="open === index"
                class="mt-4 text-gray-600 dark:text-white transition-all text-left"
              >
                {{ faq.answer }}
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer class="bg-gray-100 dark:bg-gray-700 py-12 mt-24 text-gray-700 dark:text-white">
        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-14">
          <!-- Bloc 1 : Logo + description -->
          <div>
            <h3
              class="text-2xl font-bold uppercase bg-gradient-to-r from-primary via-purple-500 to-secondary text-transparent bg-clip-text w-fit"
            >
              MonFeed
            </h3>
            <p class="mt-4 text-sm leading-relaxed">
              MonFeed est une plateforme tout-en-un propulsée par l’IA pour créer, planifier,
              publier et analyser vos contenus sur les réseaux sociaux. Gagnez du temps, boostez
              votre présence, et restez focus sur l’essentiel.
            </p>
          </div>

          <!-- Bloc 2 : Liens -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Navigation</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#about" class="hover:underline">À propos</a></li>
              <li><a href="#services" class="hover:underline">Fonctionnalités</a></li>
              <li><a href="#faq" class="hover:underline">FAQ</a></li>
              <li><a href="#Dashboard" class="hover:underline">Tableau de bord</a></li>
            </ul>
          </div>

          <!-- Bloc 3 : Coordonnées + réseaux -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Contact</h4>
            <p class="text-sm">📍 Casablanca, Maroc</p>
            <p class="text-sm mt-1">📧 contact@monfeed.com</p>
            <p class="text-sm mt-1">📞 +212 644-499589</p>

            <div class="flex space-x-4 mt-4">
              <a href="#" aria-label="Facebook">
                <Facebook class="w-5 h-5 hover:text-blue-600 transition" />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter class="w-5 h-5 hover:text-sky-500 transition" />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram class="w-5 h-5 hover:text-pink-500 transition" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin class="w-5 h-5 hover:text-blue-700 transition" />
              </a>
            </div>
          </div>
        </div>

        <div class="mt-12 border-t pt-6 text-center text-sm text-gray-500">
          © 2025 MonFeed. Tous droits réservés.
        </div>
      </footer>
    </main>
  </div>
</template>
