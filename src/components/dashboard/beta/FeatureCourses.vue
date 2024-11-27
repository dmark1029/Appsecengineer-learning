<template>
  <q-carousel
    class="bg-transparent full-height custom-carousel"
    :class="{ 'q-mr-lg': dashboardStore.dashboardLoading }"
    animated
    v-model="slide"
    navigation
    infinite
    autoplay
    :arrows="false"
    style="height: min-content; max-width: 70rem; border-radius: 0.8rem"
    transition-prev="slide-right"
    transition-next="slide-left"
  >
    <template v-slot:navigation-icon="{ active, onClick }">
      <div v-if="active" class="circle active-circle q-mx-xs" :class="{ 'bg-white': $q.dark.isActive }" @click="onClick"></div>
      <div v-else class="circle q-mx-xs cursor-pointer" :class="{ 'bg-dark-3': $q.dark.isActive }" @click="onClick"></div>
    </template>
    <template v-if="dashboardStore.dashboardLoading">
      <q-carousel-slide :name="1">
        <FeatureCourseSkeleton />
      </q-carousel-slide>
    </template>
    <template v-else>
      <q-carousel-slide v-for="(course, index) in featureCourses" :key="index" :name="index + 1" :course="course">
        <FeaturedCourseCard :course="course" />
      </q-carousel-slide>
    </template>
  </q-carousel>
</template>

<script setup>
import FeaturedCourseCard from './FeaturedCourseCard.vue'
import FeatureCourseSkeleton from 'src/components/skeleton/FeatureCourseSkeleton.vue'

import { computed, onBeforeMount, onMounted, shallowRef } from 'vue'

import { useQuasar } from 'quasar'
import { useDashboardStore } from 'src/store/pinia/dashboard'
import { randomIndexes } from 'src/utils/helpers'

const $q = useQuasar()

const dashboardStore = useDashboardStore()

const slide = shallowRef(1)

onBeforeMount(() => {
  if (dashboardStore.dashboardCourses?.length) return
  dashboardStore.fetchDashboardCourses()
})

const featureCourses = computed(() => {
  const indexes = randomIndexes(3, dashboardStore.dashboardCourses.length)
  return indexes.map((randomIndex) => {
    return dashboardStore.dashboardCourses[randomIndex]
  })
})
</script>

<style lang="scss">
.circle {
  background-color: $iron;
  width: 0.7rem;
  height: 0.7rem;
  clip-path: circle();
}
.active-circle {
  background-color: $night-blue;
  width: 1.5rem !important;
  border-radius: 0.6rem;
  clip-path: none;
}
.custom-carousel {
  .q-carousel__slide {
    padding: 0 !important;
  }
}
</style>
