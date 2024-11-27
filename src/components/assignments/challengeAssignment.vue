<template>
  <q-card transition-show="flip-up" transition-hide="flip-down">
    <q-card-section class="bg-grey-2 text-primary">
      <q-bar class="bg-grey-2 none-spacing">
        <div class="text-subtitle2" color="primary">
          {{ id ? 'Update Tournament Assignment' : 'Tournament Assignment' }}
        </div>
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
                :maxlength="100"
                required
                :rules="[...minLength(2), ...maxLength(100), (val) => !usedNames.includes(val) || 'Name already exists']"
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
          <q-item class="col-6">
            <q-item-section>
              <BaseInput label="Pass Percentage" :min="1" :max="100" type="number" v-model="assignmentObjChallenge.pass_percentage" />
              <p v-if="assignmentStore.errorAssignment.pass_percentage" class="text-caption text-negative">
                {{ assignmentStore.errorAssignment.pass_percentage_msg }}
              </p>
            </q-item-section>
          </q-item>
          <q-item class="col-6">
            <q-item-section>
              <BaseInput
                :disable="Boolean(stateDisabled)"
                label="Duration In Minutes*"
                :min="30"
                :max="600"
                required
                :type="'number'"
                :rules="[...min(30), ...max(600)]"
                v-model="assignmentObjChallenge.duration"
              />
              <p v-if="assignmentStore.errorAssignment.duration" class="text-caption text-negative">
                {{ assignmentStore.errorAssignment.duration_msg }}
              </p>
            </q-item-section>
          </q-item>
          <q-item class="col-12">
            <q-item-section>
              <BaseSelect
                :disable="Boolean(stateDisabled)"
                label="Select teams"
                :loading="companyUserTeamsStore.isLoadingTeam"
                multiple
                :options="teamsOptions"
                :rules="required"
                :showMore="companyUserTeamsStore.showMore"
                v-model="assignmentObjChallenge.teams"
                @loadMoreItems="loadMoreTeams"
              />
              <p v-if="assignmentStore.errorAssignment.teams" class="text-caption text-negative">
                {{ assignmentStore.errorAssignment.teams_msg }}
              </p>
            </q-item-section>
          </q-item>
          <q-item class="col-12">
            <q-item-section>
              <BaseSelect
                label="Select users *"
                :loading="companyUserTeamsStore.isLoading"
                multiple
                :options="companyUserTeamsStore.listOfUsersEmail"
                :rules="required"
                v-model="assignmentObjChallenge.users"
              />
              <p v-if="assignmentStore.errorAssignment.teams" class="text-caption text-negative">
                {{ assignmentStore.errorAssignment.teams_msg }}
              </p>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          push
          class="ase-roboto ase-md"
          no-caps
          color="primary"
          type="submit"
          :loading="assignmentStore.isLoading"
          :disable="assignmentStore.isLoading"
        >
          Save
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'

import { todayDateValueAsPerQuasarDate } from 'src/utils/reuseFunctions'
import { date, max, maxLength, min, minLength, required } from 'src/utils/rules.js'

import { useCoursesStore } from 'src/store/pinia/courses'
import { useAssignmentStore } from 'src/store/pinia/assignment'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { defineComponent, onBeforeMount, ref, defineProps, defineEmits } from 'vue'

defineComponent({
  name: 'CreateTestAssignment'
})

const props = defineProps(['id', 'show', 'eventsList', 'title', 'stateDisabled'])
const emit = defineEmits(['onCancel', 'submit'])

const coursesStore = useCoursesStore()
const companyUserTeamsStore = useCompanyUserTeamsStore()
const assignmentStore = useAssignmentStore()

