<template>
  <div class="items-center q-pt-sm row">
    <div class="q-pa-xs col-8">
      <span class="ase-roboto q-mr-md text-bold text-subtitle1">{{ titleHead }}</span>
      <span class="q-mr-sm" v-if="coursesStore.totalCourseMinutes !== 0">
        <q-icon name="timer" size="16px" />
        {{ coursesStore.totalCourseMinutes }}
      </span>
      <span class="q-mr-sm" v-if="coursesStore.totalLabs !== 0">
        <q-icon name="science" size="18px" />
        {{ coursesStore.totalLabs + ' Labs' }}
      </span>
      <span>
        <q-icon name="library_books" size="16px" />
        {{ coursesStore.courseOutlineData.length + ' Subjects' }}
      </span>
    </div>
    <div :class="`q-pa-xs col-4`" align="right">
      <div class="items-center justify-end row">
        <q-btn flat no-caps @click="feedbackOverviewIconSelect" unelevated>
          <q-icon name="star" color="yellow-8" />
          <span class="text-subtitle1">Leave a rating</span>
        </q-btn>
        <div class="q-pa-xs">
          <q-circular-progress
            show-value
            font-size="10px"
            :value="progressInfo || 0"
            size="40px"
            :thickness="0.3"
            color="black-12"
            track-color="green-12"
          >
            {{ progressInfo ? progressInfo + '%' : 0 }}
          </q-circular-progress>
        </div>
      </div>
    </div>
    <FeedbackPage
      :show="coursesStore.feedBackStatus"
      v-model="messageText"
      v-model:rating="rating"
      @confirmClose="confirmClose"
      @confirmSubmit="confirmSubmit"
    />
    <OverallFeedbackPage
      :showOverview="overViewFeedbackShow"
      v-model="overViewFeedbackMessage"
      v-model:feedbackInfoOverview="feedbackStore.submitProgressMessage"
      v-model:ratingOverview="overViewFeedbackRating"
      @confirmCloseOverview="cancelOverviewFeedback"
      @confirmSubmitOverview="submitFeedbackOverview"
    />
  </div>
</template>

<script setup>
import { useCoursesStore } from 'src/store/pinia/courses'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { useNewProvisionStore } from 'src/store/pinia/newProvision'
import { useFeedbackStore } from 'src/store/pinia/feedback'
import { defineComponent, shallowRef } from 'vue'
import { useRouter } from 'vue-router'

import FeedbackPage from 'components/feedback/feedBackCommentForm.vue'
import OverallFeedbackPage from 'components/feedback/feedbackOverallCourse.vue'

defineComponent({
  name: 'CourseTitleHeaderPage'
})

defineProps({
  titleHead: { required: true },
  progressInfo: { required: false }
})

const emit = defineEmits(['closeSideBar'])

const router = useRouter()

const feedbackStore = useFeedbackStore()
const coursesStore = useCoursesStore()
const newProvisionStore = useNewProvisionStore()

const messageText = shallowRef('')
const rating = shallowRef(0)
const overViewFeedbackShow = shallowRef(false)
const overViewFeedbackMessage = shallowRef('')
const overViewFeedbackRating = shallowRef(0)
const fetchTotalCourseMinutes = shallowRef('')

async function feedbackOverviewIconSelect() {
  await feedbackStore.fetchProgressStatus({ event_id: coursesStore.courseHeaderData.id })

  setTimeout(() => {
    overViewFeedbackShow.value = true
  }, 500)
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

async function confirmClose() {
  rating.value = 0
  coursesStore.clearStoragePopup(false)
  newProvisionStore.clearStoragePopupLab(false)
  if (coursesStore.feedBackItemDetails.feedback_completed || false) {
    router.push(`/portal/course-info/completed/${urlSafeBase64Decode(coursesStore.feedBackItemDetails.event_id)}/`)
  } else if (coursesStore.feedBackItemDetails.feedback_badge || false) {
    router.push(
      `/portal/course-info/completed/${urlSafeBase64Decode(coursesStore.feedBackItemDetails.event_id)}/${urlSafeBase64Decode(
        coursesStore.feedBackItemDetails.redirect_badge_id
      )}`
    )
  } else if (newProvisionStore.feedBackItemDetails.feedback_completed || false) {
    router.push(`/portal/course-info/completed/${urlSafeBase64Decode(newProvisionStore.feedBackItemDetails.event_id)}/`)
  } else if (newProvisionStore.feedBackItemDetails.feedback_badge || false) {
    router.push(
      `/portal/course-info/completed/${urlSafeBase64Decode(newProvisionStore.feedBackItemDetails.event_id)}/${urlSafeBase64Decode(
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
      await coursesStore.gotoNextCourse({
        filterId: newProvisionStore.feedBackItemDetails.item_id
      })
    }
  }
}
async function confirmSubmit() {
  const payload = {
    description: messageText.value,
    rating: rating.value
  }

  payload.event_id = coursesStore.feedBackItemDetails.event_id
    ? coursesStore.feedBackItemDetails.event_id
    : newProvisionStore.feedBackItemDetails.event_id

  await feedbackStore.submitProgress(payload)
  coursesStore.clearStoragePopup(false)
  await newProvisionStore.clearStoragePopupLab(false)

  if (coursesStore.feedBackItemDetails.feedback_completed || false) {
    router.push(`/portal/course-info/completed/${urlSafeBase64Decode(coursesStore.feedBackItemDetails.event_id)}/`)
  } else if (coursesStore.feedBackItemDetails.feedback_badge || false) {
    router.push(
      `/portal/course-info/completed/${urlSafeBase64Decode(coursesStore.feedBackItemDetails.event_id)}/${urlSafeBase64Decode(
        coursesStore.feedBackItemDetails.redirect_badge_id
      )}`
    )
  } else if (newProvisionStore.feedBackItemDetails.feedback_completed || false) {
    router.push(`/portal/course-info/completed/${urlSafeBase64Decode(newProvisionStore.feedBackItemDetails.event_id)}/`)
  } else if (newProvisionStore.feedBackItemDetails.feedback_badge || false) {
    router.push(
      `/portal/course-info/completed/${urlSafeBase64Decode(newProvisionStore.feedBackItemDetails.event_id)}/${urlSafeBase64Decode(
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
      await coursesStore.gotoNextCourse({
        filterId: coursesStore.feedBackItemDetails.item_id
      })
    } else {
      await coursesStore.gotoNextCourse({
        filterId: newProvisionStore.feedBackItemDetails.item_id
      })
    }
  }
}
</script>
