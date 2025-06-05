<script setup>
import { ref, onMounted } from 'vue'
import { VueCal, useLocale } from 'vue-cal'
import 'vue-cal/style'
import Translations from 'vue-cal/i18n/fr'


useLocale(Translations)

const events = ref([])

const fetchEvents = async () => {
  const token = localStorage.getItem('jwt')
  if (!token) return

  try {
    const res = await fetch('http://localhost:1337/api/events?sort=start:asc', {
      headers: { Authorization: `Bearer ${token}` }
    })

    const json = await res.json()

    events.value = json.data.map((e) => ({
      id: e.id,
      title: e.title,
      start: new Date(e.start),
      end: new Date(e.end),
      description: e.description
    }))
  } catch (err) {
    console.error('Erreur récupération des événements :', err)
  }
}

onMounted(() => {
  fetchEvents()
})
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Planning à venir</h2>

    <vue-cal
      name="planning-mini"
      locale="fr"
      view="week"
      views="['days, day']"
      :time-from="8 * 60"
      :time-to="20 * 60"
      :events="events"
      :views-bar="false"
      :today-button="false"
      style="min-height: 400px;"
    />
  </div>
</template>
