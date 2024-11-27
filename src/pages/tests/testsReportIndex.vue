<template>
  <section class="viewPages">
    <div class="row q-pa-md">
      <q-card class="ase-roboto q-pa-md col-12">
        <q-card-section class="flex items-center">
          <q-avatar size="xl" round v-if="testsStore.testReportDetails.name" class="bg-primary q-mr-sm text-white text-capitalize">
            {{ testsStore.testReportDetails.name[0] }}
          </q-avatar>
          <div>
            <div class="text-h6 ellipsis text-capitalize" v-if="testsStore.testReportDetails.name">
              {{ testsStore.testReportDetails.name }}
            </div>
            Assigned challenges: {{ testsStore.testReportInfo.length }}
            <q-badge>{{ testsStore.testReportDetails.test_type }}</q-badge>
          </div>
        </q-card-section>
        <q-card-section>
          {{ testsStore.testReportDetails.description }}
        </q-card-section>
      </q-card>
      <div class="col-12">
        <div class="q-my-md row">
          <div class="col-xs-12 col-sm-4 q-pr-sm">
            <StatisticItem title="Total Challenges" :count="testsStore.testReportDetails.challenges_count || 0" />
          </div>
          <div class="col-xs-12 col-sm-4 q-px-sm">
            <StatisticItem title="Users" :count="testsStore.testReportDetails.users ? testsStore.testReportDetails.users.length : 0" />
          </div>
          <div class="col-xs-12 col-sm-4 q-pl-sm">
            <StatisticItem title="Teams" :count="testsStore.testReportDetails.teams ? testsStore.testReportDetails.teams.length : 0" />
          </div>
        </div>
      </div>
      <div class="col-12">
        <BaseTable
          class="sticky-column-table"
          :columns="columns"
          :rows="testsStore.testReportInfo.info"
          row-key="email"
          :rows-per-page-options="[0]"
        />
      </div>
    </div>
  </section>
</template>

<script>
import StatisticItem from 'components/dashboard/StatisticItem.vue'
import { QSpinnerFacebook } from 'quasar'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'

import { useTestsStore } from 'src/store/pinia/tests'

export default {
  name: 'CompanyTestReportUSer',
  components: { StatisticItem },
  setup() {
    const testsStore = useTestsStore()
    return {
      testsStore
    }
  },
  data() {
    return {
      columns: [
        { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
        { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
        { name: 'score', label: 'Score', field: 'score', align: 'left', sortable: true },
        { name: 'total_score', label: 'Total Score', field: 'total_score', align: 'left', sortable: true },
        { name: 'attempted', label: 'Attempted', field: 'attempted', align: 'left', sortable: true }
      ],
      testName: urlSafeBase64Decode(this.$route.params.testName),
      testId: urlSafeBase64Decode(this.$route.params.testId)
    }
  },
  async created() {
    await this.testsStore.fetchTestReportDetails({ test: this.testId })
    await this.testsStore.fetchTestReportInfo({ test: this.testId })
  },
  watch: {
    'testsStore.isLoading': {
      handler() {
        if (this.testsStore.isLoading) {
          this.$q.loading.show({
            spinner: QSpinnerFacebook,
            spinnerColor: 'white',
            spinnerSize: 140,
            message: 'Hang on...',
            messageColor: 'white'
          })
        } else {
          this.$q.loading.hide()
        }
      }
    }
  }
}
</script>

<style lang="sass">
.sticky-column-table
  thead tr th, td:first-child
    background-color: white
    font-family: 'Arial'
    font-weight: bold

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>
