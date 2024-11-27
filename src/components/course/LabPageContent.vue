<template>
  <div class="row full-width">
    <div class="col q-pa-md">
      <div v-for="lab in labStore.listLabData" :key="lab.id">
        <div class="row">
          <div class="col-sm-8" style="margin-top: 1%; padding-left: 1%">
            <div class="text-subtitle1 text-weight-bold ase-roboto ase-black-shade none-spacing">
              {{ lab.name }}
              <q-badge v-if="lab.challenge_id" size="xs" color="#12142D">Challenge</q-badge>
            </div>
          </div>
          <div class="col-sm-4" style="margin-top: 1%; padding-right: 1%">
            <BaseBtn class="float-right" @click="accessLabRules()" dense>Prohibited activities</BaseBtn>
            <div v-if="lab.is_alive && !delayLoadLabTime" class="float-right" style="display: inline-block; padding: 7px" align="right">
              <OnlyTimer
                align="right"
                :starttime="lab.created_on"
                :endtime="lab.running_ttl"
                :running_instance_id="lab.running_instance_id"
                :instance_id="lab.instance_id"
                :labInfo="lab"
              />
            </div>
          </div>
        </div>
        <div class="row items-center q-gutter-x-lg q-mt-md">
          <div class="" v-if="!lab.is_alive || delayLoadLabTime">
            <q-toggle label="Enable Authentication" v-model="enableAuth" val="green" color="blue-12" />
          </div>
          <div v-if="!lab.is_alive || delayLoadLabTime">
            <q-btn
              v-if="!lab.is_alive || delayLoadLabTime"
              :disable="disableProvision || newProvisionStore.isServerProvisioned || addLongDelay"
              color="green-12"
              @click="provisionLab(lab.id, lab)"
              :label="disableProvision || newProvisionStore.isServerProvisioned || addLongDelay ? 'Starting Lab...' : 'Start Lab'"
              padding="3px 14px"
            >
              <template v-if="disableProvision || newProvisionStore.isServerProvisioned || addLongDelay">
                <q-spinner-hourglass class="on-left" />
              </template>
            </q-btn>
          </div>
        </div>
        <div class="col-sm-12 col-md-12 q-gutter-lg q-my-md" v-if="lab.challenge_id">
          <BaseBtn color="green-12" @click="$emit('hintData', { challenge_id: lab.challenge_id })">See Hint</BaseBtn>
          <BaseBtn
            @click="$emit('verifyLab', { challenge_id: lab.challenge_id })"
            outline
            :text-color="$q.dark.isActive ? 'white' : 'grey-9'"
          >
            Enter Challenge Completion Code
          </BaseBtn>
        </div>
        <div class="row" v-if="lab.is_alive && !delayLoadLabTime">
          <div class="col-6">
            <div style="display: inline-block; padding-left: 2%">
              <BaseBtn
                :disable="newProvisionStore.isServerDeleted"
                size="md"
                @click="stopLab(lab.running_instance_id, lab.instance_id, lab)"
                class="text-subtitle2 text-weight-regular ase-roboto float-right"
                text-color="white"
                :label="newProvisionStore.isServerProvisioned ? 'Closing Lab...' : 'End Lab'"
              >
                <template v-if="newProvisionStore.isServerProvisioned">
                  <q-spinner-hourglass class="on-left" />
                </template>
              </BaseBtn>
            </div>
            <div style="display: inline-block; padding-left: 2%">
              <BaseBtn
                v-if="lab.password"
                color="green"
                size="md"
                @click="accessAuthenticatedLab(lab.dns_pass_entry, lab.password)"
                :label="'Access Lab'"
                class="text-subtitle2 text-weight-regular ase-roboto float-right"
              />
              <BaseBtn
                v-if="!lab.password"
                color="green"
                size="md"
                @click="accessLab(lab.dns_entry)"
                class="text-subtitle2 text-weight-regular ase-roboto float-right"
                text-color="white"
                :label="'Access Lab'"
              />
            </div>
          </div>
          <div class="col">
            <div class="row" v-if="lab.password">
              <div class="col-6">
                <q-input bottom-slots v-model="labUsername" filled label="Username" disable dense>
                  <template v-slot:after>
                    <q-icon name="fas fa-copy" class="text-green" style="cursor: pointer" @click="copyUsername(labUsername)" />
                  </template>
                </q-input>
              </div>
              <div class="col-6">
                <q-input bottom-slots v-model="labPassword" filled label="Password" disable dense style="margin-left: 2%">
                  <template v-slot:after>
                    <q-icon name="fas fa-copy" class="text-green" style="cursor: pointer" @click="copyPassword(lab.password)" />
                  </template>
                </q-input>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-if="lab.is_alive">
          <div class="col-4"></div>
          <div class="col">
            <div class="row" v-if="awsProvisionStore.accountInfo.url" style="margin-top: 5%">
              <div class="col">
                <q-card>
                  <q-card-section class="bg-primary text-white">
                    <div class="text-h6">Cloud Credentials</div>
                  </q-card-section>
                  <q-separator />
                  <div class="row" v-if="awsProvisionStore.accountInfo.url">
                    <div class="col">
                      <q-input bottom-slots v-model="labPassword" filled label="URL" disable dense>
                        <template v-slot:after>
                          <q-icon
                            name="fas fa-external-link-alt"
                            class="text-green"
                            style="cursor: pointer"
                            @click="openCloudUrl(awsProvisionStore.accountInfo.url)"
                          />
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="row" v-if="awsProvisionStore.accountInfo.username">
                    <div class="col-6">
                      <q-input bottom-slots v-model="labUsername" filled label="Username" disable dense>
                        <template v-slot:after>
                          <q-icon name="fas fa-copy" class="text-green" style="cursor: pointer" @click="copyUsername(labUsername)" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-6">
                      <q-input bottom-slots v-model="labPassword" filled label="Password" disable dense style="margin-left: 2%">
                        <template v-slot:after>
                          <q-icon
                            name="fas fa-copy"
                            class="text-green"
                            style="cursor: pointer"
                            @click="copyPassword(awsProvisionStore.accountInfo.password)"
                          />
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="row" v-if="awsProvisionStore.accountInfo.access_key">
                    <div class="col-6">
                      <q-input bottom-slots v-model="labPassword" filled label="AccessKey" disable dense>
                        <template v-slot:after>
                          <q-icon
                            name="fas fa-copy"
                            class="text-green"
                            style="cursor: pointer"
                            @click="copyAccessKey(awsProvisionStore.accountInfo.access_key)"
                          />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-6">
                      <q-input bottom-slots v-model="labPassword" filled label="SecretKey" disable dense style="margin-left: 2%">
                        <template v-slot:after>
                          <q-icon
                            name="fas fa-copy"
                            class="text-green"
                            style="cursor: pointer"
                            @click="copySecretKey(awsProvisionStore.accountInfo.secret_key)"
                          />
                        </template>
                      </q-input>
                    </div>
                  </div>
                </q-card>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-if="getServerProgressLocal.length > 0">
          <div class="col" v-for="progress in getServerProgressLocal" v-bind:key="progress.id">
            <q-linear-progress
              stripe
              rounded
              size="16px"
              :value="progress.progress / 100"
              color="myColor"
              v-if="progress.progress"
              class="q-mt-sm"
            >
              <div class="absolute-full flex flex-center">
                <p class="text-caption text-white text-weight-bold ase-roboto ase-black-shade none-spacing">{{ progress.message }}</p>
              </div>
            </q-linear-progress>
          </div>
        </div>
        <div v-if="getServerProgressLocal.length > 0" style="margin-top: 2%" class="row">
          <div class="col text-center">
            <p class="text-caption text-weight-bold ase-roboto red none-spacing">
              Please do not leave the page or refresh the page while server provisioning.
            </p>
          </div>
        </div>
        <q-card-section class="none-spacing" v-if="(lab.challenge_id && lab.url_badge) || newProvisionStore.markResponse">
          <ChallengeBadge :shareId="lab.url_badge || newProvisionStore.markResponse" />
        </q-card-section>
      </div>
    </div>
    <Delete
      v-if="isDelete"
      :show="isDelete"
      :header="'you want to End this lab'"
      :loading="isDeleting"
      @confirmDelete="labConfirmDeletion($event)"
      @confirmDeleteCancel="labConfirmDeleteCancel($event)"
    />
    <BaseDialog v-model="labRulesPopup" persistent @escape-key="confirmRulesCancel()" title="Disclaimer" @close="confirmRulesCancel">
      <q-list class="q-pa-md">
        <q-item class="" v-for="item in disclaimerRules" :key="item">
          <div class="text-subtitle1">
            {{ item }}
          </div>
        </q-item>
      </q-list>
    </BaseDialog>
    <q-dialog v-model="showInsufficientTimeForLab">
      <q-card style="width: 600px; max-width: 70vw; padding: 7px">
        <q-card-section>
          <template v-if="isTrial">
            <div>
              <q-card-section>
                <div class="text-h6 text-center">Upgrade to premium</div>
              </q-card-section>

              <q-card-section class="q-pt-none text-center text-link" @click="redirectPricingPage">Click here to subscribe</q-card-section>
            </div>
          </template>
          <template v-else>
            <q-card-section>
              <div class="text-h6 text-center ase-lg">
                You don't have enough lab minutes to provision the lab. Please contact Administrator.
              </div>
            </q-card-section>
          </template>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn v-close-popup class="bg-deep-orange" color="white" flat size="sm">Cancel</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { copyToClipboard, QSpinnerFacebook, LocalStorage, useQuasar } from 'quasar'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { useLoginStore } from 'src/store/pinia/login'
