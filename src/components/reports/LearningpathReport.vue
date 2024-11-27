<template>
  <div>
    <!-- <div class="text-subtitle1 text-weight-medium ase-roboto ase-black-shade">Proficiency</div> -->
    <div class="text-subtitle1 text-weight-medium ase-roboto ase-black-shade q-my-md">Learning path Enrollment</div>
    <BarGraph :categories="learningPaths.labels ?? []" :data="learningPaths?.data ?? []" yTooltipTitle="Enrollments" class="col-12" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useReportsStore } from 'src/store/pinia/reports/reports'
import BarGraph from 'src/components/charts/BarGraph.vue'

const reportsStore = useReportsStore()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await reportsStore.fetchLearningPath()
  loading.value = false
})

const learningPaths = computed(() => {
  return {
    labels: reportsStore.learningPathReports.map((item) => item?.learning_path_name ?? 'No Course'),
    data: [
      {
        data: reportsStore.learningPathReports.map((item) => item.enroll_count)
      }
    ]
  }
})
</script>
