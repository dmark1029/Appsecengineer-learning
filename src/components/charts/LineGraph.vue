<template>
  <div id="chart">
    <slot name="header"></slot>
    <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
    <slot name="footer"></slot>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default defineComponent({
  name: 'LineGraph',
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
    dataEnabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          foreColor: this.$q.dark.isActive ? 'white' : undefined,
          height: 350,
          foreColor: this.$q.dark.isActive ? 'white' : undefined,

          type: 'line',
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          toolbar: {
            show: false
          }
        },
        colors: ['#ff5e62', '#6600ff', '#00a4e8', '#ec008c', '#ff5e62', '#6600ff'],

        fill: {
          type: 'gradient',
          gradient: {
            type: this.horizontal ? 'horizontal' : 'vertical',
            gradientToColors: ['#ff9963', '#5451e1', '#00ffff', '#662d91', '#ff9963', '#5451e1'],
            stops: [0, 100]
          }
        },
        dataLabels: {
          enabled: this.dataEnabled
        },
        // stroke: {
        //   curve: 'smooth'
        // },
        title: {
          text: this.title,
          align: 'left'
        },
        // grid: {
        //   borderColor: '#e7e7e7',
        //   row: {
        //     colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        //     opacity: 0.5
        //   }
        // },
        markers: {
          size: 1
        },
        xaxis: {
          categories: this.categories
        },
        yaxis: {
          title: {
            text: this.yAxisTitle
          }
        }
      }
    },
    series() {
      return this.data.filter((ele) => {
        if (ele.data && ele.data.length) return true
      })
    }
  }
})
</script>
