<template>
  <div class="full-height row items-center justify-center" style="min-height: 70vh">
    <BaseComponentLoader :loading="coursesStore.isLoading">
      <ConfettiExplosion v-if="visible" :particleCount="300" :particleSize="20" :stageHeight="1000" :stageWidth="2000" :duration="8000" />

      <div class="row full-width">
        <div class="q-pa-xs col-xs-3 col-sm-3 col-md-3col-lg-3">
          <IndividualPageSideBar :eventId="eventId" @openPage="enableAnotherPage($event)" />
        </div>
        <div class="q-pa-xs col-xs-9 col-sm-9 col-md-9 col-lg-9">
          <CourseCompletionContentPage />
        </div>
      </div>
    </BaseComponentLoader>
  </div>
</template>
<script setup>
import { useCoursesStore } from 'src/store/pinia/courses'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { defineComponent, onBeforeMount, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'

import IndividualPageSideBar from 'components/course/IndividualPageSideBar.vue'
import CourseCompletionContentPage from 'components/course/courseCompletionPlain.vue'
import ConfettiExplosion from 'vue-confetti-explosion'
import BaseComponentLoader from 'components/wrappers/BaseComponentLoader/index.vue'
import { ref } from 'vue'

defineComponent({
  name: 'CourseIntroPageCompleion'
})

const route = useRoute()
const router = useRoute()

const coursesStore = useCoursesStore()

const eventId = shallowRef('')
const visible = ref(false)

onBeforeMount(async () => {
  eventId.value = urlSafeBase64Decode(route.params.courseId)
  await coursesStore.fetchCourses({
    event_id: eventId
  })
  if (coursesStore.courseInfo?.progress_percent >= 100) {
    visible.value = true
    setTimeout(() => {
      visible.value = false
    }, 9000)
  }
})

async function enableAnotherPage(event) {
  await router.push(event.url)
}
</script>
