<template>
  <div flat class="q-pa-sm shadow-1" style="min-height: 480px">
    <p class="text-subtitle1 text-weight-medium ase-roboto ase-black-shade" style="padding-left: 0px">
      {{ title }}
    </p>

    <div>
      <div ref="radarChartTests" autoresize id="radarChartTests" style="width: 100%; height: 400px"></div>
    </div>
    <div style="width: 100%; height: 400px" class="text-center" v-if="!loadingIcon && radarData.length === 0">
      <p class="text-h4 text-weight-bold ase-roboto ase-black-light line-height-normal padding_12">No data</p>
    </div>
    <q-resize-observer @resize="onResize" />
  </div>
</template>
<style>
.chart_size_bar {
  top: 0;
  width: 100%;
  height: 400px;
}
</style>
<script>
import * as echarts from 'echarts'
export default {
  name: 'E-radarChartTests',
  props: {
    loadingIcon: { type: Boolean, default: true },
    radarAllocated: {},
    radarData: { required: true },
    radarLabels: { required: false },
    radarRanges: { required: false },
    radarValues: { required: false },
    title: { type: String, required: false }
  },
  components: {},
  data() {
    return {
      model: false,
      RadarChart: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          show: true,
          left: 'center',
          type: 'scroll',
          z: 2,
          orient: 'horizontal',
          right: 10,
          bottom: 5,
          textStyle: {
            color: '#242424',
            fontSize: 12
          }
        },
        color: ['#4FA0E1', '#58D8A5', '#FD665F', '#000000', '#CDCDCD'],
        radar: {
          indicator: this.radarAllocated
        },
        series: [
          {
            name: 'Skills',
            type: 'radar',
            data: [
              {
                value: this.radarValues,
                name: 'Skills got secured'
              },
              {
                value: this.radarRanges,
                name: 'Skills max ranges'
              }
            ],
            label: {
              normal: {
                show: false,
                position: 'right',
                formatter: function (param) {},
                textStyle: {
                  color: '#000',
                  fontSize: '12'
                }
              }
            }
          }
        ]
      },
      radar_chart: null
    }
  },
  watch: {
    radarData: {
      handler() {
        if (this.radarData.length > 0) {
          this.RadarChart = {
            xAxis: [
              {
                show: false
              }
            ],
            legend: {
              show: true,
              left: 'center',
              type: 'scroll',
              z: 2,
              orient: 'horizontal',
              right: 10,
              bottom: 5,
              textStyle: {
                color: '#242424',
                fontSize: 12
              }
            },
            color: ['#4FA0E1', '#58D8A5', '#FD665F', '#000000', '#CDCDCD'],
            radar: {
              indicator: this.radarAllocated
            },
            series: [
              {
                name: 'Skills',
                type: 'radar',
                data: [
                  {
                    value: this.radarValues,
                    name: 'Skills  secured',
                    label: {
                      show: true,
                      formatter: function (params) {
                        return params.value
                      }
                    }
                  },
                  {
                    value: this.radarRanges,
                    name: 'Skills  ranges',
                    label: {
                      show: true,
                      formatter: function (params) {
                        return params.value
                      }
                    }
                  }
                ],
                label: {
                  normal: {
                    show: false,
                    position: 'right',
                    formatter: function (param) {
                      return param.value + '%'
                    },
                    textStyle: {
                      color: '#000',
                      fontSize: '12'
                    }
                  }
                }
              }
            ]
          }
        }
        this.init()
      }
    }
  },
  methods: {
    SaveImage() {
      const linkSource = this.radar_chart.getDataURL()
      const downloadLink = document.createElement('a')
      document.body.appendChild(downloadLink)
      downloadLink.href = linkSource
      downloadLink.target = '_self'
      downloadLink.download = 'RadarChart.png'
      downloadLink.click()
    },
    init() {
      const radarChartTests = document.getElementById('radarChartTests')
      echarts.dispose(radarChartTests)
      const theme = this.model ? 'dark' : 'light'
      this.radar_chart = echarts.init(radarChartTests, theme)
      this.radar_chart.setOption(this.RadarChart)
    },
    toggleTheme() {
      if (this.model) {
        this.model = false
        this.init()
      } else {
        this.model = true
        this.init()
      }
    },
    onResize() {
      if (this.radar_chart) {
        this.radar_chart.resize()
      }
    }
  }
}
</script>

<style scoped></style>
