<script setup>
import { shallowRef, onBeforeMount } from 'vue'

import { useAssignmentCourse } from 'src/store/pinia/assignments/course.js'

import CourseDetails from './CourseDetails.vue'

const { COURSES, JOURNEYS } = {
  COURSES: 'courses',
  JOURNEYS: 'journeys'
}

const assignmentCourse = useAssignmentCourse()

const tab = shallowRef(COURSES)

async function bootAssignmentCourse() {
  if (assignmentCourse.assignmentCourses.length || assignmentCourse.updateStatus) return
  await assignmentCourse.fetchAssignmentCourse({ payload: {} })
}

onBeforeMount(() => {
  bootAssignmentCourse()
})
</script>

<template>
  <BaseTabs v-model="tab" class="bg-white">
    <q-tab :name="COURSES" label="Courses" />
    <q-tab :name="JOURNEYS" label="Journeys" />
  </BaseTabs>

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel :name="COURSES">
      <CourseDetails />
    </q-tab-panel>
    <q-tab-panel :name="JOURNEYS">
      <CourseDetails isJourney />
    </q-tab-panel>
  </q-tab-panels>
</template>

<style lang="scss"></style>
