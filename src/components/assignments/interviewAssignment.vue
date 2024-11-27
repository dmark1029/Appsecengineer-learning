<template>
  <q-card transition-show="flip-up" transition-hide="flip-down">
    <q-card-section class="bg-grey-2 text-primary">
      <q-bar class="bg-grey-2 none-spacing">
        <div class="text-subtitle2" color="primary">{{ id ? 'Update Interview Assignment' : 'Interview Assignment' }}</div>
        <q-space />
        <slot name="closeBtn"></slot>
      </q-bar>
    </q-card-section>
    <q-form greedy @submit.prevent="onSubmit()">
      <q-card-section class="q-pa-lg">
        <q-list class="row">
          <slot name="selectDropdown"></slot>
          <q-item class="col-12">
            <q-item-section>
              <BaseInput
                :disable="Boolean(stateDisabled)"
                label="Name *"
                :maxlength="50"
                placeholder="Example: Interview for Security Engineer"
                required
                :rules="[...minLength(2), ...maxLength(50), (val) => !usedNames.includes(val) || 'Name already exists']"
                v-model="assignmentObjChallenge.name"
              />
              <p v-if="assignmentStore.errorAssignment.name" class="text-caption text-negative">
                {{ assignmentStore.errorAssignment.name_msg }}
              </p>
            </q-item-section>
          </q-item>
          <q-item class="col-12">
            <q-item-section>
              <BaseInput
                label="Description *"
                :maxlength="1000"
                placeholder="Example: Add a Job/Role Description here"
                required
                :rules="[...minLength(1), ...maxLength(1000)]"
                type="textarea"
                v-model="assignmentObjChallenge.description"
              />
              <p v-if="assignmentStore.errorAssignment.description" class="text-caption text-negative">
                {{ assignmentStore.errorAssignment.description_msg }}
              </p>
            </q-item-section>
          </q-item>
          <q-item class="col-6">
            <q-item-section>
              <BaseInput
                :disable="Boolean(stateDisabled)"
                label="Start date *"
                :options="
                  (date) =>
                    date > todayDateValueAsPerQuasarDate() &&
                    (assignmentObjChallenge.end_date ? date < assignmentObjChallenge.end_date : true)
                "
                required
                :rules="date"
                type="date"
                v-model="assignmentObjChallenge.start_date"
              />
              <p v-if="assignmentStore.errorAssignment.start_date" class="text-caption text-negative">
                {{ assignmentStore.errorAssignment.start_date_msg }}
              </p>
            </q-item-section>
          </q-item>
          <q-item class="col-6">
            <q-item-section>
              <BaseInput
                :disable="Boolean(stateDisabled)"
                label="End date *"
                :options="
                  (date) =>
                    date > todayDateValueAsPerQuasarDate() &&
                    (assignmentObjChallenge.start_date ? date > assignmentObjChallenge.start_date : true)
                "
                required
                :rules="date"
                type="date"
                v-model="assignmentObjChallenge.end_date"
              />
              <p v-if="assignmentStore.errorAssignment.end_date" class="text-caption text-negative">
                {{ assignmentStore.errorAssignment.end_date_msg }}
              </p>
            </q-item-section>
          </q-item>
          <q-item class="col-12">
            <q-item-section>
              <BaseSelect
                :disable="Boolean(stateDisabled)"
                hide-hint
                hint="Click Enter ↵ to add another email"
                label="User emails *"
                multiple
                new-value-mode="add-unique"
                :rules="[...required]"
                v-model="assignmentObjChallenge.users"
              />
              <p v-if="assignmentStore.errorAssignment.users" class="text-caption text-negative">
                {{ assignmentStore.errorAssignment.users_msg }}
              </p>
            </q-item-section>
          </q-item>
          <q-item class="col-12">
            <q-item-section>
              <BaseInput label="Pass Percentage" :min="1" :max="100" type="number" v-model="assignmentObjChallenge.pass_percentage" />
              <p v-if="assignmentStore.errorAssignment.pass_percentage" class="text-caption text-negative">
                {{ assignmentStore.errorAssignment.pass_percentage_msg }}
              </p>
            </q-item-section>
          </q-item>
          <q-item class="col-12">
            <q-item-section>
              <BaseInput
                :disable="Boolean(stateDisabled)"
                label="Duration In minutes *"
                :min="30"
                required
                type="number"
                :rules="min(30)"
                v-model="assignmentObjChallenge.duration"
              />
              <p v-if="assignmentStore.errorAssignment.duration" class="text-caption text-negative">
                {{ assignmentStore.errorAssignment.duration_msg }}
              </p>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right" class="q-pa-lg">
        <BaseBtn no-caps color="primary" type="submit" :disable="assignmentStore.isLoading" :loading="assignmentStore.isLoading">
          Submit
        </BaseBtn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'

import { todayDateValueAsPerQuasarDate } from 'src/utils/reuseFunctions'
import { date, maxLength, min, minLength, required } from 'src/utils/rules'

