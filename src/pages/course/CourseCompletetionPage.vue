<template>
  <div>
    <q-page>
      <ConfettiExplosion v-if="visible" :particleCount="300" :particleSize="20" :stageHeight="1000" :stageWidth="2000" :duration="8000" />

      <div class="row">
        <div class="q-pa-xs col-xs-3 col-sm-3 col-md-3col-lg-3">
          <IndividualPageSideBar :eventId="eventId" @openPage="enableAnotherPage($event)" />
        </div>
        <div class="q-pa-xs col-xs-9 col-sm-9 col-md-9 col-lg-9">
          <CourseCompletionContentPage />
        </div>
      </div>
    </q-page>
  </div>
</template>
<script setup>
import { QSpinnerFacebook, useQuasar } from 'quasar'
import { useCoursesStore } from 'src/store/pinia/courses'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'

import { useDownloadContentStore } from 'src/store/pinia/downloadContent'
import { defineComponent, onBeforeMount, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CourseCompletionContentPage from 'components/course/CourseCompletionContentPage.vue'
import IndividualPageSideBar from 'components/course/IndividualPageSideBar.vue'
import ConfettiExplosion from 'vue-confetti-explosion'

defineComponent({
  name: 'CourseIntroPage'
})

const route = useRoute()
const router = useRouter()

const coursesStore = useCoursesStore()
const downloadContentStore = useDownloadContentStore()

const eventId = shallowRef('')
const visible = shallowRef(false)
const $q = useQuasar()

onBeforeMount(async () => {
  eventId.value = urlSafeBase64Decode(route.params.courseId)
  await coursesStore.fetchCourses({
    event_id: eventId.value
  })
  if (coursesStore.courseInfo?.progress_percent >= 100) {
    visible.value = true
    setTimeout(() => {
      visible.value = false
    }, 9000)
  }
})

watch(
  () => [downloadContentStore.isLoading, coursesStore.isLoading],
  ([downloadLoading, courseLoading]) => {
    if (downloadLoading || courseLoading) {
      $q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: 'white',
        spinnerSize: 140,
        message: 'Hang on...',
        messageColor: 'white'
      })
    } else {
      $q.loading.hide()
    }
  }
)

async function enableAnotherPage(event) {
  await router.push(event.url)
}
</script>
