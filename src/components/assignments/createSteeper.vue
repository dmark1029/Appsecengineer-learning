<template>
  <BaseCard transition-show="flip-up" transition-hide="flip-down" class="br-4">
    <q-stepper v-model="step" ref="stepper" color="primary" vertical animated>
      <q-step
        :name="1"
        title="Create Assignment"
        icon="settings"
        :done="step > 1"
        :color="step > 1 ? ($q.dark.isActive ? 'white' : 'indigo-8') : 'primary'"
      >
        <div class="row q-ma-lg justify-center">
          <template v-if="$route.params?.type === 'test'">
            <div class="col-sm-4 q-pa-lg">
              <q-card
                class="q-pa-lg flex text-weight-bold flex-center cursor-pointer radius-8"
                :class="{ activeDiv: stepType === 'challenge' }"
                @click="redirectSecondStep('challenge')"
              >
                <div class="text-subtitle1">Tournament assignment</div>
              </q-card>
            </div>
            <div class="col-sm-4 q-pa-lg">
              <q-card
                class="q-pa-lg flex text-weight-bold flex-center cursor-pointer radius-8"
                :class="{ activeDiv: stepType === 'interview' }"
                @click="redirectSecondStep('interview')"
              >
                <div class="text-subtitle1">Interview assignment</div>
              </q-card>
            </div>
          </template>
          <div class="col-sm-4 q-pa-lg" v-if="$route.params?.type === 'course'">
            <q-card
              class="q-pa-lg flex text-weight-bold flex-center cursor-pointer radius-8"
              :class="{ activeDiv: stepType === 'course' }"
              @click="redirectSecondStep('course')"
            >
              <div class="text-subtitle1">Course assignment</div>
            </q-card>
          </div>
          <div class="col-sm-4 q-pa-lg" v-if="$route.params?.type === 'journey'">
            <q-card
              class="q-pa-lg flex text-weight-bold flex-center cursor-pointer radius-8"
              :class="{ activeDiv: stepType === 'journey' }"
              @click="redirectSecondStep('journey')"
            >
              <div class="text-subtitle1">Journey assignment</div>
            </q-card>
          </div>
        </div>
      </q-step>

      <q-step :name="2" title="Form Data" icon="create_new_folder" color="primary" :disable="!stepType">
        <div class="row">
          <div class="col-sm-12" v-if="['course', 'journey'].includes(stepType)">
            <CreateCourseAssignment :isJourney="stepType === 'journey'" />
          </div>
          <div class="col-sm-12" v-if="stepType === 'challenge'">
            <CreateChallengeAssignment @submit="step = 3" />
          </div>
          <div class="col-sm-12" v-if="stepType === 'interview'">
            <CreateInterviewAssignment />
          </div>
        </div>
      </q-step>

      <q-step :name="3" icon="assignment" title="Attach Challenge" :color="step === 3 ? 'primary' : 'primary'" :disable="!stepType">
        <AttachChallenge />
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation class="q-pa-lg">
          <BaseBtn v-if="step > 1" icon="keyboard_arrow_left" no-caps color="primary" @click="$refs.stepper.previous()" />
          <q-btn v-if="step === 1" push class="ase-roboto ase-md" icon="keyboard_arrow_left" no-caps color="primary" @click="goBack()" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </BaseCard>
</template>

<script setup>
import CreateChallengeAssignment from 'components/assignments/challengeAssignment.vue'
import CreateCourseAssignment from 'components/assignments/courseAssignment.vue'
import CreateInterviewAssignment from 'components/assignments/interviewAssignment.vue'
import AttachChallenge from 'components/assignments/AttachChallenge.vue'

import { useQuasar } from 'quasar'

import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useAssignmentStore } from 'src/store/pinia/assignment'
import { defineComponent, onBeforeMount, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineComponent({
  name: 'CreateStepper'
})

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const companyUserTeamStore = useCompanyUserTeamsStore()
const assignmentStore = useAssignmentStore()

const stepType = shallowRef(route.params.type === 'test' ? '' : route.params.type)
const step = shallowRef(1)

onBeforeMount(() => {
  if (['course', 'journey'].includes(stepType.value)) {
    redirectSecondStep(stepType.value)
  }
})

function goBack() {
  if (stepType.value === 'course') {
    router.push({ name: 'company.assignments.course' })
  } else router.push({ name: 'company.assignments.tests' })
}

async function redirectSecondStep(value) {
  stepType.value = value

  if (stepType.value !== 'interview') {
    if (companyUserTeamStore.teamList.length === 0) {
      companyUserTeamStore.fetchCompanyTeams({})
    }
    if (companyUserTeamStore.listOfUsers.length === 0) {
      companyUserTeamStore.allUsersList({ users: { all: true } })
    }
  }

  if (value === 'course') {
    assignmentStore.setErrorAssignment({
      status: false,
      name: false,
      name_msg: '',
      challenges: false,
      challenges_msg: '',
      start_date: false,
      start_date_msg: '',
      end_date: false,
      end_date_msg: '',
      teams: false,
      teams_msg: ''
    })
  }
  step.value = 2
}
</script>

<style scoped>
.activeDiv {
  background: #303f9f;
  color: #fff;
}
</style>
