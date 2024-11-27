<template>
  <BaseCard class="q-py-xs" flat>
    <q-card-section
      v-for="(stat, index) in dashboardStore.dashboardStats"
      :key="index"
      class="stats q-ma-md q-py-sm q-px-lg"
      :class="{ active: index === 0 }"
    >
      <div class="text-left">
        <div class="text-subtitle1">{{ stat.count }}</div>
        <div class="text-subtitle1">{{ stat.title }}</div>
      </div>
    </q-card-section>
  </BaseCard>
</template>

<script setup>
import { useDashboardStore } from 'src/store/pinia/dashboard'

const dashboardStore = useDashboardStore()

bootStatistics()

async function bootStatistics() {
  if (dashboardStore.dashboardStatistics.length) return
  await dashboardStore.fetchDashboardStatistics({})
}
</script>
