<template>
  <BaseCard transition-show="flip-up" transition-hide="flip-down" bordered>
    <q-card-section class="bg-grey-2 text-primary">
      <q-bar class="bg-grey-2 none-spacing">
        <div class="text-subtitle1 text-capitalize" color="primary">{{ isJourney ? 'Journey' : 'Course' }} Assignment</div>
        <q-space />
        <slot name="closeBtn"></slot>
      </q-bar>
    </q-card-section>
    <q-form @submit="onSubmit()">
      <q-list class="row q-pa-sm">
        <q-item class="col-12">
          <q-item-section>
            <BaseInput
              :disable="stateDisabled"
              label="Name *"
              :maxlength="50"
              required
              :rules="[...minLength(2), ...maxLength(50)]"
              v-model="assignmentObj.name"
            />
            <p v-if="assignmentStore.errorAssignment.name" class="text-caption text-negative">
              {{ assignmentStore.errorAssignment.name_msg }}
            </p>
          </q-item-section>
        </q-item>
        <q-item class="col-sm-4 col-xs-12">
          <q-item-section>
            <BaseInput
              label="Start date"
              :options="
                (date) => date >= todayDateValueAsPerQuasarDate() && (assignmentObj.end_date ? date < assignmentObj.end_date : true)
              "
              required
              :rules="date"
              type="date"
              v-model="assignmentObj.start_date"
            />
          </q-item-section>
        </q-item>
        <q-item class="col-sm-4 col-xs-12">
          <q-item-section>
            <BaseInput
              label="End date"
              :options="
                (date) => date > todayDateValueAsPerQuasarDate() && (assignmentObj.start_date ? date > assignmentObj.start_date : true)
              "
              required
              type="date"
              v-model="assignmentObj.end_date"
            />
          </q-item-section>
        </q-item>
        <q-item class="col-sm-4 col-xs-12">
          <q-item-section>
            <BaseInput label="Pass Percentage" :min="0" :max="100" type="number" v-model="assignmentObj.pass_percentage" />
          </q-item-section>
        </q-item>
        <q-item class="col-12">
          <div class="dropdown-button cursor-pointer full-width" :class="$q.dark.isActive ? undefined : 'bg-grey-3'">
            <div @click="toggleTeams">
              <p :style="{ marginBottom: isTeamsVisible ? '10px' : '0' }">
                <span>Select Teams&nbsp;{{ selectedTeamsCount ? `(${selectedTeamsCount})` : '' }}</span>
              </p>
            </div>
            <q-item-section v-if="isTeamsVisible">
              <q-checkbox v-model="allTeamsSelected" label="Select All" />
              <BaseSelect
                :disable="stateDisabled || allTeamsSelected"
                label="Select Teams"
                multiple
                :options="teamsOptions"
                :showMore="companyUserTeamsStore?.showMore"
                :loading="companyUserTeamsStore.isLoadingTeam"
                v-model="assignmentObj.teams"
                @loadMoreItems="loadMoreTeams"
                option-label="label"
                option-value="value"
              />
              <p v-if="assignmentStore.errorAssignment.teams" class="text-caption text-negative">
                {{ assignmentStore.errorAssignment.teams_msg }}
              </p>
              <p v-if="assignmentStore.errorAssignment.teams" class="text-caption text-negative">
                {{ assignmentStore.errorAssignment.teams_msg }}
              </p>
            </q-item-section>
          </div>
        </q-item>
        <q-item class="col-12">
          <div class="dropdown-button cursor-pointer full-width" :class="$q.dark.isActive ? undefined : 'bg-grey-3'">
            <div @click="toggleUsers">
              <p :style="{ marginBottom: isUsersVisible ? '10px' : '0' }">
                <span>Select Users&nbsp;{{ selectedUsersCount ? `(${selectedUsersCount})` : '' }}</span>
              </p>
            </div>
            <q-item-section v-if="isUsersVisible">
              <q-checkbox v-model="allUsersSelected" label="Select All" class="q-mb-sm" />
              <BaseSelect
                label="Select Users"
                multiple
                :options="companyUserTeamsStore?.listOfUsersEmail"
                :loading="companyUserTeamsStore.isLoading"
                v-model="assignmentObj.users"
                :rules="[...required]"
                option-label="label"
                option-value="value"
                :disable="allUsersSelected"
              />
              <div v-if="assignmentStore.errorAssignment.teams" class="text-caption text-negative">
                {{ assignmentStore.errorAssignment.teams_msg }}
              </div>
              <div v-if="assignmentStore.errorAssignment.teams" class="text-caption text-negative">
                {{ assignmentStore.errorAssignment.teams_msg }}
              </div>
            </q-item-section>
          </div>
        </q-item>

        <q-item v-if="!isJourney" class="col-12 none_spacing full-width">
          <q-item-section class="none_spacing">
            <div class="row full-width">
              <div class="col-12">
                <AssignmentFilters @hide-dropdown="hideDropDOwn()" @filterItems="filteredData" :loading="coursesLoading">
                  <template v-slot:search>
                    <BaseInput style="width: 220px" v-model="filter" label="Search" @update:modelValue="searchFilter(filter)">
                      <template v-slot:append>
                        <q-separator color="grey-10" vertical class="q-ma-sm" />
                        <q-icon name="search" />
                      </template>
                    </BaseInput>
                  </template>
                </AssignmentFilters>
              </div>
              <div class="col-12 q-pt-md">
                <q-toolbar>
                  <q-toolbar-title>Courses</q-toolbar-title>
                </q-toolbar>
                <q-list bordered separator style="max-height: 50vh; width: 100%; overflow-y: scroll">
                  <template v-if="!coursesStore.isLoading && !coursesLoading">
                    <q-expansion-item v-for="data in eventsOptions" :group="data.id" icon="explore" :key="data.id" :label="data.name">
                      <template v-slot:header>
                        <q-item-section avatar>
                          <q-checkbox size="md" v-model="assignmentObj.events" :val="data.id" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>
                            {{ data.name }}
                          </q-item-label>
                          <q-item-label>
                            <q-badge v-if="data.event_status">
                              {{ data.event_status }}
                            </q-badge>
                            <q-badge class="q-ml-sm" v-if="data.proficiency">
                              {{ data.proficiency }}
                            </q-badge>
                          </q-item-label>
                        </q-item-section>
                      </template>
                      <q-card>
                        <q-card-section>
                          {{ data.description }}
                        </q-card-section>
                      </q-card>
                    </q-expansion-item>
                  </template>
                  <template v-if="eventsOptions.length === 0 || coursesStore.isLoading || coursesLoading">
                    <BaseComponentLoader :loading="coursesStore.isLoading || coursesLoading" :class="{ 'q-my-lg': coursesStore.isLoading }">
                      <q-toolbar class="bg-white text-primary text-center">
                        <q-toolbar-title>No data</q-toolbar-title>
                      </q-toolbar>
                    </BaseComponentLoader>
                  </template>
                </q-list>
              </div>
            </div>
          </q-item-section>
        </q-item>

        <q-item v-else-if="isJourney" class="col-12 none_spacing">
          <q-item-section class="none_spacing">
            <BaseSelect
              label="Select journey"
              :options="companyJourney.assignmentFormOptions"
              v-model="assignmentObj.events"
              option-label="label"
              option-value="value"
            />
          </q-item-section>
        </q-item>

        <q-item class="col-12 none_spacing">
          <q-item-section class="none_spacing">
            <div>
              <q-checkbox v-model="assignmentObj.verify_completion" label="Issue certificates only to users who completed the assignment" />
            </div>
          </q-item-section>
        </q-item>
        <q-item class="col-12 none_spacing">
          <q-item-section class="none_spacing" align="right">
            <div align="right">
              <BaseBtn
                color="primary"
                class="on-right float-right"
                :disable="
                  !assignmentObj.name || !assignmentObj.start_date || !assignmentObj.end_date || computeDisable || assignmentStore.isLoading
                "
                :loading="assignmentStore.isLoading"
                type="submit"
              >
                Submit
              </BaseBtn>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-form>
  </BaseCard>
