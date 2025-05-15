<script setup>
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import EventModal from '@/components/items/CalendarModal.vue'
import EventDetailModal from '@/components/items/EventDetailModal.vue'
import { ref, onMounted } from 'vue'
import { VueCal, useLocale } from 'vue-cal'
import '../../assets/CalendarView.scss'
import 'vue-cal/style'
import Translations from 'vue-cal/i18n/fr'

useLocale(Translations)

const events = ref([])
const showModal = ref(false)
const showDetailModal = ref(false)
const selectedDate = ref(null)
const selectedEvent = ref(null)
const editingEventId = ref(null)

const newEvent = ref({
  title: '',
  startTime: '',
  endTime: '',
  description: ''
})

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

const addEvent = async (eventData) => {
  const selected = selectedDate.value
  const startTime = eventData.startTime
  const endTime = eventData.endTime

  if (!selected || !startTime || !endTime) return

  const start = new Date(`${selected}T${startTime}`)
  const end = new Date(`${selected}T${endTime}`)
  const token = localStorage.getItem('jwt')
  if (!token) return

  try {
    const body = {
      data: {
        title: eventData.title,
        start: start.toISOString(),
        end: end.toISOString(),
        description: eventData.description
      }
    }

    if (editingEventId.value) {
      const res = await fetch(`http://localhost:1337/api/events/${editingEventId.value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
      const result = await res.json()

      const index = events.value.findIndex((e) => e.id === editingEventId.value)
      if (index !== -1) {
        events.value[index] = {
          id: result.data.id,
          title: result.data.title,
          start: new Date(result.data.start),
          end: new Date(result.data.end),
          description: result.data.description
        }
      }
    } else {
      const res = await fetch('http://localhost:1337/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
      const result = await res.json()

      await fetchEvents()
      events.value.push({
        id: result.data.id,
        title: result.data.title,
        start: new Date(result.data.start),
        end: new Date(result.data.end),
        description: result.data.description
      })
    }
  } catch (err) {
    console.error('Erreur lors de l’enregistrement de l’événement :', err)
  }

  newEvent.value = { title: '', startTime: '', endTime: '' }
  editingEventId.value = null
  showModal.value = false
}

const onCellClick = ({ cursor }) => {
  const date = cursor?.date
  if (!(date instanceof Date)) return
  selectedDate.value = date.toISOString().split('T')[0]
  showModal.value = true
}

const onEventDblClick = (data) => {
  const evt = data.event
  selectedEvent.value = {
    ...evt,
    start: new Date(evt.start),
    end: new Date(evt.end),
    description: evt.description || ''
  }
  showDetailModal.value = true
}

const onDeleteEvent = async () => {
  const token = localStorage.getItem('jwt')
  const id = selectedEvent.value?.id
  if (!id || !token) return

  try {
    await fetch(`http://localhost:1337/api/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    events.value = events.value.filter((e) => e.id !== id)
    await fetchEvents()
    showDetailModal.value = false
  } catch (err) {
    console.error('Erreur lors de la suppression :', err)
  }
}

const onEditEvent = () => {
  const ev = selectedEvent.value
  newEvent.value = {
    title: ev.title,
    startTime: ev.start.toISOString().slice(11, 16),
    endTime: ev.end.toISOString().slice(11, 16),
    description: ev.description || ''
  }
  selectedDate.value = ev.start.toISOString().split('T')[0]
  editingEventId.value = ev.id
  showModal.value = true
  showDetailModal.value = false
}
</script>

<template>
  <DashboardLayout>
    <vue-cal
      name="mon-calendrier"
      locale="fr"
      view="month"
      :today-button="false"
      :views="['week', 'month']"
      :events="events"
      events-on-month-view
      @cell-click="onCellClick"
      @event-dblclick="onEventDblClick"
    />

    <EventModal
      :show="showModal"
      :event="newEvent"
      @submit="addEvent"
      @close="
        () => {
          showModal = false
          editingEventId = null
        }
      "
    />

    <!-- Modal détail -->
    <EventDetailModal
      :show="showDetailModal"
      :event="selectedEvent"
      @delete="onDeleteEvent"
      @edit="onEditEvent"
      @close="showDetailModal = false"
    />
  </DashboardLayout>
</template>
