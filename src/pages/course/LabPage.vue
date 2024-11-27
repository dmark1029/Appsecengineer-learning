<template>
  <BaseCard
    class="br-4 row q-py-sm q-px-lg"
    :class="{ 'items-center justify-center': coursesStore.isLoading }"
    :style="{ minHeight: coursesStore.isLoading ? '80vh' : 'auto' }"
  >
    <ConfettiExplosion v-if="visible" :particleCount="300" :particleSize="20" :stageHeight="1000" :stageWidth="2000" :duration="8000" />

    <BaseComponentLoader :loading="coursesStore.isLoading">
      <div class="row full-width">
        <div :class="`col-12`">
          <HeaderSection :titleHead="coursesStore.courseInfo.name || ''" :progressInfo="coursesStore.courseInfo.progress_percent || 0" />
        </div>
        <div :class="`q-pa-xs col-${showMainSidebar ? 8 : 12} none-spacing`">
          <div class="q-mr-md">
            <BaseCard class="q-mb-lg br-2" :style="{ height: labStore.isLoading ? '15rem' : 'auto' }" bordered>
              <BaseComponentLoader :loading="labStore.isLoading">
                <LabPageContent
                  :id="param"
                  @hintData="showHintDialog"
                  @viewSolution="confirmOpenSolution"
                  @verifyLab="showVerifyLabFunction"
                />
              </BaseComponentLoader>
              <div v-if="!showMainSidebar" class="absolute" :style="{ right: 0, top: 0 }">
                <div class="bg-secondary cursor-pointer text-white" style="opacity: 0.7" @click="toggleSideBar()">
                  <q-icon size="lg" name="chevron_right" />
                </div>
              </div>
            </BaseCard>
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
            <IndividualPageSideBar
              :eventId="courseId"
              :id="param"
              :subjectId="subjectId"
              @closeSideBar="toggleSideBar()"
              @openPage="enableAnotherPage($event)"
            />
            <BaseInnerLoading :showing="labStore.isLoading" />
          </q-card>
        </div>
      </div>
    </BaseComponentLoader>
  </BaseCard>
  <BaseDialog v-model="dialogHint" persistent @escape-key="hintCancelPopup()" title="Hint" @close="hintCancelPopup">
    <q-card-section>
      <template v-if="labStore.challengeInfo.hints">
        <q-banner
          class="text-subtitle1 text-weight-medium ase-black-shade flex flex-center text-justify"
          v-if="labStore.challengeInfo.hints.length > 0"
        >
          <div class="text-subtitle1 ase-black-light ase-roboto padding_7">
            <BaseMarkdown
              v-if="labStore.challengeInfo.hints.at(getRandomArbitrary(0, labStore.challengeInfo.hints.length - 1))"
              :content="labStore.challengeInfo.hints.at(getRandomArbitrary(0, labStore.challengeInfo.hints.length - 1))"
              class="md-body"
            />
          </div>
        </q-banner>
        <q-banner class="q-pa-md" v-else>
          <div class="text-h6">No Hints provided</div>
        </q-banner>
      </template>
    </q-card-section>
  </BaseDialog>
  <BaseDialog v-model="isConfirm" persistent @escape-key="confirmCancel()" @close="confirmCancel" title="Solution">
    <q-card-section class="flex flex-center">
      <template>
        <q-banner class="q-pa-md">
          <div class="text-h6">
            Are you sure you want to see the solution?
            <br />
            w Make sure you try and solve it yourself first
          </div>
        </q-banner>
      </template>
    </q-card-section>
    <q-separator />
    <q-card-actions align="right">
      <div>
        <BaseBtn color="danger" @click="confirmCancel()">No, I want to try solving this myself</BaseBtn>
        <BaseBtn @click="confirmSendSolution()">Yes, I want to see it</BaseBtn>
      </div>
    </q-card-actions>
  </BaseDialog>
  <BaseDialog
    v-model="showVerify"
    persistent
    @escape-key="CancelVerifyLabFunction()"
    title="Enter Challenge Completion Code"
    @close="CancelVerifyLabFunction"
  >
    <q-form @submit="confirmSubmitVerifyLab">
      <q-card-section>
        <base-input
          v-model="verifyLabName"
          label="Code"
          :titleFalse="true"
          :maskType="''"
          :rules="[required, ...maxLength(150)]"
          placeholder="Please enter"
        />
        <p v-if="labStore.errorVerifyLab.token" class="text-caption text-negative">{{ labStore.errorVerifyLab.token_msg }}</p>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <div>
          <BaseBtn type="submit">Verify</BaseBtn>
        </div>
      </q-card-actions>
    </q-form>
  </BaseDialog>
  <BaseDialog v-model="showCongrats" persistent @escape-key="cancelCongrats()" title="Congrats" @close="cancelCongrats">
    <q-card-section class="padding_7">
      <div class="text-h6 text-center">Congrats! You've successfully completed the challenge</div>
    </q-card-section>
  </BaseDialog>
  <FeedbackPage
    :show="newProvisionStore.feedBackStatus && showWindow"
    v-model="messageText"
    v-model:rating="rating"
    @confirmClose="confirmClose"
    @confirmSubmit="confirmSubmit"
  />
