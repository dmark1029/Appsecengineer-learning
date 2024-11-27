<template>
  <div
    :class="{ 'no-pointer-events': userActivity.isActivityDisabled }"
    :style="{
      opacity: userActivity.isActivityDisabled ? '.6' : '1'
    }"
  >
    <div class="q-pa-sm row">
      <div class="text-subtitle1">Course Content</div>
      <q-space />
      <div>
        <q-icon class="cursor-pointer" color="gray-8" name="close" size="20px" @click="closeSideBar" />
      </div>
    </div>
    <q-list class="">
      <q-expansion-item
        v-for="(item, index) in coursesStore.courseOutlineData"
        :default-opened="item.subject_name === fetchDefaultSectionX"
        dense-toggle
        :key="index"
        icon="perm_identity"
        class="base-expansion q-my-md"
        header-class="item__header"
      >
        <template v-slot:header>
          <q-item-section>
            <div class="text-subtitle1 none-spacing" :class="getActiveClass(item.subject_name)">
              {{ item.subject_name }}
            </div>
            <div>{{ item.timerCourse }}</div>
          </q-item-section>
        </template>

        <q-list v-for="content in item.items" :key="content.id" bordered>
          <q-item class="q-pa-sm" clickable @click="showAnotherPageContent(content.url, content.id)">
            <q-item-section>
              <q-item-label class="flex items-center justify-between no-wrap">
                <div>
                  <span v-if="content.challenge">
                    <q-checkbox
                      v-if="content.isCompleted || coursesStore.courseHeaderData.is_enrolled"
                      :color="content.isCompleted ? 'green' : 'secondary'"
                      disable
                      size="xs"
                      v-model="content.isCompleted"
                    />
                  </span>
                  <span v-else>
                    <q-checkbox
                      v-if="content.isCompleted"
                      :color="content.isCompleted ? 'green' : 'secondary'"
                      disable
                      size="xs"
                      v-model="content.isCompleted"
                    />
                    <q-checkbox
                      v-else-if="coursesStore.courseHeaderData.is_enrolled"
                      :color="content.isCompleted ? 'green' : 'secondary'"
                      size="xs"
                      v-model="content.isCompleted"
                      @update:model-value="markCompleted(content.id)"
                    />
                  </span>
                  <template v-for="item in listIcons" :key="item.type">
                    <q-icon v-if="content.type === item.type" class="q-pr-sm" :class="item.colorClass" :name="item.icon" />
                  </template>
                  <span class="cursor-pointer text-justify" :class="getActiveClassItem(content.id)">
                    {{ content.name }}
                  </span>
                </div>
                <div class="column text-right">
                  <span
                    v-if="content.itemTtl !== '0:00'"
                    class="float-right"
                    :class="getActiveClassItem(content.id)"
                    style="white-space: nowrap"
                  >
                    {{ content.itemTtl }}
                  </span>
                  <q-badge class="q-pa-sm bg-black q-my-sm" v-if="content.challenge">Challenge</q-badge>
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
        </q-list>
      </q-expansion-item>
    </q-list>

    <FeedbackPage
      v-model="messageText"
      v-model:rating="rating"
      v-model:show="coursesStore.feedBackStatus"
      @confirmClose="confirmClose"
      @confirmSubmit="confirmSubmit"
    />
    <OverallFeedbackPage
      v-model:feedbackInfoOverview="feedbackStore.submitProgressMessage"
      v-model="overViewFeedbackMessage"
      v-model:ratingOverview="overViewFeedbackRating"
      v-model:showOverview="overViewFeedbackShow"
      @confirmCloseOverview="cancelOverviewFeedback"
      @confirmSubmitOverview="submitFeedbackOverview"
    />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useUserActivity } from 'src/store/pinia/userActivity'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'

import { useNewProvisionStore } from 'src/store/pinia/newProvision'
import { useFeedbackStore } from 'src/store/pinia/feedback'
import { computed, defineAsyncComponent, onBeforeMount, shallowRef } from 'vue'
import { useRouter } from 'vue-router'

