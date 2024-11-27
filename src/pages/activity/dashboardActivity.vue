<template>
  <HeatMap
    @individualDateStats="individualDateStats"
    :idOfHeatMap="idVal ? idVal : 'IndividualUserActivityHeatMap'"
    :heatmap_data_values_list="userStatsActivity.values_list"
    :heatmap_data="userStatsActivity.data"
    :heatmap_max="userStatsActivity.max"
    :heatmap_min="userStatsActivity.min"
    :heatmap_colors="userStatsActivity.gitColorsUpdated"
    :heatmap_name="userStatsActivity.name"
    :title="userStatsActivity.title"
    :individualInformation="analyticsStore.allIndividualDateUserProgressStats"
    :individualDetailedInformation="analyticsStore.allIndividualDateUserDetailedProgressStats"
    @deepInformationOfCourse="deepInformationOfCourse"
    :datesRange="datesRange"
  >
    <template v-slot:heatMapSlot>
      <slot name="dashboardSlot"></slot>
    </template>
  </HeatMap>
</template>

<script>
import HeatMap from 'components/echarts-latest/heat-map.vue'
import { QSpinnerFacebook } from 'quasar'
import { useDashboardStore } from 'src/store/pinia/dashboard'
import { computed } from 'vue'
import { useAnalyticsStatsStore } from 'src/store/pinia/analyticsStats'
export default {
  components: { HeatMap },
  props: ['idVal', 'datesRange'],
  watch: {
    'analyticsActivity.isLoading': {
      handler () {
        if (this.analyticsActivity.isLoading) {
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
  methods: {
    individualDateStats (event) {
      this.analyticsStore.fetchAllDateUserProgressStatsByDate({ date: event.date })
    },
    deepInformationOfCourse (event) {
      this.analyticsStore.fetchAllDateUserDetailedProgressStatsByDate({ date: event.date, event_id: event.event_id })
    }
  },
  setup () {
    const dashboardStore = useDashboardStore()
    const userStatsActivity = computed(() => {
      return dashboardStore.userStatsActivity
    })
    const analyticsStore = useAnalyticsStatsStore()
    return {
      dashboardStore,
      userStatsActivity,
      analyticsStore
    }
  }
}
</script>
