<template>
  <q-card class="q-pa-md my-card">
    <slot name="header">
      <div class="chart-header text-weight-bolder text-subtitle1">{{ title }}</div>
    </slot>
    <div id="chart">
      <apexchart type="radar" :options="chartOptions" :series="series"></apexchart>
    </div>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default defineComponent({
  name: 'BarGraph',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    categories: {
      type: Array,
      required: true,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    horizontal: {
      type: Boolean,
      default: true
    },
    xAxisTitle: {
      type: String,
      default: ''
    },
    yAxisTitle: {
      type: String,
      default: ''
    },
    yTooltipTitle: {
      type: String,
      default: ''
    },
    defaultSeries: {
      type: Boolean,
      default: false
    },
    customColors: {
      type: [Array, Boolean, Object],
      default: undefined
    },
    fixedHeight: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          foreColor: this.$q.dark.isActive ? 'white' : undefined,
          height: 500, // Adjust this value to increase the height of the chart
          width: 500,
          foreColor: this.$q.dark.isActive ? 'white' : undefined,
          type: 'radar',
          toolbar: {
            show: false
          },
          events: {
            dataPointMouseEnter: (event, chartContext, config) => {
              const seriesIndex = config.seriesIndex
              const dataPointIndex = config.dataPointIndex
              const skills = this.data[seriesIndex].skills[dataPointIndex]

              this.tooltipContent = skills.join(', ')
            },
            dataPointMouseLeave: () => {
              this.tooltipContent = ''
            }
          }
        },

        title: {
          text: ''
        },
        xaxis: {
          categories: this.categories
        },
        tooltip: {
          style: {
            fontSize: '12px',
            fontFamily: undefined,
            zIndex: 10000 // Adjust this value to increase the z-index of the tooltip
          },
          onDatasetHover: {
            highlightDataSeries: false
          },
          x: {
            show: true,
            format: 'dd MMM',
            formatter: undefined
          },
          y: {
            formatter: (value, { seriesIndex, dataPointIndex }) => {
              const skills = this.data[seriesIndex].skills[dataPointIndex]
              return `skills : ${skills.join(', ')}`
            },
            title: {
              formatter: (_) => {
                return this.yTooltipTitle || ''
              }
            },
            position: 'topRight'
          }
        },
        markers: {
          size: 8,
          hover: {
            size: 10
          }
        }
      }
    },
    series() {
      return this.data
    }
  }
})
</script>
