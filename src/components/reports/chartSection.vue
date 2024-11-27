<template>
  <div class="row q-gutter-y-lg">
    <div class="col-12">
      <LineGraph
        :data="toggleMonthly ? monthlyStats.data : weeklyStats.data"
        :categories="toggleMonthly ? monthlyStats.labels : weeklyStats.labels"
        yAxisTitle="Minutes"
      >
        <template #header>
          <div class="row justify-between">
            <div class="text-subtitle1">Course Minutes Report</div>
            <div>
              <q-toggle label="Weekly" :left-label="true" color="primary" v-model="toggleMonthly" val="blue" />
              Monthly
            </div>
          </div>
        </template>
      </LineGraph>
    </div>
    <div class="col-12">
      <BarGraph
        :categories="topCourses.labels"
        :data="series"
        title="Top Five Courses"
        yTooltipTitle="Enrollment"
        :customColors="this.series[0]?.colors ?? undefined"
      />
    </div>
  </div>
</template>

<script>
import BarGraph from 'components/charts/BarGraph.vue'
import LineGraph from 'components/charts/LineGraph.vue'
export default {
  name: 'ChartSection',
  components: {
    BarGraph,
    LineGraph
  },
  props: {
    monthlyStats: {
      required: false,
      type: Object
    },
    weeklyStats: {
      required: false,
      type: Object
    },
    loadingIconData: {
      required: false,
      type: Boolean,
      default: false
    },
    topCourses: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      toggleMonthly: true
    }
  },
  computed: {
    series() {
      return [
        {
          data: this.topCourses.data.map((ele) => ele.value),
          colors: this.topCourses.data.map((ele) => ele?.itemStyle?.color ?? 'black')
        }
      ]
    }
  }
}
</script>
