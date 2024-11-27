<template>
  <div>
    <!-- <div class="text-subtitle1 text-weight-medium ase-roboto ase-black-shade">Proficiency</div> -->
    <div class="text-subtitle1 text-weight-medium ase-roboto ase-black-shade q-my-md">Learning path Complete</div>
    <BarGraph :categories="learningPaths.labels ?? []" :data="learningPaths?.data ?? []" yTooltipTitle="Completed" class="col-12" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useReportsStore } from 'src/store/pinia/reports/reports'
import BarGraph from 'src/components/charts/BarGraph.vue'
const columns = [
  {
    name: 'event_name',
    field: 'event_name',
    label: 'Courses',
    align: 'left'
  },
  {
    name: 'enroll_count',
    field: 'enroll_count',
    label: 'Enroll count',
    align: 'left'
  }
]

const reportsStore = useReportsStore()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await reportsStore.fetchLearningCompletePath()
  loading.value = false
})

const learningPaths = computed(() => {
  return {
    labels: reportsStore.learningPathCompleted.map((item) => item?.learning_path_name ?? 'No Course'),
    data: [
      {
        data: reportsStore.learningPathCompleted.map((item) => item.completed_count)
      }
    ]
  }
})
</script>
