<template>
  <BaseCard
    class="br-4 row q-py-sm q-px-lg"
    :class="{ 'items-center justify-center': coursesStore.isLoading }"
    :style="{ minHeight: coursesStore.isLoading ? '80vh' : 'auto' }"
  >
    <BaseComponentLoader :loading="coursesStore.isLoading">
      <div class="row full-width">
        <div :class="`col-12`">
          <HeaderSection :titleHead="coursesStore.courseInfo.name || ''" :progressInfo="coursesStore.courseInfo.progress_percent || 0" />
        </div>
        <div :class="`q-pa-xs col-${showMainSidebar ? 8 : 12} none-spacing`">
          <div class="q-mr-md">
            <div class="q-pa-lg radius-8 relative-position shadow-1">
              <div :style="{ height: quizStore.isLoading ? '25rem' : 'auto' }">
                <BaseComponentLoader :loading="quizStore.isLoading">
                  <QuizPageContent />
                </BaseComponentLoader>
              </div>
              <div v-if="!showMainSidebar" class="absolute" :style="{ right: 0, top: 0 }">
                <div class="bg-secondary cursor-pointer text-white" style="opacity: 0.7" @click="toggleSideBar()">
                  <q-icon size="lg" name="chevron_right" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="showMainSidebar" :class="`col-${showMainSidebar ? 4 : 0} none-spacing q-pa-xs`">
          <q-card flat>
            <IndividualPageSideBar
              :eventId="eventId"
              :id="id"
              :subjectId="subjectId"
              @closeSideBar="toggleSideBar()"
              @openPage="enableAnotherPage($event)"
            />
            <BaseInnerLoading :showing="quizStore.isLoading" />
          </q-card>
        </div>
      </div>
    </BaseComponentLoader>
  </BaseCard>
</template>

<script setup>
import { googleAnalyticsFunction, urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import useBreadcrumbs from 'src/composables/use-breadcrumb'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useQuizStore } from 'src/store/pinia/quiz'
import { defineComponent, onBeforeMount, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import QuizPageContent from 'src/components/course/QuizPageContent.vue'
import IndividualPageSideBar from 'src/components/course/RightIndividualPageSideBar.vue'
import HeaderSection from 'src/pages/course/TitleHeader.vue'
import BaseComponentLoader from 'src/components/wrappers/BaseComponentLoader/index.vue'

defineComponent({ name: 'QuizPage' })

const showMainSidebar = shallowRef(true)
const eventId = shallowRef()
const id = shallowRef('')
const subjectId = shallowRef('')

const route = useRoute()
const router = useRouter()

const coursesStore = useCoursesStore()
const quizStore = useQuizStore()
const breadcrumbStore = useBreadcrumbs()

onBeforeMount(() => {
  fetchQuizData()
})

watch(
  () => quizStore.quizData.name,
  () => {
    if (quizStore.quizData.name && coursesStore.courseHeaderData.name) {
      document.title = `${coursesStore.courseHeaderData.name}: ${quizStore.quizData.name}` || 'Course Quiz'
      setNestedBreadCrumbs()
      googleAnalyticsFunction({
        path: window.location.pathname,
        name: `${coursesStore.courseHeaderData.name}: ${quizStore.quizData.name}`
      })
    }
  },
  {
    deep: true
  }
)

watch(
  () => coursesStore.courseHeaderData.name,
  () => {
    setNestedBreadCrumbs()
  }
)

function fetchQuizData() {
  eventId.value = urlSafeBase64Decode(route.params.courseId)
  id.value = urlSafeBase64Decode(route.params.id)
  subjectId.value = urlSafeBase64Decode(route.params.subjectId)
  if (id.value) {
    quizStore.getQuizData({
      item_id: id.value,
      event_id: urlSafeBase64Decode(route.params.courseId)
    })
  }
}

async function enableAnotherPage(event) {
  const type = event.id.split('_')[0]
  if (type === 'quiz') {
    id.value = event.id
    const data = {
      item_id: event.id,
      event_id: urlSafeBase64Decode(route.params.courseId)
    }
    if (event.id) {
      quizStore.getQuizData(data)
    }
  }
  await router.push(event.url)
}

function toggleSideBar() {
  showMainSidebar.value = !showMainSidebar.value
}

function setNestedBreadCrumbs() {
  breadcrumbStore.setBreadcrumb([
    {
      name: 'courses',
      label: 'Courses'
    },
    {
      name: undefined,
      label: coursesStore.courseHeaderData.name
    }
  ])
}
</script>

<style scoped>
.overflow_scroll {
  height: 100%;
  overflow-y: scroll;
}
</style>
