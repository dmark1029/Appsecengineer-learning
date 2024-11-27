<template>
  <div>
    <!-- <div class="text-subtitle1 text-weight-medium ase-roboto ase-black-shade">Proficiency</div> -->
    <div class="text-subtitle1 text-weight-medium ase-roboto ase-black-shade q-my-md">Proficiency Reports</div>

    <div class="row q-col-gutter-md">
      <div class="col-6" v-for="item in reportsStore.proficiencyReports" :key="item.type">
        <BarGraph
          :categories="getGraphLabels(item.courses)?.labels ?? []"
          :data="getGraphLabels(item.courses)?.data ?? []"
          yTooltipTitle="Enrollments"
          :defaultSeries="true"
          :title="`${item.type} - ${item.total_enroll_count} enrollments`"
          :fixedHeight="false"
        />
      </div>
    </div>
    <q-inner-loading :showing="loading" label="Loading Leaderboard Stats ..." label-class="text-teal" label-style="font-size: 1.1em" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useReportsStore } from 'src/store/pinia/reports/reports'
import BarGraph from 'src/components/charts/BarGraph.vue'
import PieGraph from '../charts/PieGraph.vue'
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
  await reportsStore.fetchProficiencyReports()
  loading.value = false
})

const profiencyReports = computed(() => {
  return reportsStore.proficiencyReports.flatMap((category) =>
    category.courses.map((course) => ({
      type: category.type,
      total_enroll_count: category.total_enroll_count,
      event_name: course.event_name,
      enroll_count: course.enroll_count
    }))
  )
})

const getGraphLabels = (items) => {
  return {
    labels: items.map((item) => item.event_name),
    data: [
      {
        data: items.map((item) => item.enroll_count)
      }
    ]
  }
}
</script>

<style lang="sass">
.reports
  /* height or max-height is important */
  max-height: 400px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: $primary

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
