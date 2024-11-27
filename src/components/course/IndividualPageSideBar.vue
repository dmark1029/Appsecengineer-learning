<template>
  <div>
    <q-card>
      <q-card-section>
        <h4 class="appsec-h1-bold text-center">
          {{ coursesStore.courseHeaderData.name }}
        </h4>
        <q-separator />
        <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle" style="height: 100vh; max-width: 500px">
          <div v-for="courseContent in coursesStore.courseOutlineData" :key="courseContent.subject_id" class="q-pa-xs">
            <q-list>
              <q-expansion-item group="somegroup" default-opened class="appsec-h2" v-if="subjectId === courseContent.subject_id">
                <template v-slot:header>
                  <q-item-section class="appsec-h1">
                    {{ courseContent.subject_name }}
                  </q-item-section>

                  <q-item-section side>
                    <div class="row items-center appsec-h2">{{ courseContent.timerCourse }}</div>
                  </q-item-section>
                </template>

                <q-card>
                  <q-list class="menu-list" v-for="content in courseContent.items" :key="content.id">
                    <q-item @click="showAnotherPageContent(content.url, content.id)" style="cursor: pointer">
                      <q-item-section>
                        <q-item-label>
                          <p
                            class="text-left appsec-h2 primary"
                            style="width: 100%; overflow: hidden; word-break: break-all; text-overflow: ellipsis"
                            v-if="labId != content.id"
                          >
                            <template v-if="content.isCompleted">
                              <q-icon name="fas fa-check" size="xs" color="green" />
                            </template>
                            <template v-else>
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
                            </template>
                            <label class="ase-roboto ase-md ase-md-bold" style="text-align: justify; word-break: normal">
                              {{ content.name }}
                            </label>
                          </p>
                          <p
                            class="text-left appsec-h2 primary"
                            style="width: 100%; overflow: hidden; word-break: break-all; text-overflow: ellipsis; color: #21ba45"
                            v-if="labId === content.id"
                          >
                            <template v-if="content.isCompleted">
                              <q-icon name="fas fa-check" size="xs" color="green" />
                            </template>
                            <template v-else>
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
                            </template>
                            <label class="ase-roboto ase-md ase-md-bold" style="text-align: justify; word-break: normal">
                              {{ content.name }}
                            </label>
                          </p>
                          <q-item-label caption>
                            <p class="appsec-h2 text-bold">{{ content.itemTtl }}</p>
                          </q-item-label>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator spaced inset />
                  </q-list>
                </q-card>
              </q-expansion-item>
              <q-expansion-item group="somegroup" v-else>
                <template v-slot:header>
                  <q-item-section class="appsec-h1">
                    {{ courseContent.subject_name }}
                  </q-item-section>

                  <q-item-section side>
                    <div class="row items-center appsec-h2">{{ courseContent.timerCourse }}</div>
                  </q-item-section>
                </template>
                <q-card>
                  <q-list class="menu-list" v-for="content in courseContent.items" :key="content.id">
                    <q-item @click="showAnotherPageContent(content.url, content.id)" style="cursor: pointer">
                      <q-item-section>
                        <q-item-label>
                          <p
                            class="text-left appsec-h2 primary"
                            style="width: 100%; overflow: hidden; word-break: break-all; text-overflow: ellipsis"
                            v-if="labId != content.id"
                          >
                            <template v-if="content.isCompleted">
                              <q-icon name="fas fa-check" size="xs" color="green" />
                            </template>
                            <template v-else>
                              <q-icon name="fas fa-flask" size="14px" color="primary" v-if="content.type === 'lab'" />
                              <q-icon name="fas fa-video" size="14px" color="primary" v-if="content.type === 'vid'" />
                              <q-icon name="fas fa-question" size="14px" color="primary" v-if="content.type === 'quiz'" />
                              <q-icon name="fas fa-download" size="14px" color="primary" v-if="content.type === 'download'" />
                              <q-icon name="fas fa-photo-video" size="14px" color="primary" v-if="content.type === 'media'" />
                            </template>
                            <label class="ase-roboto ase-md ase-md-bold" style="text-align: justify; word-break: normal">
                              {{ content.name }}
                            </label>
                          </p>

                          <p
                            class="text-left appsec-h2 primary"
                            style="width: 190px; overflow: hidden; word-break: break-all; text-overflow: ellipsis; color: #21ba45"
                            v-if="labId === content.id"
                          >
                            <template v-if="content.isCompleted">
                              <q-icon name="fas fa-check" size="xs" color="green" />
                            </template>
                            <template v-else>
                              <q-icon name="fas fa-flask" size="14px" color="green" v-if="content.type === 'lab'" />
                              <q-icon name="fas fa-video" size="14px" color="green" v-if="content.type === 'vid'" />
                              <q-icon name="fas fa-question" size="14px" color="green" v-if="content.type === 'quiz'" />
                              <q-icon name="fas fa-download" size="14px" color="green" v-if="content.type === 'download'" />
                              <q-icon name="fas fa-photo-video" size="14px" color="green" v-if="content.type === 'media'" />
                            </template>
                            <label class="ase-roboto ase-md ase-md-bold" style="text-align: justify; word-break: normal">
                              {{ content.name }}
                            </label>
                          </p>
                          <q-item-label caption>
                            <p class="appsec-h2 text-bold">{{ content.itemTtl }}</p>
                          </q-item-label>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator spaced inset />
                  </q-list>
                </q-card>
              </q-expansion-item>
              <q-separator />
            </q-list>
          </div>
        </q-scroll-area>
      </q-card-section>
      <FeedbackPage
        v-model:show="coursesStore.feedBackStatus"
        v-model="messageText"
        v-model:rating="rating"
        @confirmClose="confirmClose"
        @confirmSubmit="confirmSubmit"
      ></FeedbackPage>
      <OverallFeedbackPage
        v-model="overViewFeedbackMessage"
        v-model:feedbackInfoOverview="feedbackStore.submitProgressMessage"
        v-model:ratingOverview="overViewFeedbackRating"
        v-model:showOverview="overViewFeedbackShow"
        @confirmCloseOverview="cancelOverviewFeedback"
        @confirmSubmitOverview="submitFeedbackOverview"
      ></OverallFeedbackPage>
    </q-card>
  </div>
