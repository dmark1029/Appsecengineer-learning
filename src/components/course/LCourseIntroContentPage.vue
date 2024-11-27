<template>
  <section class="row">
    <div class="col-xl-12 col-lg-12 col-md-10 col-sm-12">
      <div class="flex items-end justify-between">
        <div>
          <q-chip
            v-if="coursesStore.courseInfo.proficiency"
            class="text-weight-medium ase-roboto"
            color="green"
            size="12px"
            square
            text-color="white"
          >
            {{ coursesStore.courseInfo.proficiency }}
          </q-chip>
          <div v-if="coursesStore.courseInfo.name" class="text-subtitle1">{{ coursesStore.courseInfo.name }}</div>
          <span v-if="coursesStore.totalCourseMinutes">
            <q-icon size="sm" name="timer" />
            {{ coursesStore.totalCourseMinutes }}
          </span>
          <span v-if="coursesStore.courseOutlineData.length">
            <q-icon size="sm" name="article" />
            {{ coursesStore.courseOutlineData.length }} {{ coursesStore.courseOutlineData.length > 1 ? 'Lessons' : 'Lesson' }}
          </span>
        </div>
        <q-circular-progress
          center-color="white"
          :color="coursesStore.courseInfo.progress_percent >= 100 ? 'green' : 'secondary'"
          font-size="18px"
          show-value
          size="62px"
          :thickness="0.2"
          track-color="grey"
          :value="coursesStore.courseInfo.progress_percent"
        >
          <div class="text-subtitle1">{{ coursesStore.courseInfo.progress_percent }}%</div>
          <q-tooltip class="bg-white shadow-10 q-pa-md text-black text-center">
            <div class="q-mb-none text-subtitle2">
              {{
                coursesStore.courseOutlineData
                  .map((data) => data.items.filter((info) => info.isCompleted).length)
                  .reduce((previousValue, currentValue) => previousValue + currentValue, 0) +
                ' of ' +
                coursesStore.courseOutlineData
                  .map((data) => data.items.filter((info) => info).length)
                  .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
              }}
            </div>
            <p class="ase-roboto q-mb-none text-subtitle2">Lessons Completed</p>
          </q-tooltip>
        </q-circular-progress>
      </div>
      <div
        class="q-mt-md radius-16 row"
        :class="{
          'bg-beginner': coursesStore.courseInfo.proficiency == 'Basic',
          'bg-intermediate': coursesStore.courseInfo.proficiency == 'Intermediate',
          'bg-advanced': coursesStore.courseInfo.proficiency == 'Advanced'
        }"
      >
        <q-img class="col-lg-4 col-md-5 col-xs-12 radius-16" :src="coursesStore.courseInfo.logo" style="height: 100%" />
        <div class="q-pa-xs col-lg-8 col-md-7 col-sm-12">
          <div class="q-pa-sm text-justify">
            <p v-if="coursesStore.courseInfo.description" class="ase-roboto q-mb-none white">
              {{
                coursesStore.courseInfo.description.length > 390
                  ? coursesStore.courseInfo.description.substring(0, 390) + '...'
                  : coursesStore.courseInfo.description
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useCoursesStore } from 'src/store/pinia/courses'

defineProps({
  progressData: {
    default: 0
  }
})
const coursesStore = useCoursesStore()
</script>