</template>

<script setup>
import { googleAnalyticsFunction, urlSafeBase64Decode, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { maxLength, required } from 'src/utils/rules'

import useBreadcrumbs from 'src/composables/use-breadcrumb'
import { useFeedbackStore } from 'src/store/pinia/feedback'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useLabStore } from 'src/store/pinia/lab'
import { useNewProvisionStore } from 'src/store/pinia/newProvision'
import { defineComponent, shallowRef, ref, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import TabsSection from 'src/components/TabsInfo/LabTab.vue'
import LabPageContent from 'src/components/course/LabPageContent.vue'
import IndividualPageSideBar from 'src/components/course/RightIndividualPageSideBar.vue'
import FeedbackPage from 'src/components/feedback/feedBackCommentForm.vue'
import HeaderSection from 'src/pages/course/TitleHeader.vue'
import BaseMarkdown from 'components/shared/BaseMarkdown.vue'
import BaseComponentLoader from 'src/components/wrappers/BaseComponentLoader/index.vue'
import ConfettiExplosion from 'vue-confetti-explosion'

defineComponent({ name: 'LabPage' })

const verifyLabName = shallowRef('')
const typeConfirm = shallowRef('')
const isConfirm = shallowRef(false)
const isConfirmId = shallowRef('')
const showMainSidebar = shallowRef(true)
const dialogHint = shallowRef(false)
const showVerify = shallowRef(false)
const showCongrats = shallowRef(false)
const challengePayload = ref({})
const messageText = shallowRef('')
const rating = shallowRef(0)
const showWindow = shallowRef(false)
const param = shallowRef('')
const courseId = shallowRef('')
const subjectId = shallowRef('')
const visible = shallowRef(false)

const route = useRoute()
const router = useRouter()
const feedbackStore = useFeedbackStore()
const coursesStore = useCoursesStore()
const labStore = useLabStore()
const newProvisionStore = useNewProvisionStore()
const breadcrumbStore = useBreadcrumbs()

onBeforeMount(async () => {
  param.value = urlSafeBase64Decode(route.params.id)
  courseId.value = urlSafeBase64Decode(route.params.courseId)
  subjectId.value = urlSafeBase64Decode(route.params.subjectId)
  const dataLabIns = {
    lab_id: param.value,
    event_id: urlSafeBase64Decode(route.params.courseId)
  }
  if (!coursesStore.courseHeaderData.name) {
    await coursesStore.fetchCourse({
      event_id: urlSafeBase64Decode(route.params.courseId)
    })
  }
  await labStore.fetchLabInfo(dataLabIns)
  labStore.labInstructionStatus(true)
  await labStore.fetchLabInstructions(dataLabIns)
  newProvisionStore.resetMarkResponse('')
})

watch(verifyLabName, () => {
  labStore.errorMsgResetLab({
    token: false,
    token_msg: ''
  })
})

watch(
  () => labStore.listLabData,
  () => {
    if (labStore.listLabData.length > 0 && coursesStore.courseHeaderData.name) {
      document.title = `${coursesStore.courseHeaderData.name}: ${labStore.listLabData[0].name}` || 'Course Lab'
      const mapBreadcrumb = {
        challenge: {
          name: 'challenges',
          label: 'Challenges'
        },
        playground: {
          name: 'playgrounds',
          label: 'Playgrounds'
        }
      }

      const header = mapBreadcrumb[coursesStore.courseInfo?.event_status] ?? {
        name: 'courses',
        label: 'Courses'
      }
      breadcrumbStore.setBreadcrumb([
        header,
        {
          name: undefined,
          label: coursesStore.courseHeaderData.name
        }
      ])
      googleAnalyticsFunction({
        path: window.location.pathname,
        name: `${coursesStore.courseHeaderData.name}: ${labStore.listLabData[0].name}`
      })
    }
  }
)

async function enableAnotherPage(event) {
  const type = event.id.split('_')[0]
  if (type === 'lab') {
    if (window.location.hash.substring(1, 2000) !== event.url) {
      setTimeout(() => {
        router.replace(event.url)
      }, 500)
      // setTimeout(() => {
      //   router.go(event.url)
      // }, 1500)
    }
  }
  if (type === 'lab') {
    param.value = event.id
    const dataLabIns = {
      lab_id: event.id,
      event_id: urlSafeBase64Decode(route.params.courseId)
    }
    await labStore.fetchLabInfo(dataLabIns)
    labStore.labInstructionStatus(true)
    await labStore.fetchLabInstructions(dataLabIns)
  } else {
    await router.push(event.url)
  }
  await router.push(event.url)
}

function toggleSideBar() {
  showMainSidebar.value = !showMainSidebar.value
}

function getRandomArbitrary(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function validatorFunctionToCheck() {
  const statusLab = coursesStore.courseOutlineData
    .map((data) => data.items.filter((info) => info.type === 'lab' && info.id === urlSafeBase64Decode(route.params.id))[0])
    ?.filter((item) => item)

  if (statusLab.length > 0) {
    if (!statusLab[0].isCompleted) {
      await newProvisionStore.markTopicCompletedLab({
        event_id: urlSafeBase64Decode(route.params.courseId),
        item_id: param.value
      })
      await coursesStore.fetchCourse({ event_id: urlSafeBase64Decode(route.params.courseId) })
      if (newProvisionStore.feedBackStatus) {
        showWindow.value = true
      }
    }
    if (!newProvisionStore.markResponse) {
      await labStore.fetchLabInfo({
        lab_id: param.value,
        event_id: urlSafeBase64Decode(route.params.courseId)
      })
    }
  }
}

async function showHintDialog(data) {
  await labStore.fetchChallengeData(data)
  dialogHint.value = true
}

function hintCancelPopup() {
  dialogHint.value = false
}

function confirmOpenSolution(data) {
  challengePayload.value = data
  isConfirm.value = true
  typeConfirm.value = ''
}

function confirmCancel() {
  isConfirm.value = false
  typeConfirm.value = ''
  isConfirmId.value = ''
}

function showVerifyLabFunction() {
  verifyLabName.value = ''
  labStore.errorMsgResetLab({ status: false, status_msg: '', token: false, token_msg: '' })
  showVerify.value = true
}

function CancelVerifyLabFunction() {
  showVerify.value = false
}

async function confirmSubmitVerifyLab() {
  await labStore.verifyLabAction({
    token: verifyLabName.value,
    event_id: urlSafeBase64Decode(route.params.courseId),
    lab_id: param.value
  })
  if (labStore.statusOfApi) {
    showVerify.value = false
    validatorFunctionToCheck()
    setTimeout(() => {
      showCongrats.value = true
      visible.value = true
    }, 1000)
    setTimeout(() => {
      showCongrats.value = false
    }, 5000)
    setTimeout(() => (visible.value = false), 9000)
    if (labStore.listLabData[0].challenge_id) {
      setTimeout(() => {
        router.push(
          `/portal/solution/info/${urlSafeBase64Encode(labStore.listLabData[0].challenge_id)}/${route.params.courseId}/${route.params.id}/`
        )
      }, 6000)
    }
  }
}

function cancelCongrats() {
  showCongrats.value = false
}

async function confirmSendSolution() {
  await router.push(
    `/portal/solution/info/${urlSafeBase64Encode(challengePayload.value.challenge_id)}/${route.params.courseId}/${route.params.id}/`
  )
  isConfirm.value = false
  typeConfirm.value = ''
}

async function confirmClose() {
  rating.value = 0
  coursesStore.clearStoragePopup(false)
  newProvisionStore.clearStoragePopupLab(false)
  const countChallenge = coursesStore.courseOutlineData
    .map((data) => data.items.map((info) => (info.challenge ? true : null))[0])
    .filter(function (el) {
      return el != null
    })
  const totalItemsCount = coursesStore.courseOutlineData.map((data) => data.items.map((info) => info.type)).flatMap((num) => num).length
  if (newProvisionStore.feedback_completed || false) {
    if (countChallenge.length === 1 && totalItemsCount === 1) {
    } else {
      router.push(`/portal/course-info/completed/${urlSafeBase64Encode(newProvisionStore.feedBackStatus.event_id)}/`)
    }
  } else if (newProvisionStore.feedBackItemDetails.feedback_badge || false) {
    if (countChallenge.length === 1 && totalItemsCount === 1) {
    } else {
      router.push(
        `/portal/course-info/completed/${urlSafeBase64Encode(newProvisionStore.feedBackItemDetails.event_id)}/${urlSafeBase64Encode(
          newProvisionStore.feedBackItemDetails.redirect_badge_id
        )}`
      )
    }
  } else if (
    newProvisionStore.feedBackItemDetails.item_id &&
    (!newProvisionStore.feedBackItemDetails.manual || newProvisionStore.feedBackItemDetails.item_id.includes('lab_'))
  ) {
    if (newProvisionStore.feedBackItemDetails.item_id) {
      await coursesStore.gotoNextCourse({ filterId: newProvisionStore.feedBackItemDetails.item_id })
    }
  }
}

async function confirmSubmit() {
  await feedbackStore.submitProgress({
    description: messageText.value,
    rating: rating.value,
    event_id: urlSafeBase64Decode(route.params.courseId)
  })
  coursesStore.clearStoragePopup(false)
  await newProvisionStore.clearStoragePopupLab(false)
  if (newProvisionStore.feedBackItemDetails.feedback_completed || false) {
    router.push(`/portal/course-info/completed/${urlSafeBase64Encode(newProvisionStore.feedBackItemDetails.event_id)}/`)
  } else if (newProvisionStore.feedBackItemDetails.feedback_badge || false) {
    router.push(
      `/portal/course-info/completed/${urlSafeBase64Encode(newProvisionStore.feedBackItemDetails.event_id)}/${urlSafeBase64Encode(
        newProvisionStore.feedBackItemDetails.redirect_badge_id
      )}`
    )
  } else if (
    newProvisionStore.feedBackItemDetails.item_id &&
    (!newProvisionStore.feedBackItemDetails.manual || newProvisionStore.feedBackItemDetails.item_id.includes('lab_'))
  ) {
    await coursesStore.gotoNextCourse({ filterId: newProvisionStore.feedBackItemDetails.item_id })
  }
}
</script>

<style scoped>
.overflow_scroll {
  height: 100%;
  overflow-y: scroll;
}
</style>
