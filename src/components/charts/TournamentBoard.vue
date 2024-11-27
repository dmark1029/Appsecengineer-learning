<template>
  <div id="chart" class="full-width full-height">
    <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default defineComponent({
  components: {
    apexchart: VueApexCharts
  },
  props: {
    tournamentsData: {
      type: Array,
      required: true,
      default: () => []
    },
    categories: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          type: 'bar',
          height: 450,
          foreColor: this.$q.dark.isActive ? 'white' : undefined,
          stacked: true
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              total: {
                enabled: true,
                offsetX: 0,
                style: {
                  fontSize: '13px',
                  fontWeight: 900
                }
              }
            }
          }
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        title: {
          text: 'Tournament Leaderboard',
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: undefined,
            color: '#263238'
          }
        },
        xaxis: {
          categories: this.categories
          // labels: {
          //   formatter: function (val) {
          //     return val + 'K'
          //   }
          // }
        },
        yaxis: {
          title: {
            text: undefined
          }
        },
        tooltip: {
          y: {
            formatter: (val) => Number(val?.toFixed(2))
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: 'top',
          horizontalAlign: 'center',
          offsetX: 40
        }
      }
    },
    series() {
      return (
        this.tournamentsData.map((tournament) => ({
          name: tournament.name,
          data: tournament.data.map((e) => Number(e?.toFixed(2)))
        })) ?? []
      )
    }
  }
})
</script>
