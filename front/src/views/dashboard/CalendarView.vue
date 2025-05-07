<template>
  <DashboardLayout>
    <vue-cal locale="fr" view="month" :views="['week', 'month']">
      <template #header="{ view, availableViews }">
        <div v-html="view.title" class="text-center"></div>
      </template>
    </vue-cal>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { VueCal, useLocale } from 'vue-cal'
import 'vue-cal/style'
import Translations from 'vue-cal/i18n/fr'

useLocale(Translations)
</script>
