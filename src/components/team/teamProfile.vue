<template>
  <div>
    <div class="row">
      <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
        {{team}}
        <q-card
          class="my-card"
          style="cursor: pointer"
        >
          <HeatMap
            @individualDateStats="individualDateStats"
            :idOfHeatMap="'TeamProfileUserActivityActivityHeatMap'"
            :heatmap_data_values_list="heatData"
            :heatmap_data="analyticsStore.allDateUserProgressStats.data"
            :heatmap_max="10"
            :heatmap_min="1"
            :heatmap_colors="analyticsStore.allDateUserProgressStats.gitColorsUpdated"
            :heatmap_name="analyticsStore.allDateUserProgressStats.name"
            :title="'Team Activity'"
            :individualInformation="analyticsStore.allIndividualDateUserProgressStats"
            :individualDetailedInformation="analyticsStore.allIndividualDateUserDetailedProgressStats"
            @deepInformationOfCourse="deepInformationOfCourse"
          ></HeatMap>
        </q-card>
      </div>
    </div>
  </div>
</template>
<script>
import HeatMap from 'components/echarts-latest/heat-map.vue'
import * as echarts from 'echarts'
import { QSpinnerFacebook } from 'quasar'
import { useAnalyticsStatsStore } from 'src/store/pinia/analyticsStats'
export default {
  name: 'TeamProfileUserActivity',
  components: {
    HeatMap: HeatMap
  },
  created () { },
  setup () {
    const analyticsStore = useAnalyticsStatsStore()
    return {
      analyticsStore
    }
  },
  data () {
    return {
      heatData: []
    }
  },
  mounted () {
    this.getVirtulData(new Date().getFullYear())
  },
  watch: {
    'analyticsStore.isLoading': {
      handler () {
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
  methods: {
    individualDateStats (event) {
      const data = {
        date: event.date
      }
      this.analyticsStore.fetchAllDateUserProgressStatsByDate(data)
    },
    deepInformationOfCourse (event) {
      const data = {
        date: event.date,
        event_id: event.event_id
      }
      this.analyticsStore.fetchAllDateUserDetailedProgressStatsByDate(data)
    },
    getVirtulData (year) {
      year = year || '2017'
      const date = +echarts.number.parseDate(year + '-01-01')
      const end = +echarts.number.parseDate(year + '-02-26')
      const dayTime = 3600 * 24 * 1000
      const data = []
      for (let time = date; time < end; time += dayTime) {
        data.push([echarts.format.formatTime('yyyy-MM-dd', time), Math.floor(Math.random() * 10)])
      }
      this.heatData = data
    }
  },
}
</script>