const listIcons = [
  {
    type: 'lab',
    icon: 'fas fa-flask',
    colorClass: 'text-green-11'
  },
  {
    type: 'vid',
    icon: 'fas fa-video',
    colorClass: 'text-blue-12'
  },
  {
    type: 'quiz',
    icon: 'fas fa-question',
    colorClass: 'text-grey-7'
  },
  {
    type: 'download',
    icon: 'fas fa-download',
    colorClass: 'text-grey-7'
  },
  {
    type: 'media',
    icon: 'fas fa-photo-video',
    colorClass: 'text-grey-7'
  },
  {
    type: 'aiquiz',
    icon: 'fas fa-code',
    colorClass: 'text-primary'
  }
]

import FeedbackPage from 'src/components/feedback/feedBackCommentForm.vue'
import OverallFeedbackPage from 'src/components/feedback/feedbackOverallCourse.vue'

const props = defineProps({
  eventId: { required: false },
  id: { required: false },
  subjectId: { required: false }
})

const emit = defineEmits(['openPage', 'closeSideBar'])

const router = useRouter()
const $q = useQuasar()

const newProvisionStore = useNewProvisionStore()
const coursesStore = useCoursesStore()
const feedbackStore = useFeedbackStore()
const userActivity = useUserActivity()

const labId = shallowRef(props.id)
const messageText = shallowRef('')
const rating = shallowRef(0)
const overViewFeedbackShow = shallowRef(false)
const overViewFeedbackMessage = shallowRef('')
const overViewFeedbackRating = shallowRef(0)
const fetchDefaultSection = shallowRef('Introduction')
const fetchDefaultSectionName = shallowRef('Course Introduction')

onBeforeMount(async () => {
  if (Object.entries(coursesStore.courseHeaderData).length === 0) {
    await coursesStore.fetchCourse({ event_id: props.eventId })
  }
})

async function showAnotherPageContent(url, id) {
  labId.value = ''
  labId.value = id
  if (id) {
    emit('openPage', { show: true, url, id })
  }
}
async function markCompleted(id) {
  await coursesStore.markTopicCompleted({
    event_id: props.eventId,
    item_id: id,
    manual: true
  })

  await coursesStore.fetchCourse({ event_id: props.eventId })
}

function closeSideBar() {
  emit('closeSideBar')
}
function cancelOverviewFeedback() {
  overViewFeedbackShow.value = !overViewFeedbackShow.value
  overViewFeedbackRating.value = 0
}
async function submitFeedbackOverview() {
  const payload = {
    description: overViewFeedbackMessage.value,
    rating: overViewFeedbackRating.value
  }
  if (coursesStore.courseHeaderData.id) {
    payload.event_id = coursesStore.courseHeaderData.id
  }
  await feedbackStore.submitProgress(payload)
  overViewFeedbackShow.value = false
}
async function confirmClose(event) {
  rating.value = 0
  coursesStore.clearStoragePopup(false)
  newProvisionStore.clearStoragePopupLab(false)
  if (coursesStore.feedBackItemDetails.feedback_completed || false) {
    router.push(`/portal/course-info/completed/${urlSafeBase64Encode(coursesStore.feedBackItemDetails.event_id)}/`)
  } else if (coursesStore.feedBackItemDetails.feedback_badge || false) {
    router.push(
      `/portal/course-info/completed/${urlSafeBase64Encode(coursesStore.feedBackItemDetails.event_id)}/${urlSafeBase64Encode(
        coursesStore.feedBackItemDetails.redirect_badge_id
      )}`
    )
  } else if (newProvisionStore.feedBackItemDetails.feedback_completed || false) {
    router.push(`/portal/course-info/completed/${urlSafeBase64Encode(newProvisionStore.feedBackItemDetails.event_id)}/`)
  } else if (newProvisionStore.feedBackItemDetails.feedback_badge || false) {
    router.push(
      `/portal/course-info/completed/${urlSafeBase64Encode(newProvisionStore.feedBackItemDetails.event_id)}/${urlSafeBase64Encode(
        newProvisionStore.feedBackItemDetails.redirect_badge_id
      )}`
    )
  } else if (
    (coursesStore.feedBackItemDetails.item_id || newProvisionStore.feedBackItemDetails.item_id) &&
    (!coursesStore.feedBackItemDetails.manual ||
      coursesStore.feedBackItemDetails.item_id.includes('lab_') ||
      newProvisionStore.feedBackItemDetails.item_id.includes('lab_'))
  ) {
    if (coursesStore.feedBackItemDetails.item_id) {
      await coursesStore.gotoNextCourse({ filterId: coursesStore.feedBackItemDetails.item_id })
    } else {
      await coursesStore.gotoNextCourse({ filterId: newProvisionStore.feedBackItemDetails.item_id })
    }
  }
}

