<template>
  <q-page class="q-pa-xl">
    <div class="row">
      <div class="q-mb-md q-pa-sm col-xs-12 col-sm-12 col-md-8 col-lg-7">
        <UdemyCourseHeader :id="eventId" :basicInfo="coursesStore.courseOutlineData" />
        <q-card class="q-mt-md q-pa-sm">
          <q-card-section class="text-body1 text-bold">Course Content</q-card-section>
          <q-card-section>
            <CourseContentsList @goToVideoPreview="goToVideoPreview" :data="coursesStore.courseOutlineData" />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-5 q-pa-sm">
        <q-card class="q-pa-sm" style="position: sticky; top: 5rem">
          <q-card-section class="text-body1 text-bold">Course Preview</q-card-section>
          <q-card-section>
            <CoursePreviewCardPlayer
              v-if="videoStore.videoData.vidId"
              :autoPlayStyle="autoPlayData"
              :data="videoStore.videoData"
              @StopVideoPlayer="StopVideoPlayer"
            />
            <CoursePreviewCardContentInfo :outlineData="coursesStore.courseOutlineData" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { QSpinnerFacebook, useQuasar } from 'quasar'
import { useCoursesStore } from 'src/store/pinia/courses'
import { googleAnalyticsFunction, urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { useVideoStore } from 'src/store/pinia/video'
import { useMacroMetaStore } from 'src/store/pinia/macroMeta'
import { onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'

import CourseContentsList from 'components/course/CourseContentsList.vue'
import CoursePreviewCardContentInfo from 'components/course/CoursePreviewCardContentInfo.vue'
import CoursePreviewCardPlayer from 'components/course/CoursePreviewCardPlayer.vue'
import UdemyCourseHeader from 'components/course/UdemyCourseHeader.vue'

const route = useRoute()
const $q = useQuasar()

const videoStore = useVideoStore()
const coursesStore = useCoursesStore()
const macroMetaStore = useMacroMetaStore()

const autoPlayData = shallowRef(false)
const eventId = shallowRef(urlSafeBase64Decode(route.params.courseId))

onBeforeMount(async () => {
  document.title = coursesStore.courseInfo.name || 'Course Info'
  googleAnalyticsFunction({ path: window.location.pathname, name: coursesStore.courseInfo.name })

  const data = {
    event_id: eventId
  }
  if (eventId !== coursesStore.courseInfo.id) {
    await coursesStore.fetchCourse(data)
  }
  await coursesStore.fetchInstructorInfo(coursesStore.courseInfo.instructor_id)

  if (coursesStore.courseOutlineData.length > 0) {
    const filterVideosList = coursesStore.courseOutlineData.map((data) => data.items.filter((info) => info.type === 'vid'))[0]
    if (filterVideosList.length > 0) {
      if (filterVideosList[0].id) {
        await videoStore.getVideoData({
          event_id: eventId,
          item_id: filterVideosList[0].id
        })
      }
    }
  }
  await macroMetaStore.publishCourseStats({
    course: urlSafeBase64Decode(route.params.courseId),
    learning_path: coursesStore.courseInfo.learningPaths
  })
})

watch(
  () => [coursesStore.isLoading, videoStore.isLoading],
  ([coursesLoading, videoLoading]) => {
    if (coursesLoading || videoLoading) {
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

async function goToVideoPreview(data) {
  if (data.data.id) {
    await videoStore.getVideoData({
      event_id: eventId.value,
      item_id: data.data.id
    })
  }
  autoPlayData.value = true
}
function StopVideoPlayer() {
  autoPlayData.value = false
}
</script>
