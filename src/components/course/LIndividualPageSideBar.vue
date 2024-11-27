<template>
  <div>
    <q-list>
      <q-expansion-item
        v-for="(item, index) in coursesStore.courseOutlineData"
        :label="item.id"
        switch-toggle-side
        style="background-color: #f6f9fa; border-bottom: 1px solid #d8d8d8"
        :key="index"
        icon="perm_identity"
        dense-toggle
      >
        <template v-slot:header>
          <q-item-section>
            <p class="text-subtitle1 text-weight-bold ase-roboto ase-black-shade none-spacing">
              {{ item.subject_name }}
            </p>
          </q-item-section>
          <q-item-section side>
            <div>
              <p class="text-caption text-weight-bold ase-roboto ase-black-light none-spacing">{{ item.timerCourse }}</p>
            </div>
          </q-item-section>
        </template>

        <q-card-section>
          <q-card>
            <q-list class="menu-list" v-for="content in item.items" :key="content.id">
              <q-item clickable v-ripple @click="showAnotherPageContent(content.url, content.id)">
                <q-item-section>
                  <q-item-label>
                    <p
                      class="text-left portal_sm ase-roboto"
                      style="overflow: hidden; word-break: break-all; text-overflow: ellipsis; line-height: 1.1; margin: 0px; padding: 0px"
                    >
                      <span>
                        <q-icon
                          style="padding-right: 1%"
                          :name="content.isCompleted ? 'check_circle' : 'play_circle_filled'"
                          size="14px"
                          :color="content.isCompleted ? 'green' : 'deep-orange-6'"
                        />
                      </span>
                      <q-icon
                        style="display: inline-block; padding-right: 7px; color: #6b6b6b"
                        name="fas fa-flask"
                        size="14px"
                        v-if="content.type === 'lab'"
                      />
                      <q-icon
                        style="display: inline-block; padding-right: 7px; color: #6b6b6b"
                        name="fas fa-video"
                        size="14px"
                        v-if="content.type === 'vid'"
                      />
                      <q-icon
                        style="display: inline-block; padding-right: 7px; color: #6b6b6b"
                        name="fas fa-question"
                        size="14px"
                        v-if="content.type === 'quiz'"
                      />
                      <q-icon
                        style="display: inline-block; padding-right: 7px; color: #6b6b6b"
                        name="fas fa-download"
                        size="14px"
                        v-if="content.type === 'download'"
                      />
                      <q-icon
                        style="display: inline-block; padding-right: 7px; color: #6b6b6b"
                        name="fas fa-photo-video"
                        size="14px"
                        v-if="content.type === 'media'"
                      />
                      <label class="ase-roboto ase-md ase-md-bold" style="text-align: justify; word-break: normal">
                        {{ content.name }}
                      </label>
                      <q-badge class="float-right" v-if="content.challenge" align="right" size="xs" color="#12142D">Challenge</q-badge>
                    </p>
                    <div v-if="content.itemTtl !== '0:00'" style="padding-left: 2.5%; padding-top: 1%">
                      <p class="text-caption text-weight-bold ase-roboto ase-black-light none-spacing line_height_normal">
                        {{ content.itemTtl }}
                      </p>
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator spaced inset />
            </q-list>
          </q-card>
        </q-card-section>
      </q-expansion-item>
      <q-separator />
    </q-list>
    <FeedbackPage
      :show="coursesStore.feedBackStatus"
      v-model="messageText"
      v-model:rating="rating"
      @confirmClose="confirmClose"
      @confirmSubmit="confirmSubmit"
    />
    <OverallFeedbackPage
      v-model:showOverview="overViewFeedbackShow"
      v-model="overViewFeedbackMessage"
      v-model:feedbackInfoOverview="feedbackStore.submitProgressMessage"
      v-model:ratingOverview="overViewFeedbackRating"
      @confirmCloseOverview="cancelOverviewFeedback"
      @confirmSubmitOverview="submitFeedbackOverview"
    />
  </div>
</template>

<script setup>
import { QSpinnerFacebook, useQuasar } from 'quasar'
import { useCoursesStore } from 'src/store/pinia/courses'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'

import { useNewProvisionStore } from 'src/store/pinia/newProvision'
import { useFeedbackStore } from 'src/store/pinia/feedback'
import { defineComponent, onBeforeMount, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'

import FeedbackPage from 'components/feedback/feedBackCommentForm.vue'
import OverallFeedbackPage from 'components/feedback/feedbackOverallCourse.vue'

defineComponent({
  name: 'LIndividualPageSideBar'
})

const props = defineProps({
  eventId: { required: false },
  id: { required: false },
  subjectId: { required: false }
})

const emit = defineEmits(['openPage'])

const $q = useQuasar()
const router = useRouter()

const coursesStore = useCoursesStore()
const newProvisionStore = useNewProvisionStore()
const feedbackStore = useFeedbackStore()

const labId = shallowRef(props.id)
const messageText = shallowRef('')
const overViewFeedbackMessage = shallowRef('')
const overViewFeedbackRating = shallowRef(0)
const overViewFeedbackShow = shallowRef(false)
const rating = shallowRef(0)

onBeforeMount(async () => {
  if (Object.entries(coursesStore.courseHeaderData).length === 0) {
    const data = {
      event_id: props?.eventId
    }
    await coursesStore.fetchCourse(data)
  }
})

watch(
  () => [coursesStore.isLoading, feedbackStore.isLoading],
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

async function showAnotherPageContent(url, id) {
  labId.value = ''
  labId.value = id
  if (id) {
    emit('openPage', { show: true, url, id })
  }
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
async function confirmSubmit() {
  if (!messageText.value && !rating.value) {
    $q.notify({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Please enter a valid details' })
  } else if (!rating.value) {
    $q.notify({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Please rate the course' })
  } else if (!messageText.value) {
    $q.notify({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Please provide description' })
  } else {
    const payload = {
      description: messageText,
      rating: rating
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
}
</script>

<style scoped>
.q-item__section--side {
  padding-right: 3px !important;
}

.q-item__section--avatar {
  min-width: 26px !important;
}
</style>
