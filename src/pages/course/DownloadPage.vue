<template>
  <BaseCard
    class="br-4 row q-py-sm q-px-lg"
    :class="{ 'items-center justify-center': coursesStore.isLoading }"
    :style="{ minHeight: coursesStore.isLoading ? '80vh' : 'auto' }"
  >
    <BaseComponentLoader :loading="coursesStore.isLoading">
      <div class="row full-width">
        <div class="col-12">
          <HeaderSection :titleHead="coursesStore.courseInfo.name" :progressInfo="coursesStore.courseInfo.progress_percent || 0" />
        </div>
        <div :class="`q-pa-xs col-${showMainSidebar ? 8 : 12} none-spacing`">
          <div class="q-mr-md">
            <div class="br-4 q-mb-lg">
              <div :style="{ height: downloadContentStore.isLoading ? '25rem' : 'auto' }" class="full-width">
                <BaseComponentLoader :loading="downloadContentStore.isLoading">
                  <DownloadPageContent />
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
            <BaseInnerLoading :showing="downloadContentStore.isLoading" />
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
import { useDownloadContentStore } from 'src/store/pinia/downloadContent'
import { defineComponent, onBeforeMount, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DownloadPageContent from 'src/components/course/DownloadPageContent.vue'
import RightIndividualPageSideBar from 'src/components/course/RightIndividualPageSideBar.vue'
import HeaderSection from 'src/pages/course/TitleHeader.vue'
import BaseComponentLoader from 'src/components/wrappers/BaseComponentLoader/index.vue'

defineComponent({
  name: 'DownloadPage'
})

const showMainSidebar = shallowRef(true)
const eventId = shallowRef('')
const id = shallowRef('')
const subjectId = shallowRef('')

const route = useRoute()
const router = useRouter()

const coursesStore = useCoursesStore()
const downloadContentStore = useDownloadContentStore()
const breadcrumbStore = useBreadcrumbs()

onBeforeMount(async () => {
  eventId.value = urlSafeBase64Decode(route.params.courseId)
  id.value = urlSafeBase64Decode(route.params.id)
  subjectId.value = urlSafeBase64Decode(route.params.subjectId)
  const data = {
    item_id: id.value,
    event_id: urlSafeBase64Decode(route.params.courseId)
  }
  if (!coursesStore.courseHeaderData.name) {
    await coursesStore.fetchCourse({
      event_id: urlSafeBase64Decode(route.params.courseId)
    })
  }
  await downloadContentStore.getDownloadData(data)
})

watch(
  () => downloadContentStore.downloadData,
  () => {
    if (downloadContentStore.downloadData.name && coursesStore.courseHeaderData.name) {
      document.title = `${coursesStore.courseHeaderData.name}: ${downloadContentStore.downloadData.name}` || 'Course Download'

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

      googleAnalyticsFunction({
        path: window.location.pathname,
        name: `${coursesStore.courseHeaderData.name}: ${downloadContentStore.downloadData.name}`
      })
    }
  }
)

async function enableAnotherPage(event) {
  const type = event.id.split('_')[0]
  if (type === 'download') {
    id.value = event.id
    if (id.value) {
      await downloadContentStore.getDownloadData({
        item_id: id.value,
        event_id: urlSafeBase64Decode(route.params.courseId)
      })
    }
  }
  if (type === 'download') {
    if (window.location.hash.substring(1, 2000) !== event.url) {
      setTimeout(() => {
        router.replace(event.url)
      })
    }
  } else {
    await router.push(event.url)
  }
}

function toggleSideBar() {
  showMainSidebar.value = !showMainSidebar.value
}
</script>
