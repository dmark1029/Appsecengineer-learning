<template>
  <div>
    <q-card class="my-card">
      <q-card-section>
        <p class="text-subtitle1 text-weight-bold ase-roboto">Activity</p>
        <q-separator />
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <q-card
              class="my-card"
              style="cursor: pointer; padding-bottom: 4%"
            >
              <HeatMap
                @individualDateStats="individualDateStats"
                :idOfHeatMap="'IndividualProfileUserActivityHeatMap'"
                :heatmap_data_values_list="analyticsStore.allDateUserProgressStats.values_list"
                :heatmap_data="analyticsStore.allDateUserProgressStats.data"
                :heatmap_max="analyticsStore.allDateUserProgressStats.max"
                :heatmap_min="analyticsStore.allDateUserProgressStats.min"
                :heatmap_colors="analyticsStore.allDateUserProgressStats.gitColorsUpdated"
                :heatmap_name="analyticsStore.allDateUserProgressStats.name"
                :title="analyticsStore.allDateUserProgressStats.title"
                :individualInformation="analyticsStore.allIndividualDateUserProgressStats"
                :individualDetailedInformation="analyticsStore.allIndividualDateUserDetailedProgressStats"
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
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import HeatMap from 'components/echarts-latest/heat-map.vue'
import { QSpinnerFacebook } from 'quasar'
import { currentYearOld, previousDates } from 'src/utils/reuseFunctions'
import { useLoginStore } from 'src/store/pinia/login'
import { computed } from 'vue'
import { useAnalyticsStatsStore } from 'src/store/pinia/analyticsStats'

export default {
  name: 'ProfileUserActivity',
  components: {
    HeatMap: HeatMap
  },
  created () {
    this.previousData()
    this.isStatus(true)
    const data = {
      payload: {
        user_id: this.fetchUserInfo.email
      }
    }
    this.analyticsStore.fetchAllUserDateProgressStats(data)
  },
  data () {
    return {
      dropdownOptions: [],
      dropdownValue: ''
    }
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
    previousData () {
      this.dropdownOptions = previousDates()
      this.dropdownValue = currentYearOld()
    },
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
    }
  },
  setup () {
    const loginStore = useLoginStore()
    const analyticsStore = useAnalyticsStatsStore()
    const fetchUserInfo = computed(() => {
      return loginStore.fetchUserInfo
    })


    return {
      loginStore,
      fetchUserInfo,
      analyticsStore,
    }
  }
}
</script>