</template>

<script setup>
import { QSpinnerFacebook, useQuasar } from 'quasar'
import { useCoursesStore } from 'src/store/pinia/courses'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'

import { useNewProvisionStore } from 'src/store/pinia/newProvision'
import { useFeedbackStore } from 'src/store/pinia/feedback'
import { defineComponent, shallowRef, ref, onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'

import FeedbackPage from 'components/feedback/feedBackCommentForm.vue'
import OverallFeedbackPage from 'components/feedback/feedbackOverallCourse.vue'

defineComponent({
  name: 'IndividualPageSideBar'
})

const props = defineProps({
  eventId: {
    required: false
  },
  id: {
    required: false
  },
  subjectId: {
    required: false
  }
})

const emit = defineEmits(['openPage'])

const router = useRouter()
const $q = useQuasar()

const feedbackStore = useFeedbackStore()
const coursesStore = useCoursesStore()
const newProvisionStore = useNewProvisionStore()
const thumbStyle = ref({
  right: '4px',
  borderRadius: '5px',
  backgroundColor: '#027be3',
  width: '5px',
  opacity: 0.75
})
const barStyle = ref({
  right: '2px',
  borderRadius: '9px',
  backgroundColor: '#027be3',
  width: '9px',
  opacity: 0.2
})
const labId = shallowRef(props.id)
const messageText = shallowRef('')
const rating = shallowRef(0)
const overViewFeedbackShow = shallowRef(false)
const overViewFeedbackMessage = shallowRef('')
const overViewFeedbackRating = shallowRef(0)

onBeforeMount(async () => {
  if (Object.entries(coursesStore.courseHeaderData).length === 0) {
    const data = {
      event_id: props?.eventId
    }
    await coursesStore.fetchCourse(data)
  }
})

watch(
  () => [feedbackStore.isLoading],
  () => {
    if (coursesStore.isLoading || feedbackStore.isLoading) {
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

function confirmClose(event) {
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
      coursesStore.gotoNextCourse({ filterId: coursesStore.feedBackItemDetails.item_id })
    } else {
      coursesStore.gotoNextCourse({ filterId: newProvisionStore.feedBackItemDetails.item_id })
    }
  }
}
async function confirmSubmit(event) {
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
</script>

<style scoped>
.q-item__section--side {
  padding-right: 3px !important;
}
.q-item__section--avatar {
  min-width: 26px !important;
}
</style>