import { useCoursesStore } from 'src/store/pinia/courses'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useAssignmentStore } from 'src/store/pinia/assignment'
import { defineComponent, onBeforeMount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

defineComponent({
  name: 'CreateInterviewAssignment'
})

const props = defineProps(['id', 'show', 'eventsList', 'title', 'stateDisabled'])

const emit = defineEmits(['onCancel'])

const eventsOptions = ref([])
const teamsOptions = ref([])
const usersOptions = ref([])
const assignmentObjChallenge = ref({
  name: '',
  description: '',
  start_date: '',
  duration: 0,
  end_date: '',
  users: [],
  teams: [],
  events: [],
  is_active: false,
  verify_completion: true,
  pass_percentage: 100
})
const disabledTeams = ref([])
const disabledUsers = ref([])
const usedNames = ref([])

const coursesStore = useCoursesStore()
const assignmentStore = useAssignmentStore()
const companyUserTeamsStore = useCompanyUserTeamsStore()

const router = useRouter()

onBeforeMount(() => {
  eventsOptions.value = coursesStore.coursesData.map((data) => ({ label: data.name, value: data.id }))
  companyUserTeamsStore.teamList.forEach((data) => {
    teamsOptions.value.push({
      label: data.name,
      value: data.id
    })
  })
  usersOptions.value = companyUserTeamsStore.listOfUsers
  disabledTeams.value = []
  disabledUsers.value = []
  if (props.id) {
    getDataInfo()
  }
})

function getDataInfo() {
  assignmentObjChallenge.value.name = assignmentStore.assignmentTestsInfo.name
  assignmentObjChallenge.value.description = assignmentStore.assignmentTestsInfo.description
  assignmentObjChallenge.value.duration = assignmentStore.assignmentTestsInfo.duration

  assignmentObjChallenge.value.start_date = assignmentStore.assignmentTestsInfo.start_date
  assignmentObjChallenge.value.end_date = assignmentStore.assignmentTestsInfo.end_date
  assignmentObjChallenge.value.is_active = assignmentStore.assignmentTestsInfo.is_active
  assignmentObjChallenge.value.verify_completion = assignmentStore.assignmentTestsInfo.verify_completion
  assignmentObjChallenge.value.pass_percentage = assignmentStore.assignmentTestsInfo.pass_percentage

  if (assignmentStore.assignmentTestsInfo.events && assignmentStore.assignmentTestsInfo.events.length > 0) {
    assignmentObjChallenge.value.events = assignmentStore.assignmentTestsInfo.events.map((eve) => ({
      label: eve.event_name,
      value: eve.sk
    }))
  }

  if (assignmentStore.assignmentTestsInfo.teams && assignmentStore.assignmentTestsInfo.teams.length > 0) {
    assignmentObjChallenge.value.teams = assignmentStore.assignmentTestsInfo.teams.map((eve) => ({
      label: eve.team_name,
      value: eve.sk
    }))
    disabledTeams.value = assignmentObjChallenge.value.teams
  }

  const tempListUsers = []
  if (assignmentStore.assignmentTestsInfo.users && assignmentStore.assignmentTestsInfo.users.length > 0) {
    assignmentStore.assignmentTestsInfo.users.forEach((eve) => {
      if (eve) {
        tempListUsers.push(eve)
      }
    })
  }
  assignmentObjChallenge.value.users = tempListUsers
}

async function onSubmit() {
  const data = {
    name: assignmentObjChallenge.value.name,
    description: assignmentObjChallenge.value.description,
    duration: assignmentObjChallenge.value.duration,
    start_date: assignmentObjChallenge.value.start_date.replaceAll('/', '-'),
    end_date: assignmentObjChallenge.value.end_date.replaceAll('/', '-'),
    test_type: 'interview'
  }
  if (assignmentObjChallenge.value.pass_percentage) {
    data.pass_percentage = assignmentObjChallenge.value.pass_percentage
  }
  if (assignmentObjChallenge.value.users && assignmentObjChallenge.value.users.length > 0) {
    data.users = assignmentObjChallenge.value.users
  }

  if (props.id) {
    data.test = props.id
    if (disabledUsers.value.length > 0) {
      const fromGetMethodUsers = []
      for (const ids of disabledUsers.value) {
        fromGetMethodUsers.push(ids.value)
      }
      data.users = [...fromGetMethodUsers, ...(data.users ? data.users : [])]
      data.users = [...new Set(data.users)]
    }
    await assignmentStore.updateCompanyChallengeAssignment(data)
  } else {
    await assignmentStore.createCompanyChallengeAssignment(data)
  }
  if (assignmentStore.statusOfAssignmentAPI) {
    router.push({
      name: 'company.assignments.tests'
    })
    onCancel()
    assignmentObjChallenge.value = {
      name: '',
      start_date: '',
      end_date: '',
      teams: [],
      users: [],
      events: [],
      verify_completion: true,
      pass_percentage: null,
      is_active: false
    }
  }
}

function onCancel() {
  emit('onCancel', { show: true })
}
</script>