const eventsOptions = ref([])
const teamsOptions = ref([])
const usersOptions = ref([])
const assignmentObjChallenge = ref({
  name: '',
  duration: 0,
  description: '',
  start_date: '',
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

onBeforeMount(async () => {
  if (props.id) {
    getDataInfo()
  }

  if (companyUserTeamsStore.teamList.length === 0) {
    const data = {}
    await companyUserTeamsStore.fetchCompanyTeams(data)
  }

  teamsOptions.value = companyUserTeamsStore.teamList.map((data) => ({ label: data.name, value: data.id }))

  if (companyUserTeamsStore.listOfUsers.length === 0) {
    await companyUserTeamsStore.allUsersList({ users: { all: true } })
  }
  eventsOptions.value = coursesStore.coursesData.map((data) => ({ label: data.name, value: data.id }))
  usersOptions.value = companyUserTeamsStore.listOfUsers.map((data) => ({ label: data.email, value: data.email }))
  disabledTeams.value = []
  disabledUsers.value = []

  usedNames.value = assignmentStore.challengeAssignmentList.filter((data) => data.id !== props.id).map((data) => data.name)
})

function getDataInfo() {
  assignmentObjChallenge.value.name = assignmentStore.assignmentTestsInfo.name
  assignmentObjChallenge.value.description = assignmentStore.assignmentTestsInfo.description
  assignmentObjChallenge.value.duration = assignmentStore.assignmentTestsInfo.duration

  assignmentObjChallenge.value.start_date = assignmentStore.assignmentTestsInfo.start_date.replace(/-/g, '/')
  assignmentObjChallenge.value.end_date = assignmentStore.assignmentTestsInfo.end_date.replace(/-/g, '/')
  assignmentObjChallenge.value.pass_percentage = assignmentStore.assignmentTestsInfo.pass_percentage

  assignmentObjChallenge.value.is_active = assignmentStore.assignmentTestsInfo.is_active
  assignmentObjChallenge.value.verify_completion = assignmentStore.assignmentTestsInfo.verify_completion

  if (assignmentStore.assignmentTestsInfo.events) {
    if (assignmentStore.assignmentTestsInfo.events.length > 0) {
      assignmentObjChallenge.value.events = assignmentStore.assignmentTestsInfo.events.map((eve) => ({
        label: eve.event_name,
        value: eve.sk
      }))
    }
  }

  if (assignmentStore.assignmentTestsInfo.teams) {
    if (assignmentStore.assignmentTestsInfo.teams.length > 0) {
      assignmentObjChallenge.value.teams = assignmentStore.assignmentTestsInfo.teams.map((eve) => ({
        label: eve.team_name,
        value: eve.sk
      }))
      disabledTeams.value = assignmentObjChallenge.value.teams
    }
  }

  if (assignmentStore.assignmentTestsInfo.users) {
    if (assignmentStore.assignmentTestsInfo.users.length > 0) {
      assignmentObjChallenge.value.users = assignmentStore.assignmentTestsInfo.users.map((eve) => ({ label: eve, value: eve }))
      disabledUsers.value = assignmentObjChallenge.value.users
    }
  }
}
async function onSubmit() {
  const data = {
    name: assignmentObjChallenge.value.name,
    description: assignmentObjChallenge.value.description,
    start_date: assignmentObjChallenge.value.start_date.replace(/\//g, '-'),
    end_date: assignmentObjChallenge.value.end_date.replace(/\//g, '-'),
    test_type: 'test',
    duration: assignmentObjChallenge.value.duration
  }

  if (assignmentObjChallenge.value.pass_percentage) {
    data.pass_percentage = parseInt(assignmentObjChallenge.value.pass_percentage)
  }

  if (assignmentObjChallenge.value.users && assignmentObjChallenge.value.users.length > 0) {
    data.users ??= []
    for (const ids of assignmentObjChallenge.value.users) {
      data.users.push(ids.value)
    }
  }

  if (assignmentObjChallenge.value.teams && assignmentObjChallenge.value.teams.length > 0) {
    data.teams ??= []
    for (const ids of assignmentObjChallenge.value.teams) {
      data.teams.push(ids.value)
    }
  }

  if (props.id) {
    data.test = props.id
    if (disabledTeams.value.length > 0) {
      const fromGetMethodTeams = []
      for (const ids of disabledTeams) {
        fromGetMethodTeams.push(ids.value)
      }
      data.teams = [...fromGetMethodTeams, ...(data.teams ? data.teams : [])]
      data.teams = [...new Set(data.teams)]

      const fromGetMethodUsers = []
      for (const ids of disabledUsers) {
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
    emit('submit')
    onCancel()

    assignmentObjChallenge.value = {
      name: '',
      start_date: '',
      end_date: '',
      pass_percentage: null,
      teams: [],
      events: [],
      verify_completion: true,
      is_active: false
    }
  }
}

function onCancel() {
  emit('onCancel', { show: false })
}
function loadMoreTeams() {
  const data = {
    LastEvaluatedKey: companyUserTeamsStore.paginatedTeam
  }
  companyUserTeamsStore.fetchPaginatedCompanyTeams(data)
}
</script>
