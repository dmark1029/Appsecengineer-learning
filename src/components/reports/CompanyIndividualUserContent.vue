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
      :datesRange="dateRange?.value"
    />
    <BaseTabs v-model="tab" align="left" no-caps>
      <q-tab name="activeCourses" label="Active Courses" />
      <q-tab name="completedCourses" label="Completed Courses" />
    </BaseTabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="activeCourses">
        <q-list
          v-for="(course, index) in companyUsersStore.userActiveCourses"
          :key="course.id + index + '' + course.name + 'activeCourses'"
        >
          <q-item clickable v-ripple>
            <q-item-section>{{ course.name }}</q-item-section>
          </q-item>
        </q-list>
        <template v-if="!companyUsersStore.isLoading && companyUsersStore.userActiveCourses.length === 0">
          <p class="text-center text-subtitle1">No data</p>
        </template>
      </q-tab-panel>
      <q-tab-panel name="completedCourses">
        <q-list
          v-for="(course, index) in companyUsersStore.userCompletedCourses"
          :key="course.id + index + '' + course.name + 'completedCourses'"
        >
          <q-item clickable v-ripple>
            <q-item-section>{{ course.name }}</q-item-section>
          </q-item>
        </q-list>
        <template v-if="!companyUsersStore.isLoading && companyUsersStore.userCompletedCourses.length === 0">
          <p class="text-center text-h4 text-weight-bold ase-roboto ase-black-light line-height-normal padding_12">No data</p>
        </template>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import HeatMap from 'components/echarts-latest/heat-map.vue'
import { QSpinnerFacebook } from 'quasar'
import { currentYearOld } from 'src/utils/reuseFunctions'
import { ref, onMounted } from 'vue'

import { useAnalyticsStatsStore } from 'src/store/pinia/analyticsStats'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'

export default {
  name: 'CompanyIndividualUserContent',
  components: { HeatMap },
  props: {
    idOfHeatMap: { type: String, required: true, default: 'IndividualCompanyUserActivityHeatMapNEW' },
    email: { type: String, required: true },
    username: { type: String, required: true }
  },
  setup() {
    const dateRange = ref('')
    const analyticsStore = useAnalyticsStatsStore()
    const companyUsersStore = useCompanyConsumerStore()

    onMounted(() => {
      dateRange.value = currentYearOld()
    })

    return { dateRange, analyticsStore, companyUsersStore }
  },
  data() {
    return {
      tab: 'activeCourses'
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
  created() {
    const data = {
      payload: { user_id: this.email }
    }
    this.analyticsStore.fetchUserDateProgressStats(data)
  },
  methods: {
    individualDateStats(event) {
      const data = {
        payload: { user_id: this.email },
        date: event.date
      }
      this.analyticsStore.fetchDateUserProgressStatsByDate(data)
    },
    reloadChartSelection(event) {
      const data = {
        payload: { user_id: this.email }
      }
      this.analyticsStore.fetchUserDateProgressStats(data)
    },
    deepInformationOfCourse(event) {
      const data = {
        payload: { user_id: this.email },
        date: event.date,
        event_id: event.event_id
      }
      this.analyticsStore.fetchDateUserDetailedProgressStatsByDate(data)
    }
  }
}
</script>
