<template>
  <section class="bg-blue-grey-1 q-mt-xl q-mb-lg q-pa-lg row">
    <div v-for="statistic in userStatistic" class="col-3" :key="statistic.id">
      <div class="q-ma-md q-pa-md statistic">
        <div class="text-subtitle1">{{ overview[statistic.name] ?? statistic.value }}</div>
        <div class="text-subtitle2">{{ statistic.label }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  overview: { type: Object, required: true, default: () => {} }
})

const userStatistic = ref([
  { id: 1, name: 'percentile', label: 'Leaderboard Position' },
  { id: 2, name: 'num_of_labs_done', label: 'Labs Completed', value: '0' },
  { id: 3, name: 'num_of_challenges_solved', label: 'Challenges Solved', value: '' },
  { id: 4, name: 'num_of_badges', label: 'Badges Earned', value: '0' }
])
</script>

<style scoped lang="scss">
.statistic {
  background: white;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #4173d0;
    color: white;
  }
}
</style>
