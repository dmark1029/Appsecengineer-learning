<template>
  <HeatMap
    @individualDateStats="individualDateStats"
    :idOfHeatMap="idVal ? idVal : 'IndividualUserActivityHeatMap'"
    :heatmap_data_values_list="macroMetaStore.userStatsActivity.values_list"
    :heatmap_data="macroMetaStore.userStatsActivity.data"
    :heatmap_max="macroMetaStore.userStatsActivity.max"
    :heatmap_min="macroMetaStore.userStatsActivity.min"
    :heatmap_colors="macroMetaStore.userStatsActivity.gitColorsUpdated"
    :heatmap_name="macroMetaStore.userStatsActivity.name"
    :title="macroMetaStore.userStatsActivity.title"
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
import { useAnalyticsStatsStore } from 'src/store/pinia/analyticsStats'
import { useMacroMetaStore } from 'src/store/pinia/macroMeta'

export default {
  components: { HeatMap },
  props: ['idVal', 'datesRange'],
  setup() {
    const analyticsStore = useAnalyticsStatsStore()
    const macroMetaStore = useMacroMetaStore()
    return {
      analyticsStore,
      macroMetaStore
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
    },
    'macroMetaStore.isLoading': {
      handler() {
        if (this.macroMetaStore.isLoading) {
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
  async created() {
    await this.macroMetaStore.fetchUserReportStats({})
  },
  methods: {
    individualDateStats(event) {
      this.analyticsStore.fetchAllDateUserProgressStatsByDate({ date: event.date })
    },
    deepInformationOfCourse(event) {
      this.analyticsStore.fetchAllDateUserDetailedProgressStatsByDate({
        date: event.date,
        event_id: event.event_id
      })
    }
  }
}
</script>
