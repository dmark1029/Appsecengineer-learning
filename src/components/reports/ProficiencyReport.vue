<template>
  <div>
    <div class="row q-col-gutter-md">
      <div class="col-6">
        <BarGraph
          :categories="getBaseReports?.labels ?? []"
          :data="getBaseReports?.data ?? []"
          yTooltipTitle="Enrollments"
          :title="`Proficiency Reports`"
          key="getBaseReports"
          @clickEvt="setClicksEvent"
        >
          <template #header>
            <div class="chart-header text-weight-bolder text-subtitle1">
              Proficiency

              <q-icon name="info">
                <q-tooltip
                  color="white"
                  anchor="center end"
                  class="bg-white q-pa-lg shadow-1 text-primary z-fab text-subtitle1"
                  max-width="20rem"
                  self="center start"
                >
                  Click on bar of proficiencyReports to see detailed information
                </q-tooltip>
              </q-icon>
            </div>
          </template>
        </BarGraph>
      </div>

      <div class="col-6" v-if="getGraphLabels.labels.length">
        <BarGraph
          :categories="getGraphLabels.labels ?? []"
          :data="getGraphLabels.data ?? []"
          yTooltipTitle="Enrollments"
          :defaultSeries="true"
          :title="`${getBaseReports.labels[selectedPlot]}  (${getBaseReports.data[0].data[selectedPlot]})`"
          :fixedHeight="false"
          v-if="chartChange"
        />
      </div>
    </div>
    <q-inner-loading :showing="loading" label="Loading Proficiency Reports ..." label-class="text-teal" label-style="font-size: 1.1em" />
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
const selectedPlot = ref(0)
const chartChange = ref(true)

onMounted(async () => {
  loading.value = true
  await reportsStore.fetchProficiencyReports()
  loading.value = false
})

const getBaseReports = computed(() => {
  return {
    labels: reportsStore.proficiencyReports.map((report) => report.type),
    data: [
      {
        data: reportsStore.proficiencyReports.map((report) => report.total_enroll_count)
      }
    ]
  }
})

const getGraphLabels = computed(() => {
  if (getBaseReports.value?.data[0].data.length) {
    return {
      labels: reportsStore.proficiencyReports[selectedPlot.value].courses.map((item) => item.event_name),
      data: [
        {
          data: reportsStore.proficiencyReports[selectedPlot.value].courses.map((item) => item.enroll_count)
        }
      ]
    }
  }

  return {
    labels: [],
    data: []
  }
})

function setClicksEvent({ event, chartContext, config }) {
  chartChange.value = false
  if (config.dataPointIndex >= 0) {
    setTimeout(() => {
      selectedPlot.value = config.dataPointIndex
      chartChange.value = true
    }, 0)
  } else {
    chartChange.value = true
  }
}
</script>
