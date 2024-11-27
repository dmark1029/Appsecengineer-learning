<script setup>
import CourseCard from 'components/dashboard/beta/CourseCard.vue'
import BaseDataFallBack from 'app/src/components/wrappers/BaseDataFallBack/index.vue'
import SlideViewSkeleton from 'components/skeleton/SlideViewSkeleton.vue'

import { useDashboardStore } from 'src/store/pinia/dashboard'

defineProps({
  title: {
    type: String,
    default: ''
  },
  challengesMode: {
    type: Boolean,
    default: false
  },
  playgroundsMode: {
    type: Boolean,
    default: false
  }
})

const dashboardStore = useDashboardStore()

dashboardStore.fetchDashboardCourses()
</script>

<template>
  <h4 class="font-paytone q-mt-none q-mb-sm" style="font-size: 26px">{{ title }}</h4>

  <div class="row">
    <template v-if="dashboardStore.dashboardLoading">
      <template v-for="item in Array(6)" :key="item">
        <div class="col-xl-3 q-mb-md journey-card-wrapper">
          <SlideViewSkeleton />
        </div>
      </template>
    </template>

    <template v-else>
      <BaseDataFallBack v-if="dashboardStore.dashboardCourses?.length === 0" :title="'Sorry, No Data Found'" />
      <div v-for="(course, index) in dashboardStore.dashboardCourses" class="col-xl-3 q-mb-md journey-card-wrapper" :key="index">
        <CourseCard
          :data="course"
          @moveToCourseInfo="() => {}"
          :loading="false"
          smallerText
          :challengeMode="challengesMode || playgroundsMode"
          disabled
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.journey-card-wrapper {
  @media (max-width: 1965px) {
    width: 33.33% !important;
  }

  @media (max-width: 1660px) {
    width: 50% !important;
  }

  @media (max-width: 1352px) {
    width: 100% !important;
  }

  @media (min-width: 2080px) {
    max-width: 350px;
  }
}
</style>
