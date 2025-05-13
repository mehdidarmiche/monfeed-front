<script setup>
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import EventModal from '@/components/items/CalendarModal.vue'
import { ref } from 'vue'
import { VueCal, useLocale } from 'vue-cal'
import '../../assets/CalendarView.scss'
import 'vue-cal/style'
import Translations from 'vue-cal/i18n/fr'

useLocale(Translations)

const events = ref([])
const showModal = ref(false)
const selectedDate = ref(null)

const newEvent = ref({
  title: '',
  startTime: '',
  endTime: ''
})

const onCellClick = ({ cursor }) => {
  const date = cursor?.date
  if (!(date instanceof Date)) return
  selectedDate.value = date.toISOString().split('T')[0]
  showModal.value = true
}

const addEvent = (eventData) => {
  const start = new Date(`${selectedDate.value}T${eventData.startTime}`)
  const end = new Date(`${selectedDate.value}T${eventData.endTime}`)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return

  events.value.push({
    title: eventData.title,
    start,
    end
  })

  newEvent.value = { title: '', startTime: '', endTime: '' }
  showModal.value = false
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
    />

    <EventModal :show="showModal" :event="newEvent" @submit="addEvent" @close="showModal = false" />
  </DashboardLayout>
</template>
