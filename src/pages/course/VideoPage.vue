<template>
  <BaseCard
    class="br-4 row q-py-sm q-px-lg"
    :class="{ 'items-center justify-center': coursesStore.isLoading }"
    :style="{ minHeight: coursesStore.isLoading ? '80vh' : 'auto' }"
  >
    <BaseComponentLoader :loading="coursesStore.isLoading && !coursesStore.isMarking">
      <div class="col-12">
        <HeaderSection :titleHead="coursesStore.courseInfo.name" :progressInfo="coursesStore.courseInfo.progress_percent || 0" />
      </div>
      <div class="row col-12">
        <div :class="`q-pa-xs col-${showMainSidebar ? 8 : 12}`">
          <div class="q-mr-md">
            <BaseCard class="br-4 full-height q-pa-sm q-mb-lg">
              <div :style="{ height: videoStore.isLoading || coursesStore.isMarking || isEndingVideo ? '25rem' : 'auto' }">
                <BaseComponentLoader :loading="isLoadingContent">
                  <VideoPageContent @handleVideoEnd="handleVideoEnd" />
                </BaseComponentLoader>
              </div>
              <div v-if="!showMainSidebar" class="absolute" :style="{ right: 0, top: 0 }">
                <div class="bg-secondary cursor-pointer text-white" style="opacity: 0.7" @click="toggleSideBar()">
                  <q-icon size="lg" name="chevron_right" />
                </div>
              </div>
            </BaseCard>
            <VideoTab
              :contentInfoArray="coursesStore.courseHeaderData"
              :instructors="coursesStore.courseInfo.instructors"
              class="q-my-lg"
              :courseId="eventId"
              :asegptStatus="coursesStore.courseInfo.asegpt_ingestion_status"
            />
          </div>
        </div>
        <div v-if="showMainSidebar" :class="`col-${showMainSidebar ? 4 : 0} q-pa-xs`">
          <q-card flat>
            <RightIndividualPageSideBar
              :eventId="eventId"
              :id="id"
              :subjectId="subjectId"
              @closeSideBar="toggleSideBar()"
              @openPage="enableAnotherPage($event)"
            />
            <BaseInnerLoading :showing="videoStore.isLoading || coursesStore.isMarking" />
          </q-card>
        </div>
      </div>
    </BaseComponentLoader>
  </BaseCard>
</template>

<script setup>
import { googleAnalyticsFunction, urlSafeBase64Decode } from 'src/utils/reuseFunctions'

import useBreadcrumbs from 'src/composables/use-breadcrumb'
import { useVideoStore } from 'src/store/pinia/video'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useMacroMetaStore } from 'src/store/pinia/macroMeta'

import { computed, defineComponent, onBeforeMount, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import RightIndividualPageSideBar from 'src/components/course/RightIndividualPageSideBar.vue'
import VideoPageContent from 'src/components/course/VideoPageContent.vue'
import VideoTab from 'src/components/TabsInfo/VideoTab.vue'
import HeaderSection from 'src/pages/course/TitleHeader.vue'
import BaseComponentLoader from 'src/components/wrappers/BaseComponentLoader/index.vue'

defineComponent({ name: 'VideoPage' })

const route = useRoute()
const router = useRouter()

const videoStore = useVideoStore()
const coursesStore = useCoursesStore()
const macroMetaStore = useMacroMetaStore()
const breadCrumbStore = useBreadcrumbs()

const id = shallowRef(route.params.id)
const subjectId = shallowRef('')
const eventId = shallowRef('')
const showMainSidebar = shallowRef(true)
const isEndingVideo = shallowRef(false)

onBeforeMount(() => {
  fetchVideoData()
})

async function fetchVideoData() {
  eventId.value = urlSafeBase64Decode(route.params.courseId)
  id.value = urlSafeBase64Decode(route.params.id)
  subjectId.value = urlSafeBase64Decode(route.params.subjectId)

  if (id.value) {
    await videoStore.getVideoData({
      item_id: id.value,
      event_id: urlSafeBase64Decode(route.params.courseId)
    })
  }
}

async function enableAnotherPage(event) {
  const type = event.id.split('_')[0]
  if (type === 'vid') {
    id.value = event.id
    if (id.value) {
      videoStore.getVideoData({
        item_id: event.id,
        event_id: urlSafeBase64Decode(route.params.courseId)
      })
    }
  }
  await router.push(event.url)
}

function toggleSideBar() {
  showMainSidebar.value = !showMainSidebar.value
}
function setNestedBreadCrumbs() {
  const header = coursesStore.courseInfo?.live_at
    ? {
        name: 'live-courses',
        label: 'Live courses'
      }
    : {
        name: 'courses',
        label: 'Courses'
      }
  breadCrumbStore.setBreadcrumb([
    header,
    {
      name: undefined,
      label: coursesStore.courseHeaderData.name
    }
  ])
}

async function handleVideoEnd() {
  isEndingVideo.value = true
  const video_id = videoStore.videoData.id

  videoStore.removeVideoProgress({ video_id })

  if (!filterIsCompleted(video_id)) {
    await coursesStore.markTopicCompleted({
      event_id: urlSafeBase64Decode(route.params.courseId),
      item_id: video_id
    })
    if (coursesStore.statusOfMarkingApi) {
      await coursesStore.fetchCourse({ event_id: urlSafeBase64Decode(route.params.courseId) })
    }
  }

  if (!coursesStore.feedBackStatus) {
    await coursesStore.gotoNextCourse({ filterId: video_id })
  }
  isEndingVideo.value = false
}

function filterIsCompleted(filterId) {
  const itemsList = coursesStore.courseOutlineData
    .map((e) => e.items.filter((dataItem) => dataItem.id === filterId))
    .filter((e) => e.length > 0)
  return itemsList.length > 0 ? itemsList[0][0].isCompleted : false
}

watch(
  () => route.params,
  async () => {
    !videoStore.isLoading && (await fetchVideoData())
    if (Object.entries(videoStore.trackVideo).length > 0) {
      macroMetaStore.publishVideoStats(videoStore.trackVideo)
      videoStore.setTrackVideo({})
    }
  }
)

watch(
  () => videoStore.videoData.name,
  function () {
    if (videoStore.videoData.name && coursesStore.courseHeaderData.name) {
      document.title = `${coursesStore.courseHeaderData.name}: ${videoStore.videoData.name}` || 'Video'
      googleAnalyticsFunction({
        path: window.location.pathname,
        name: `${coursesStore.courseHeaderData.name}: ${videoStore.videoData.name}`
      })
      setNestedBreadCrumbs()
    }
  }
)

watch(
  () => coursesStore.courseHeaderData.name,
  () => {
    setNestedBreadCrumbs()
  }
)

const isLoadingContent = computed(() => isEndingVideo.value || videoStore.isLoading || coursesStore.isMarking || coursesStore.isLoading)
</script>