</template>

<script setup>
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import AssignmentFilters from 'components/my_courses/AssignmentFilters.vue'
import BaseComponentLoader from 'components/wrappers/BaseComponentLoader/index.vue'

import { todayDateValueAsPerQuasarDate, urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { date, max, min, maxLength, minLength, required } from 'src/utils/rules'

import { useCoursesStore } from 'src/store/pinia/courses'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useAssignmentStore } from 'src/store/pinia/assignment'
import { useCompanyJourney } from 'src/store/pinia/company/journey'

import { computed, defineComponent, nextTick, onBeforeMount, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notify } from 'quasar'

defineComponent({
  name: 'CourseAssignmentCreate'
})

const props = defineProps(['id', 'show', 'stateDisabled', 'isJourney'])
const emit = defineEmits(['onCancel'])

const coursesStore = useCoursesStore()
const companyUserTeamsStore = useCompanyUserTeamsStore()
const assignmentStore = useAssignmentStore()
const companyJourney = useCompanyJourney()

const eventsOptions = ref([])
const assignmentObj = ref({
  name: '',
  start_date: '',
  end_date: '',
  users: [],
  teams: [],
  events: [],
  is_active: false,
  verify_completion: true,
  pass_percentage: undefined
})
const disabledTeams = ref([])
const disabledUsers = ref([])
const selected = ref([])
const filter = shallowRef('')
const coursesLoading = shallowRef(false)
const isTeamsVisible = ref(false)
const isUsersVisible = ref(false)
const allUsersSelected = ref(false)
const allTeamsSelected = ref(false)

