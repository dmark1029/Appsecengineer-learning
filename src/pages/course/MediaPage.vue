<template>
  <BaseCard
    class="br-4 row q-py-sm q-px-lg"
    :class="{ 'items-center justify-center': coursesStore.isLoading }"
    :style="{ minHeight: coursesStore.isLoading ? '80vh' : 'auto' }"
  >
    <BaseComponentLoader :loading="coursesStore.isLoading">
      <div class="row full-width">
        <div class="q-pa-xs col-12">
          <HeaderSection :titleHead="coursesStore.courseInfo.name" :progressInfo="coursesStore.courseInfo.progress_percent || 0" />
        </div>
        <div :class="`q-pa-xs col-${showMainSidebar ? 8 : 12} none-spacing`">
          <div class="q-mr-md">
            <div class="q-pa-lg radius-8 relative-position shadow-1" :style="{ height: mediaStore.isLoading ? '30rem' : 'auto' }">
              <BaseComponentLoader :loading="mediaStore.isLoading">
                <MediaPageContent />
              </BaseComponentLoader>
              <div v-if="!showMainSidebar" class="absolute" :style="{ right: 0, top: 0 }">
                <div class="bg-secondary cursor-pointer text-white" style="opacity: 0.7" @click="toggleSideBar()">
                  <q-icon size="lg" name="chevron_right" />
                </div>
              </div>
            </div>
            <TabsSection
              :boldNumber="700"
              fontFamily="Roboto"
              fontSize="16px"
              paddingSize="12px"
              color="#6B6B6B"
              alignItem="justify"
              :lineHeight="1.2"
              :ratingInfoArray="coursesStore.ratingInfo"
              :contentInfoArray="coursesStore.courseHeaderData"
            />
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
            <BaseInnerLoading :showing="mediaStore.isLoading" />
          </q-card>
        </div>
      </div>
    </BaseComponentLoader>
  </BaseCard>
</template>

<script setup>
import { useCoursesStore } from 'src/store/pinia/courses'
import { googleAnalyticsFunction, urlSafeBase64Decode } from 'src/utils/reuseFunctions'

import { useMediaStore } from 'src/store/pinia/media'
import { defineComponent, onBeforeMount, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import MediaPageContent from 'src/components/course/MediaPageContent.vue'
import RightIndividualPageSideBar from 'src/components/course/RightIndividualPageSideBar.vue'
import TabsSection from 'src/components/TabsInfo/MediaTab.vue'
import HeaderSection from 'src/pages/course/TitleHeader.vue'
import BaseComponentLoader from 'src/components/wrappers/BaseComponentLoader/index.vue'

defineComponent({
  name: 'MediaPage'
})

const mediaStore = useMediaStore()
const coursesStore = useCoursesStore()

const route = useRoute()
const router = useRouter()

const showMainSidebar = shallowRef(true)
const eventId = shallowRef('')
const id = shallowRef('')
const subjectId = shallowRef('')

onBeforeMount(() => {
  eventId.value = urlSafeBase64Decode(route.params.courseId)
  id.value = urlSafeBase64Decode(route.params.id)
  subjectId.value = urlSafeBase64Decode(route.params.subjectId)
  const data = {
    item_id: id.value,
    event_id: urlSafeBase64Decode(route.params.courseId)
  }
  if (id.value) {
    mediaStore.getMediaData(data)
  }
})

watch(
  () => mediaStore.mediaData,
  () => {
    if (mediaStore.mediaData.name && coursesStore.courseHeaderData.name) {
      document.title = `${coursesStore.courseHeaderData.name}: ${mediaStore.mediaData.name}` || 'Course Media'
      googleAnalyticsFunction({
        path: window.location.pathname,
        name: `${coursesStore.courseHeaderData.name}: ${mediaStore.mediaData.name}`
      })
    }
  }
)

async function enableAnotherPage(event) {
  const type = event.id.split('_')[0]
  if (type === 'media' && event.id) {
    id.value = event.id
    mediaStore.getMediaData({
      item_id: event.id,
      event_id: urlSafeBase64Decode(route.params.courseId)
    })
  }
  await router.push(event.url)
}
function toggleSideBar() {
  showMainSidebar.value = !showMainSidebar.value
}
</script>

<style scoped>
.overflow_scroll {
  height: 100%;
  overflow-y: scroll;
}
</style>
