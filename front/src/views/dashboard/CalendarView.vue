<template>
  <DashboardLayout>
    <vue-cal locale="fr" view="month" :today-button="false" :views="['week', 'month']">
    </vue-cal>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { VueCal, useLocale } from 'vue-cal'
import '../../assets/CalendarView.scss'
import 'vue-cal/style'

import Translations from 'vue-cal/i18n/fr'
useLocale(Translations)
</script>