const route = useRoute()
const router = useRouter()

watch(
  () => assignmentStore.errorAssignment.start_date,
  (newVal) => {
    if (newVal) {
      Notify.create({ type: 'negative', position: 'top', progress: true, message: assignmentStore.errorAssignment.start_date_msg })
    }
  }
)

watch(
  () => assignmentStore.errorAssignment.end_date,
  (newVal) => {
    if (newVal) {
      Notify.create({ type: 'negative', position: 'top', progress: true, message: assignmentStore.errorAssignment.end_date_msg })
    }
  }
)

onBeforeMount(async () => {
  companyJourney.fetchAllJourneys()
  if (props.id) {
    getDataInfo()
  }
})

async function filteredData(payload) {
  coursesLoading.value = true
  await coursesStore.filterCourses(payload.data, true, true)
  coursesLoading.value = false
  eventsOptions.value = coursesStore.coursesData
}

function toggleTeams() {
  isTeamsVisible.value = !isTeamsVisible.value
}
function toggleUsers() {
  isUsersVisible.value = !isUsersVisible.value
}
function getDataInfo() {
  assignmentObj.value.name = assignmentStore.assignmentInfo.name
  assignmentObj.value.start_date = assignmentStore.assignmentInfo.start_date.replace(/-/g, '/')
  assignmentObj.value.end_date = assignmentStore.assignmentInfo.end_date.replace(/-/g, '/')
  assignmentObj.value.is_active = assignmentStore.assignmentInfo.is_active
  assignmentObj.value.verify_completion = assignmentStore.assignmentInfo.verify_completion

  if (assignmentStore.assignmentInfo.events.length > 0) {
    selected.value = assignmentStore.assignmentInfo.events.map((eve) => eve.sk)
    assignmentObj.value.events = assignmentStore.assignmentInfo.events.map((eve) => eve.sk)
  }

  if (assignmentStore.assignmentInfo.teams.length > 0) {
    assignmentObj.value.teams = assignmentStore.assignmentInfo.teams.map((eve) => ({ label: eve.team_name, value: eve.sk }))
    disabledTeams.value = assignmentObj.value.teams
  }

  if (assignmentStore.assignmentInfo.users.length > 0) {
    assignmentObj.value.users = assignmentStore.assignmentInfo.users.map((eve) => ({
      label: eve,
      value: eve
    }))
    disabledUsers.value = assignmentObj.value.users
  }
}
function searchFilter(item) {
  eventsOptions.value = coursesStore.coursesData.filter((creature) => creature.name.toLowerCase().includes(item.toLowerCase()))
}

