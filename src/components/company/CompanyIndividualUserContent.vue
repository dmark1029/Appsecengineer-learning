<template>
  <div>
    <HeatMap
      @individualDateStats="individualDateStats"
      :idOfHeatMap="idOfHeatMap"
      @reloadChartSelection="reloadChartSelection"
      :heatmap_data_values_list="analyticsStore.dateUserProgressStats.values_list"
      :heatmap_data="analyticsStore.dateUserProgressStats.data"
      :heatmap_max="analyticsStore.dateUserProgressStats.max"
      :heatmap_min="analyticsStore.dateUserProgressStats.min"
      :heatmap_colors="analyticsStore.dateUserProgressStats.gitColorsUpdated"
      :heatmap_name="analyticsStore.dateUserProgressStats.name"
      :title="analyticsStore.dateUserProgressStats.title"
      :individualInformation="analyticsStore.individualDateUserProgressStats"
      :individualDetailedInformation="analyticsStore.individualDateUserDetailedProgressStats"
      @deepInformationOfCourse="deepInformationOfCourse"
      :datesRange="dropdownValue?.value"
    >
      <template v-slot:heatMapSlot>
        <q-select
          filled
          v-model="dropdownValue"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="dropdownOptions"
          option-value="value"
          option-label="label"
          dense
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">No results</q-item-section>
            </q-item>
          </template>
        </q-select>
      </template>
    </HeatMap>
    <BaseTabs align="left" no-caps v-model="tab">
      <q-tab name="activeCourses">
        <p class="text-subtitle1 ase-roboto ase-black-shade none-spacing">Active Courses</p>
      </q-tab>
      <q-tab name="completedCourses">
        <p class="text-subtitle1 ase-roboto ase-black-shade none-spacing">Completed Courses</p>
      </q-tab>
    </BaseTabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="activeCourses">
        <BaseTable
          :columns="columns"
          row-key="email"
          :rows="companyUsersStore.userActiveCourses"
          :rows-per-page-options="[0]"
          virtual-scroll
          style="max-height: calc(400px)"
          hide-pagination
          customClasses="sticky-head"
        >
          <template #body-cell-serial_number="props">
            <q-td>
              {{ props.pageIndex + 1 }}
            </q-td>
          </template>
        </BaseTable>
      </q-tab-panel>

      <q-tab-panel name="completedCourses">
        <BaseTable
          :columns="columns"
          row-key="email"
          :rows="companyUsersStore.userCompletedCourses"
          :rows-per-page-options="[0]"
          hide-pagination
          customClasses="sticky-head"
          style="max-height: calc(400px)"
        >
          <template #body-cell-serial_number="props">
            <q-td>
              {{ props.pageIndex + 1 }}
            </q-td>
          </template>
        </BaseTable>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import HeatMap from 'components/echarts-latest/heat-map.vue'
import { QSpinnerFacebook } from 'quasar'
import { currentYearOld, previousDates, urlSafeBase64Decode } from 'src/utils/reuseFunctions'

import { useAnalyticsStatsStore } from 'src/store/pinia/analyticsStats'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'

export default {
  name: 'CompanyIndividualUserContent',
  components: {
    HeatMap: HeatMap
  },
  setup() {
    const analyticsStore = useAnalyticsStatsStore()
    const companyUsersStore = useCompanyConsumerStore()
    return {
      analyticsStore,
      companyUsersStore
    }
  },
  created() {
    this.previousData()
    this.analyticsStore.fetchUserDateProgressStats({ payload: { user_id: urlSafeBase64Decode(this.$route.params.email) } })
  },
  props: {
    idOfHeatMap: { type: String, required: false, default: 'IndividualCompanyUserActivityHeatMapNEW' }
  },
  data() {
    return {
      tab: 'activeCourses',
      dropdownOptions: [],
      dropdownValue: ''
    }
  },
  watch: {
    'analyticsStore.isLoading': {
      handler() {
        if (this.analyticsStore.isLoading) {
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
  },
  computed: {
    columns() {
      return [
        {
          name: 'serial_number',
          align: 'left',
          label: '#',
          field: 'serial_number'
        },
        {
          name: 'name',
          align: 'left',
          label: 'Name',
          field: 'name'
        }
      ]
    }
  },
  methods: {
    individualDateStats(event) {
      const data = {
        payload: {
          user_id: urlSafeBase64Decode(this.$route.params.email)
        },
        date: event.date
      }
      this.analyticsStore.fetchDateUserProgressStatsByDate(data)
    },
    previousData() {
      this.dropdownOptions = previousDates()
      this.dropdownValue = currentYearOld()
    },
    reloadChartSelection(event) {
      const data = {
        payload: {
          user_id: urlSafeBase64Decode(this.$route.params.email)
        }
      }
      this.analyticsStore.fetchUserDateProgressStats(data)
    },
    deepInformationOfCourse(event) {
      const data = {
        payload: {
          user_id: urlSafeBase64Decode(this.$route.params.email)
        },
        date: event.date,
        event_id: event.event_id
      }
      this.analyticsStore.fetchDateUserDetailedProgressStatsByDate(data)
    }
  }
}
</script>
