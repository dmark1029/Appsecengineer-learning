<template>
  <div>
    <div class="text-subtitle1 text-weight-medium ase-roboto ase-black-shade q-my-md">Learning path Reports</div>
    <BarGraph
      :categories="learningPaths.labels ?? []"
      :data="learningPaths?.data ?? []"
      class="col-12"
      :horizontal="false"
      :defaultYTitle="true"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useReportsStore } from 'src/store/pinia/reports/reports'
import BarGraph from 'src/components/charts/BarGraph.vue'

const reportsStore = useReportsStore()
const loading = ref(false)

const combinedReports = ref([])

onMounted(async () => {
  loading.value = true
  await reportsStore.fetchLearningPath()
  await reportsStore.fetchLearningCompletePath()

  const completedCourses = reportsStore.learningPathCompleted

  const enrolledCourses = reportsStore.learningPathReports

  const combinedArray = []

  for (const completedCourse of completedCourses) {
    const matchingEnrolledCourse = enrolledCourses.find((enrolledCourse) => enrolledCourse.learning_path === completedCourse.lp)

    combinedArray.push({
      name: completedCourse.learning_path_name || 'No Course',
      completed: completedCourse.completed_count || '',
      enrollment: matchingEnrolledCourse ? matchingEnrolledCourse.enroll_count || '' : ''
    })
  }

  for (const enrolledCourse of enrolledCourses) {
    const matchingCompletedCourse = completedCourses.find((completedCourse) => completedCourse.lp === enrolledCourse.learning_path)

    if (!matchingCompletedCourse) {
      combinedArray.push({
        name: enrolledCourse.learning_path_name || 'No Course',
        completed: '',
        enrollment: enrolledCourse.enroll_count || ''
      })
    }
  }

  combinedReports.value = combinedArray ?? []
  loading.value = false
})

const learningPaths = computed(() => {
  return {
    labels: combinedReports.value.map((ele) => ele.name),
    data: [
      {
        name: 'Completed',
        group: 'completed',
        data: combinedReports.value.map((ele) => ele.completed ?? 0)
      },
      {
        name: 'Enrolled',
        group: 'enrollment',
        data: combinedReports.value.map((ele) => ele.enrollment ?? 0)
      }
    ]
  }
})
</script>