async function onSubmit() {
  const data = {
    name: assignmentObj.value.name,
    start_date: assignmentObj.value.start_date.replace(/\//g, '-'),
    end_date: assignmentObj.value.end_date.replace(/\//g, '-'),
    verify_completion: assignmentObj.value.verify_completion,
    pass_percentage: Number(assignmentObj.value.pass_percentage) ?? undefined,
    is_active: true
  }

  if (allUsersSelected.value) {
    data.all_users = true
  } else if (assignmentObj.value.users && assignmentObj.value.users.length > 0) {
    const usersIDS = []
    for (const ids of assignmentObj.value.users) {
      usersIDS.push(ids.value)
    }
    data.users = usersIDS
  }

  if (!props.isJourney) {
    if (assignmentObj.value.events && assignmentObj.value.events.length > 0) {
      data.events = assignmentObj.value.events
    }
  } else {
    data.journey = assignmentObj.value.events.value
  }

  if (allUsersSelected.value) {
    data.all_teams = true
  } else if (assignmentObj.value.teams && assignmentObj.value.teams.length > 0) {
    const teamsIDS = []
    for (const ids of assignmentObj.value.teams) {
      teamsIDS.push(ids.value)
    }
    data.teams = teamsIDS
  }

  if (props.id) {
    data.assign_id = props.id
    if (disabledTeams.value.length > 0) {
      const fromGetMethodTeams = []
      for (const ids of disabledTeams) {
        fromGetMethodTeams.push(ids.value)
      }
      data.teams = [...fromGetMethodTeams, ...(data.teams ? data.teams : [])]
      data.teams = [...new Set(data.teams)]
    }

    if (disabledUsers.value.length > 0) {
      const fromGetMethodUsers = []
      for (const ids of disabledUsers) {
        fromGetMethodUsers.push(ids.value)
      }
      data.users = [...fromGetMethodUsers, ...(data.users ? data.users : [])]
      data.users = [...new Set(data.users)]
    }

    await assignmentStore.updateCompanyAssignment(data)
    if (assignmentStore.statusOfAssignmentAPI) {
      router.push({ name: 'company.course_assignments.course' })
      onCancel()
      assignmentObj.value = {
        name: '',
        start_date: '',
        end_date: '',
        teams: [],
        events: [],
        verify_completion: true,
        is_active: false
      }
      const dataUpdate = {
        assign_id: urlSafeBase64Decode(route.params.assignmentId),
        extra: 'a_'
      }
      await assignmentStore.fetchCompanyAssignmentGet(dataUpdate)
    }
  } else {
    await assignmentStore.createCompanyAssignment(data)

    if (assignmentStore.statusOfAssignmentAPI) {
      router.push({ name: 'company.course_assignments.course' })
      onCancel()
      assignmentObj.value = {
        name: '',
        start_date: '',
        end_date: '',
        teams: [],
        users: [],
        events: [],
        verify_completion: true,
        is_active: false
      }
    }
  }
}

function onCancel() {
  emit('onCancel', { show: true })
}

function loadMoreTeams() {
  fetchPaginatedCompanyTeams({ LastEvaluatedKey: undefined })
}

const teamsOptions = computed(() =>
  companyUserTeamsStore?.teamList.map((data) => ({
    label: data.name,
    value: data.id
  }))
)
const selectedTeamsCount = computed(() => {
  return assignmentObj.value.teams ? assignmentObj.value.teams.length : 0
})
const selectedUsersCount = computed(() => {
  return assignmentObj.value.users ? assignmentObj.value.users.length : 0
})
const computeDisable = computed(() => {
  if (!props.isJourney) {
    return !assignmentObj.value.events.length
  } else if (props.isJourney) {
    return assignmentObj.value.events ? !Object.keys(assignmentObj.value.events).length : true
  } else {
    return true
  }
})
</script>
<style lang="scss" scoped>
.dropdown-button {
  padding: 10px 12px;
  border: 1px solid lightgray;
}
</style>
