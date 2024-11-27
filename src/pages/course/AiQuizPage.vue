<template>
  <BaseCard
    class="br-4 row q-py-sm q-px-lg"
    :class="{ 'items-center justify-center': courseStore.isLoading }"
    :style="{ minHeight: courseStore.isLoading ? '80vh' : 'auto' }"
  >
    <BaseComponentLoader :loading="courseStore.isLoading">
      <div class="row full-width">
        <div class="col-12">
          <HeaderSection :titleHead="courseStore.courseInfo?.name" :progressInfo="courseStore.courseInfo?.progress_percent || 0" />
        </div>
        <div :class="`q-pa-xs  col-${showMainSidebar ? 8 : 12} none-spacing`">
          <div class="q-mr-md full-height">
            <div class="br-4 q-mb-lg full-height">
              <div :class="aiChallenge.isLoading ? 'full-height' : 'auto'">
                <BaseComponentLoader :loading="aiChallenge.isLoading">
                  <AiQuizPageContent />
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
            <RightIndividualPageSideBar
              :eventId="eventId"
              :id="id"
              :subjectId="subjectId"
              @closeSideBar="toggleSideBar()"
              @openPage="enableAnotherPage($event)"
            />
            <BaseInnerLoading :showing="aiChallenge.isLoading" />
          </q-card>
        </div>
      </div>
    </BaseComponentLoader>
  </BaseCard>
</template>

<script setup>
import { googleAnalyticsFunction, urlSafeBase64Decode } from 'src/utils/reuseFunctions'

import { useCoursesStore } from 'src/store/pinia/courses'
import { defineComponent, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import useBreadcrumbs from 'src/composables/use-breadcrumb'
import { useAiChallengesStore } from 'src/store/pinia/aiChallenges/aiChallenges'

import AiQuizPageContent from 'src/components/course/AiQuizPageContent.vue'
import RightIndividualPageSideBar from 'src/components/course/RightIndividualPageSideBar.vue'
import HeaderSection from 'src/pages/course/TitleHeader.vue'
import BaseComponentLoader from 'src/components/wrappers/BaseComponentLoader/index.vue'

defineComponent({
  name: 'courseInfo.aiquiz'
})

const breadCrumbs = useBreadcrumbs()
const route = useRoute()
const router = useRouter()

const aiChallenge = useAiChallengesStore()
const courseStore = useCoursesStore()

const showMainSidebar = shallowRef(true)
const id = shallowRef(route.params.id)
const subjectId = shallowRef('')
const eventId = shallowRef('')

async function fetchAiQuizData() {
  eventId.value = urlSafeBase64Decode(route.params.courseId)
  id.value = urlSafeBase64Decode(route.params.id)
  subjectId.value = urlSafeBase64Decode(route.params.subjectId)
  if (id.value) {
    await aiChallenge.getQuizData({
      item_id: id.value,
      event_id: urlSafeBase64Decode(route.params.courseId)
    })
  }
}

fetchAiQuizData()

watch(
  () => aiChallenge.quizData?.name,
  () => {
    if (aiChallenge.quizData.name && courseStore.courseHeaderData.name) {
      document.title = `${courseStore.courseHeaderData.name}: ${aiChallenge.quizData.name}` || 'Course Quiz'
      setNestedBreadCrumbs()
      googleAnalyticsFunction({
        path: window.location.pathname,
        name: `${courseStore.courseHeaderData.name}: ${aiChallenge.quizData.name}`
      })
    }
  }
)

watch(
  () => courseStore.courseHeaderData?.name,
  () => {
    setNestedBreadCrumbs()
  }
)

async function enableAnotherPage(event) {
  const type = event.id.split('_')[0]
  if (type === 'quiz') {
    id.value = event.id
    if (event.id) {
      await aiChallenge.getQuizData({
        item_id: event.id,
        event_id: urlSafeBase64Decode(route.params.courseId)
      })
    }
  }
  router.push(event.url)
}

function setNestedBreadCrumbs() {
  breadCrumbs.setBreadcrumb([
    {
      name: 'courses',
      label: 'Courses'
    },
    {
      name: undefined,
      label: courseStore.courseHeaderData.name
    }
  ])
}

function toggleSideBar() {
  showMainSidebar.value = !showMainSidebar.value
}
</script>
