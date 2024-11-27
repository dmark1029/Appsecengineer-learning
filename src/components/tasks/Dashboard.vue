<template>
  <BaseCard class="column q-pa-md br-4">
    <div class="row">
      <div class="col-6 q-pa-sm">
        <BaseComponentLoader :loading="testsStore.isLoading">
          <div class="col-6 q-pa-sm full-width">
            <TournamentBoard :tournamentsData="testsStore.testsUserStats.data.data" :categories="testsStore.testsUserStats.data.labels" />
          </div>
        </BaseComponentLoader>
      </div>
      <div class="col-md-6 col-sm-12 q-pa-sm">
        <div class="full-width full-height" style="min-height: 480px">
          <BaseComponentLoader :loading="testsStore.isLoading">
            <div class="full-width">
              <radarChart
                :radarAllocated="testsStore.testSkillsStats.allocated"
                :radarData="testsStore.testSkillsStats.data"
                :radarLabels="testsStore.testSkillsStats.dataLabels"
                :radarRanges="testsStore.testSkillsStats.dataRanges"
                :radarValues="testsStore.testSkillsStats.dataValues"
                title="Skills Chart"
              />
            </div>
          </BaseComponentLoader>
        </div>
      </div>
      <div class="col-md-6 col-sm-12 q-pa-sm">
        <div flat style="">
          <div class="text-subtitle1 q-my-md">Tournaments Detailed Report</div>

          <BaseTable
            :columns="columns"
            hide-header
            :rows="testsStore.testAssignmentsStats.c_info"
            :rows-per-page-options="[0]"
            @row-click="redirectToIndividualTest"
            hide-pagination
            :loading="testsStore.isLoading"
          >
            <template #body-cell-duration="props">
              <q-td class="row items-end justify-end">
                <q-badge class="text-caption" color="indigo-7" :label="`${props.row.duration} mins`" />
              </q-td>
            </template>
          </BaseTable>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'

import radarChart from 'components/echarts-latest/radarChart.vue'
import TournamentBoard from 'components/charts/TournamentBoard.vue'
import BaseComponentLoader from 'components/wrappers/BaseComponentLoader/index.vue'

import { useTestsStore } from 'src/store/pinia/tests'
import { defineComponent, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

defineComponent({
  name: 'DashboardCharts'
})

const props = defineProps({
  id: { type: Number, required: false },
  skills: { type: Array, required: false },
  title: { type: String, required: false }
})

const testsStore = useTestsStore()

const router = useRouter()

const columns = ref([
  {
    field: 'test_name',
    name: 'test_name',
    label: 'Test Name',
    align: 'left'
  },
  {
    field: 'duration',
    name: 'duration',
    label: '',
    align: 'right'
  }
])

onBeforeMount(() => {
  testsStore.fetchTopTestAssignments({})
  testsStore.fetchTopTestUsers({})
  testsStore.fetchTopTestSkills({})
})

async function redirectToIndividualTest(_, info) {
  await router.push(`/portal/company/test/${urlSafeBase64Encode(info.test_id)}/${urlSafeBase64Encode(info.test_name)}`)
}
</script>