import { computed, defineComponent, ref, shallowRef, watch } from 'vue'
import { BaseBtn } from '../wrappers/BaseBtn'
import { useProfileStore } from 'src/store/pinia/profile'
import { useNewProvisionStore } from 'src/store/pinia/newProvision'
import { useAwsProvisionStore } from 'src/store/pinia/awsProvision'
import { useLabStore } from 'src/store/pinia/lab'
import { useLabProvisionStore } from 'src/store/pinia/labProvision'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useRoute } from 'vue-router'
import { useUserActivity } from 'src/store/pinia/userActivity'

import OnlyTimer from 'src/components/countdown/OnlyTimer.vue'
import ChallengeBadge from 'src/components/course/ChallengeBadge.vue'
import Delete from 'src/components/shared/Delete.vue'
import { getTimePassedInPercentage } from 'src/utils/dateHelper'

defineComponent({ name: 'LabPageContent' })

const props = defineProps({
  id: { required: false },
  eventId: { required: false }
})

const addLongDelay = shallowRef(false)
const enableAuth = shallowRef(false)
const delayLoadLabTime = shallowRef(false)
const isDelete = shallowRef(false)
const labPassword = shallowRef('******')
const labUsername = shallowRef('appsecengineer')
const labRulesPopup = shallowRef(false)
const provisionLabStatus = shallowRef(true)
const disableProvision = shallowRef(false)
const showInsufficientTimeForLab = shallowRef(false)
const runningInstanceId = shallowRef('')
const instanceId = shallowRef('')
const isDeleting = shallowRef(false)