function getActiveClass(item) {
  if (item !== fetchDefaultSectionX.value) return undefined

  return $q.dark.isActive ? 'text-green-12' : 'text-primary'
}
function getActiveClassItem(id) {
  if ($q.dark.isActive) {
    return fetchSelectedCourseSubIndividualId.value === id ? 'text-green-12' : undefined
  }
  return fetchSelectedCourseSubIndividualId.value === id ? 'text-primary' : undefined
}

async function confirmSubmit(event) {
  const payload = {
    description: messageText.value,
    rating: rating.value
  }
  if (coursesStore.feedBackItemDetails.event_id) {
    payload.event_id = coursesStore.feedBackItemDetails.event_id
  } else {
    payload.event_id = newProvisionStore.feedBackItemDetails.event_id
  }
  await feedbackStore.submitProgress(payload)
  coursesStore.clearStoragePopup(false)
  await newProvisionStore.clearStoragePopupLab(false)
  if (coursesStore.feedBackItemDetails.feedback_completed || false) {
    router.push(`/portal/course-info/completed/${urlSafeBase64Encode(coursesStore.feedBackItemDetails.event_id)}/`)
  } else if (coursesStore.feedBackItemDetails.feedback_badge || false) {
    router.push(
      `/portal/course-info/completed/${urlSafeBase64Encode(coursesStore.feedBackItemDetails.event_id)}/${urlSafeBase64Encode(
        coursesStore.feedBackItemDetails.redirect_badge_id
      )}`
    )
  } else if (newProvisionStore.feedBackItemDetails.feedback_completed || false) {
    router.push(`/portal/course-info/completed/${urlSafeBase64Encode(newProvisionStore.feedBackItemDetails.event_id)}/`)
  } else if (newProvisionStore.feedBackItemDetails.feedback_badge || false) {
    router.push(
      `/portal/course-info/completed/${urlSafeBase64Encode(newProvisionStore.feedBackItemDetails.event_id)}/${urlSafeBase64Encode(
        newProvisionStore.feedBackItemDetails.redirect_badge_id
      )}`
    )
  } else if (
    (coursesStore.feedBackItemDetails.item_id || newProvisionStore.feedBackItemDetails.item_id) &&
    (!coursesStore.feedBackItemDetails.manual ||
      coursesStore.feedBackItemDetails.item_id.includes('lab_') ||
      newProvisionStore.feedBackItemDetails.item_id.includes('lab_'))
  ) {
    if (coursesStore.feedBackItemDetails.item_id) {
      coursesStore.gotoNextCourse({ filterId: coursesStore.feedBackItemDetails.item_id })
    } else {
      coursesStore.gotoNextCourse({ filterId: newProvisionStore.feedBackItemDetails.item_id })
    }
  }
}

const fetchDefaultSectionX = computed(() => {
  const selectedData = coursesStore.courseOutlineData
    .map((e) => e.items.filter((itemIndex) => itemIndex.id === props.id))
    .filter((e) => e.length > 0)[0][0]
  if (selectedData && selectedData.subject_name) {
    return selectedData.subject_name
  }
  return fetchDefaultSection.value
})

const fetchSelectedCourseSubIndividualId = computed(() => {
  const selectedData = coursesStore.courseOutlineData
    .map((e) => e.items.filter((itemIndex) => itemIndex.id === props.id))
    .filter((e) => e.length > 0)[0][0]
  if (selectedData && selectedData.id) {
    return selectedData.id
  }
  return fetchDefaultSectionName
})
</script>
