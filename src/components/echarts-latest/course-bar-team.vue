<template>
  <div style="min-height: 480px">
    <q-card-section class="none-spacing">
      <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
          <p class="ase-roboto text-subtitle1" style="padding-left: 0px">
            {{ title }}
          </p>
        </div>
      </div>
      <div>
        <div ref="courseBarInfoTeam" autoresize id="courseBarInfoTeam" style="width: 100%; height: 400px"></div>
      </div>
      <div style="width: 100%; height: 400px" class="text-center" v-if="!loadingIcon && bar_chart_data.length === 0">
        <p class="ase-roboto text-h4 line-height-normal padding_12">No data</p>
      </div>
    </q-card-section>
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
  name: 'E-courseBarInfoTeamTeam',
  props: {
    bar_chart_categories: {
      type: Array,
      required: false
    },
    bar_chart_data: {
      type: Array,
      required: true
    },
    bar_chart_labels: {
      required: false
    },
    bar_chart_name: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: false
    },
    x_axis_name: {
      type: String,
      required: false
    },
    y_axis_name: {
      type: String,
      required: false
    },
    loadingIcon: {
      type: Boolean,
      default: true
    }
  },
  components: {},
  data() {
    return {
      model: false,
      BarChart: {
        grid: { containLabel: true, right: '15%', left: '5%' },
        tooltip: {
          trigger: 'item',
          showDelay: 40,
          transitionDuration: 1.2,
          textStyle: {
            fontSize: 12,
            lineHeight: 18
          }
        },
        xAxis: {
          type: 'value',
          inactiveColor: '#CDCDCF',
          axisLabel: {
            show: true,
            inside: false,
            fontSize: 10,
            borderColor: 'rgb(211,211,211)',
            color: '#242424'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              shadowBlur: 0.5
            }
          },
          textStyle: {
            fontStyle: 'normal',
            fontWeight: 'lighter',
            fontSize: 10
          },
          axisPointer: {
            show: false,
            type: 'shadow',
            lineStyle: {
              color: 'rgb(211,211,211)',
              type: 'dotted'
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgb(211,211,211)'
            }
          },
          name: this.x_axis_name,
          nameLocation: 'end'
        },
        colors: ['#65B581', '#FFCE34', '#FD665F', '#000000', '#CDCDCD'],
        yAxis: {
          type: 'category',
          data: this.bar_chart_categories,
          inverse: true,
          left: 'center',
          axisLabel: {
            show: true,
            inside: false,
            left: 'left',
            fontSize: 10,
            borderColor: '#FFFFFF',
            color: 'rgba(71, 31, 31, 1)',
            verticalAlign: 'bottom',
            borderWidth: 20,
            overflow: 'truncate',
            ellipsis: '...',
            lineOverflow: 'none',
            formatter: (params) => {
              if (params.length <= 25) {
                return params.substring(0, 25)
              } else {
                return params.substring(0, 25) + ' ... '
              }
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                shadowBlur: 0.5
              }
            },
            textStyle: {
              fontStyle: 'normal',
              fontWeight: 'lighter',
              fontSize: 10
            },
            axisPointer: {
              show: false,
              type: 'shadow',
              lineStyle: {
                color: '#ffffff',
                type: 'dotted'
              }
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgb(211,211,211)'
            }
          },
          name: this.y_axis_name,
          nameLocation: 'end'
        },
        series: [
          {
            type: 'bar',
            data: this.bar_chart_data
          }
        ]
      },
      bar_chart: null
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    bar_chart_data: {
      handler() {
        if (this.bar_chart_data.length > 0) {
          this.BarChart = {
            grid: { containLabel: true, right: '15%', left: '5%' },
            tooltip: {
              trigger: 'item',
              showDelay: 40,
              transitionDuration: 1.2,
              textStyle: {
                fontSize: 12,
                lineHeight: 18
              }
            },
            xAxis: {
              type: 'value',
              inactiveColor: '#CDCDCF',
              axisLabel: {
                show: true,
                inside: false,
                fontSize: 10,
                borderColor: 'rgb(211,211,211)',
                color: '#242424'
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  shadowBlur: 0.5
                }
              },
              textStyle: {
                fontStyle: 'normal',
                fontWeight: 'lighter',
                fontSize: 10
              },
              axisPointer: {
                show: false,
                type: 'shadow',
                lineStyle: {
                  color: 'rgb(211,211,211)',
                  type: 'dotted'
                }
              },
              axisLine: {
                lineStyle: {
                  color: 'rgb(211,211,211)'
                }
              },
              name: this.x_axis_name,
              nameLocation: 'end',
              color: 'rgba(71, 31, 31, 1)'
            },
            colors: ['#65B581', '#FFCE34', '#FD665F', '#000000', '#CDCDCD'],
            yAxis: {
              type: 'category',
              data: this.bar_chart_categories,
              inverse: true,
              left: 'center',
              axisLabel: {
                show: true,
                inside: false,
                left: 'left',
                fontSize: 10,
                borderColor: '#FFFFFF',
                color: 'rgba(71, 31, 31, 1)',
                verticalAlign: 'bottom',
                borderWidth: 20,
                overflow: 'truncate',
                ellipsis: '...',
                lineOverflow: 'none',
                formatter: (params) => {
                  if (params.length <= 25) {
                    return params.substring(0, 25)
                  } else {
                    return params.substring(0, 25) + ' ... '
                  }
                },
                splitLine: {
                  lineStyle: {
                    type: 'dashed',
                    shadowBlur: 0.5
                  }
                },
                textStyle: {
                  fontStyle: 'normal',
                  fontWeight: 'lighter',
                  fontSize: 10
                },
                axisPointer: {
                  show: false,
                  type: 'shadow',
                  lineStyle: {
                    color: '#ffffff',
                    type: 'dotted'
                  }
                }
              },
              axisLine: {
                lineStyle: {
                  color: 'rgb(211,211,211)'
                }
              },
              name: this.y_axis_name,
              nameLocation: 'end',
              color: 'rgba(71, 31, 31, 1)'
            },
            series: [
              {
                type: 'bar',
                data: this.bar_chart_data
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
      const linkSource = this.bar_chart.getDataURL()
      const downloadLink = document.createElement('a')
      document.body.appendChild(downloadLink)
      downloadLink.href = linkSource
      downloadLink.target = '_self'
      downloadLink.download = 'BarChart.png'
      downloadLink.click()
    },
    init() {
      const courseBarInfoTeam = document.getElementById('courseBarInfoTeam')
      echarts.dispose(courseBarInfoTeam)
      const theme = this.model ? 'dark' : 'light'
      this.bar_chart = echarts.init(courseBarInfoTeam, theme)
      this.bar_chart.setOption(this.BarChart)
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
      if (this.bar_chart) {
        this.bar_chart.resize()
      }
    }
  }
}
</script>

<style scoped></style>
