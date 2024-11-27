<template>
  <div>
    <q-page>
      <div class="row">
        <div class="q-pa-xs col-xs-3 col-sm-3 col-md-3col-lg-3">
          <IndividualPageSideBar :eventId="eventId" @openPage="enableAnotherPage($event)" />
        </div>
        <div class="q-pa-xs col-xs-9 col-sm-9 col-md-9 col-lg-9">
          <CourseIntroContentPage />
        </div>
      </div>
    </q-page>
  </div>
</template>
<script>
import { QSpinnerFacebook, useQuasar } from 'quasar'
import { useCoursesStore } from 'src/store/pinia/courses'
import { googleAnalyticsFunction, urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { defineComponent, onBeforeMount, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CourseIntroContentPage from 'components/course/CourseIntroContentPage.vue'
import IndividualPageSideBar from 'components/course/IndividualPageSideBar.vue'

defineComponent({ name: 'CourseIntroPage' })

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const coursesStore = useCoursesStore()

const eventId = shallowRef('')

onBeforeMount(async () => {
  {
    eventId.value = urlSafeBase64Decode(route.params.courseId)
    if (urlSafeBase64Decode(route.params.courseId) !== coursesStore.courseInfo.id) {
      await coursesStore.fetchCourse({
        event_id: eventId.value
      })
    }
    await coursesStore.fetchInstructorInfo(coursesStore.courseInfo.instructor_id)
  }
})

watch(
  () => coursesStore.isLoading,
  () => {
    if (coursesStore.isLoading) {
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

watch(
  () => coursesStore.courseInfo.name,
  () => {
    if (coursesStore.courseInfo.name) {
      document.title = coursesStore.courseInfo.name || 'Course Intro'
      googleAnalyticsFunction({
        path: window.location.pathname,
        name: coursesStore.courseInfo.name
      })
    }
  }
)

async function enableAnotherPage(event) {
  await router.push(event.url)
}
</script>
