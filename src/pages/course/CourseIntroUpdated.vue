<template>
  <BaseCard class="br-4 q-pa-md">
    <div class="row">
      <div :class="`q-pa-xs col-xs-${mainView}  col-sm-${mainView}  col-md-${mainView} col-lg-${mainView}`">
        <CourseIntroContentPage />
      </div>
      <div :class="`q-pa-xs col-xs-${subView} col-sm-${subView} col-md-${subView} col-lg-${subView}`">
        <BaseTabs v-model="tab" no-caps class="text-gray" active-color="gray" indicator-color="secondary" align="left">
          <q-tab name="contents" label="Lessons" />
          <q-tab name="instructors" label="Instructors" />
        </BaseTabs>
        <q-separator />
        <q-tab-panels v-model="tab">
          <q-tab-panel name="contents">
            <IndividualPageSideBar :eventId="eventId" @openPage="enableAnotherPage($event)" />
          </q-tab-panel>
          <q-tab-panel name="instructors">
            <div class="portal_bold ase-roboto portal_sm portal_color" v-if="coursesStore.instructorInfo.length > 0">
              <div v-for="(instructor, index) of coursesStore.instructorInfo" :key="index">
                <CourseInstructorInfo class="q-pb-md" v-if="instructor.name" :data="instructor" />
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </BaseCard>
</template>
<script setup>
import { QSpinnerFacebook, useQuasar } from 'quasar'
import { googleAnalyticsFunction, urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useMacroMetaStore } from 'src/store/pinia/macroMeta'
import { defineComponent, onBeforeMount, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CourseIntroContentPage from 'components/course/LCourseIntroContentPage.vue'
import CourseInstructorInfo from 'src/components/course/CourseInstructorInfo.vue'
import IndividualPageSideBar from 'components/course/LIndividualPageSideBar.vue'

defineComponent({ name: 'CourseIntroUpdatedPage' })

const route = useRoute()
const $q = useQuasar()
const router = useRouter()

const mainView = shallowRef(12)
const subView = shallowRef(12)
const tab = shallowRef('contents')
const eventId = shallowRef('')

const coursesStore = useCoursesStore()
const macroMetaStore = useMacroMetaStore()

onBeforeMount(async () => {
  eventId.value = urlSafeBase64Decode(route.params.courseId)

  if (urlSafeBase64Decode(route.params.courseId) !== coursesStore.courseInfo.id) {
    await coursesStore.fetchCourse({ event_id: eventId })
  }
  await coursesStore.fetchInstructorInfo(coursesStore.courseInfo.instructor_id)

  await macroMetaStore.publishCourseStats({
    course: urlSafeBase64Decode(route.params.courseId),
    learning_path: coursesStore.courseInfo.learningPaths
  })
})

watch([() => coursesStore.isLoading, () => macroMetaStore.isLoading], (newValue) => {
  if (newValue.includes(true)) {
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
})

watch(
  () => coursesStore.courseInfo.name,
  () => {
    if (coursesStore.courseInfo.name) {
      document.title = coursesStore.courseInfo.name || 'Course Intro'
      googleAnalyticsFunction({ path: window.location.pathname, name: coursesStore.courseInfo.name })
    }
  }
)

async function enableAnotherPage(event) {
  mainView.value = 9
  subView.value = 3
  await router.push(event.url)
}
</script>