const getServerProgressLocal = ref([])
const markingStatusInfo = ref({})
const disclaimerRules = ref([
  'Using automated scanners',
  'Using brute force attacks',
  'Denial of Service attacks',
  'Attacking other student machines in challenges where you might achieve a shell on the vulnerable system',
  'Attacking the lab infrastructure',
  'Users violating the above will be either temporarily or permanently banned from the website.',
  'If you are unsure about an activity, then please contact support Help@appsecengineer.com to confirm that it is allowed on our website.'
])

const $q = useQuasar()
const route = useRoute()

const awsProvisionStore = useAwsProvisionStore()
const profileStore = useProfileStore()
const loginStore = useLoginStore()
const labStore = useLabStore()
const newProvisionStore = useNewProvisionStore()
const labProvisionStore = useLabProvisionStore()
const coursesStore = useCoursesStore()
const userActivity = useUserActivity()

watch(
  () => newProvisionStore.isServerDeleted,
  () => {
    if (newProvisionStore.isServerDeleted) {
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

const isTrial = computed(() => {
  return loginStore.isTrial
})

async function copyUsername(name) {
  try {
    await copyToClipboard(name)
    $q.notify({
      message: 'Username has been successfully copied',
      color: 'green',
      position: 'top'
    })
  } catch (error) {
    $q.notify({
      message: 'Not able to copy',
      color: 'red',
      position: 'top'
    })
  }
}
async function copyPassword(password) {
  try {
    await copyToClipboard(password)
    $q.notify({
      message: 'Password has been successfully copied',
      color: 'green',
      position: 'top'
    })
  } catch (error) {
    $q.notify({
      message: 'Not able to copy',
      color: 'red',
      position: 'top'
    })
  }
}
async function copyAccessKey(password) {
  try {
    await copyToClipboard(password)
    $q.notify({
      message: 'AccessKey has been successfully copied',
      color: 'green',
      position: 'top'
    })
  } catch (error) {
    $q.notify({
      message: 'Not able to copy',
      color: 'red',
      position: 'top'
    })
  }
}
async function copySecretKey(password) {
  try {
    await copyToClipboard(password)
    $q.notify({
      message: 'SecretKey has been successfully copied',
      color: 'green',
      position: 'top'
    })
  } catch (error) {
    $q.notify({
      message: 'Not able to copy',
      color: 'red',
      position: 'top'
    })
  }
}

async function provisionLab(id, labData) {
  userActivity.disableActivity()
  addLongDelay.value = true
  await fetchUsedMinutes()
  const data = {
    lab_id: id,
    event_id: urlSafeBase64Decode(route.params.courseId),
    auth: enableAuth.value,
    cloud_type: labStore.listLabData[0]?.cloud_type
  }

  try {
    const status = await labProvisionStore.startProvisioner(data)
    getServerProgressLocal.value = [
      {
        progress: 10,
        message: status.message
      }
    ]

    if (status.success) {
      let progressStatus = await labProvisionStore.progressProvisioner({ lab_id: id, event_id: data.event_id })

      for (let i = 1; i < 10; i++) {
        if (progressStatus.response) {
          if (progressStatus.response.status === 500) {
            await resetData()
            $q.notify({
              type: 'negative',
              position: 'top',
              progress: true,
              icon: 'warning',
              message: status.response.data.message
            })
            break
          } else if (progressStatus.response.status === 400 && i === 9) {
            await resetData()
            $q.notify({
              type: 'negative',
              position: 'top',
              progress: true,
              icon: 'warning',
              message: 'Something went wrong'
            })
            break
          } else if (progressStatus.response.status === 400) {
            getServerProgressLocal.value = [
              {
                progress: 50 * (i * 0.5),
                message: progressStatus.response.data.data.status || progressStatus.response.data.message
              }
            ]
          }
        }

        await delay(8000)

        progressStatus = await labProvisionStore.progressProvisioner({ lab_id: id, event_id: data.event_id })

        if (progressStatus.success) {
          getServerProgressLocal.value = [
            {
              progress: 99,
              message: progressStatus.data.status
            }
          ]
          await delay(10000)
          await resetData()
          await labStore.fetchLabInfo({ lab_id: id, event_id: data.event_id })
          userActivity.enableActivity()
          break
        }

        if (i === 8) {
          await delay(4000)
        }
      }
    } else {
      await resetData()
      if (status.response) {
        $q.notify({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: status.response.data.message
        })
      }
    }
  } catch (er) {
    await resetData()
  } finally {
    userActivity.isActivityDisabled && userActivity.enableActivity()
    addLongDelay.value = false
  }
}

async function delay(ms) {
  addLongDelay.value = true
  return await new Promise((resolve) => setTimeout(resolve, ms))
}
async function resetData(time = 4000) {
  disableProvision.value = false
  delayLoadLabTime.value = false
  getServerProgressLocal.value = []
  addLongDelay.value = true
  await new Promise((resolve) => {
    setTimeout(() => {
      addLongDelay.value = false
      resolve()
    }, time)
  })
}

function accessLab(url) {
  window.open(url, '_blank')
}
function openCloudUrl(url) {
  window.open(url, '_blank')
}
function accessAuthenticatedLab(dns, password) {
  const url = 'https://appsecengineer:' + password + '@' + dns
  window.open(url, '_blank')
}
function redirectPricingPage() {
  const url = `${window.location.origin}/`

  if (LocalStorage.getItem('type') === 'Teams') {
    url += 'subscription-expired'
  } else if (LocalStorage.getItem('type') === 'IND') {
    url += 'individual-subscription-expired'
  } else {
    url += 'individual-subscription-expired'
  }

  window.open(url, '_blank')
}
function stopLab(running_instance_id, instance_id, labInfo) {
  isDelete.value = true
  runningInstanceId.value = ''
  runningInstanceId.value = running_instance_id
  instanceId.value = ''
  instanceId.value = instance_id
  markingStatusInfo.value = {
    event_id: labInfo.event_id,
    item_id: labInfo.id
  }
}

async function labConfirmDeletion(event) {
  isDeleting.value = true
  if (event.show) {
    const data = {
      server_id: runningInstanceId.value,
      server_instance_id: instanceId.value
    }
    if (labStore.listLabData[0].is_cloud) {
      data.cloud_type = labStore.listLabData[0].cloud_type
    }

    const passedPercentage = getTimePassedInPercentage(labStore.listLabData[0]?.created_on ?? 0, labStore.listLabData[0]?.running_ttl ?? 0)
    const isHalfCompleted = passedPercentage >= 50

    if (!labStore.listLabData[0].challenge_id && isHalfCompleted) {
      await newProvisionStore.markTopicCompletedLab(markingStatusInfo.value)
      await coursesStore.fetchCourse({ event_id: urlSafeBase64Decode(route.params.courseId) })
    }

    await newProvisionStore.deleteLabServer(data)
    isDelete.value = false
    const dataLabIns = {
      lab_id: props.id,
      event_id: urlSafeBase64Decode(route.params.courseId)
    }
    // if (newProvisionStore.markLab && (labStore.listLabData[0] ? !labStore.listLabData[0].challenge_id : true)) {
    //   await newProvisionStore.markTopicCompletedLab(markingStatusInfo.value)
    //   await coursesStore.fetchCourse({ event_id: urlSafeBase64Decode(route.params.courseId) })
    // }
    if (!newProvisionStore.feedBackStatus) {
      await labStore.fetchLabInfo(dataLabIns)
      labStore.labInstructionStatus(true)
      await labStore.fetchLabInstructions(dataLabIns)
      await coursesStore.gotoNextCourse({ filterId: markingStatusInfo.value.item_id })
    }
    await resetData()
  }
  isDeleting.value = false
}

function labConfirmDeleteCancel(event) {
  if (event.show) {
    isDelete.value = false
  }
}

function accessLabRules() {
  labRulesPopup.value = true
}

function confirmRulesCancel() {
  labRulesPopup.value = false
}

async function fetchUsedMinutes() {
  await profileStore.fetchProfileDetailedInformation(false)
  if (Number(profileStore.profileDetailedInfo.monthly_minutes) - Number(profileStore.profileDetailedInfo.used_minutes) <= 6) {
    provisionLabStatus.value = false
    showInsufficientTimeForLab.value = true
  } else {
    provisionLabStatus.value = true
  }
}
</script>

<style scoped>
ul.disclimarStyle {
  position: relative;
  list-style: none;
  margin-left: 0;
  padding-left: 1.2em;
}
ul.disclimarStyle li:before {
  content: '*';
  position: absolute;
  left: 0;
}
.text-myColor {
  color: #489dc7;
}
</style>
