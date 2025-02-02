<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 60vw; max-width: 60vw" transition-show="flip-up" transition-hide="flip-down">
      <q-card-section class="bg-grey-2 text-primary">
        <q-bar class="bg-grey-2 none-spacing">
          <div class="text-subtitle2" color="primary">{{ title }}</div>

          <q-space />
          <q-btn class="ase-roboto ase-md" color="secondary" icon="close" round size="sm" @click="onCancel()" />
        </q-bar>
      </q-card-section>
      <q-card-section class="q-pt-md">
        <q-form greedy @submit="onSubmit()">
          <q-stepper
            style="min-width: 55vw"
            alternative-labels
            animated
            :done="step > 1"
            done-color="green"
            header-nav
            ref="stepper"
            v-model="step"
          >
            <q-step :name="1" title="Info" icon="article">
              <q-list class="row">
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
                      type="date"
                      v-model="assignmentObj.start_date"
                    />
                    <p v-if="assignmentStore.errorAssignment.start_date" class="text-caption text-negative">
                      {{ assignmentStore.errorAssignment.start_date_msg }}
                    </p>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-4 col-xs-12">
                  <q-item-section>
                    <BaseInput
                      label="End date"
                      :options="(date) => (assignmentObj.start_date ? date > assignmentObj.start_date : true)"
                      required
                      type="date"
                      v-model="assignmentObj.end_date"
                    />
                    <p v-if="assignmentStore.errorAssignment.end_date" class="text-caption text-negative">
                      {{ assignmentStore.errorAssignment.end_date_msg }}
                    </p>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-4 col-xs-12">
                  <q-item-section>
                    <BaseInput
                      label="Pass Percentage"
                      :min="0"
                      :max="100"
                      :rules="[...min(0), ...max(100)]"
                      type="number"
                      v-model="assignmentObj.pass_percentage"
                    />
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
                      <BaseSelect
                        :disable="stateDisabled"
                        label="Teams"
                        multiple
                        :options="teamsOptions"
                        :showMore="companyUserTeamsStore.showMore"
                        v-model="assignmentObj.teams"
                        :loading="companyUserTeamsStore.isLoading"
                        @loadMoreItems="loadMoreTeams"
                      />
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
                      <BaseSelect
                        label="Users"
                        multiple
                        :options="companyUserTeamsStore.listOfUsersEmail"
                        v-model="assignmentObj.users"
                        :loading="companyUserTeamsStore.isLoading"
                      />
                      <p v-if="assignmentStore.errorAssignment.teams" class="text-caption text-negative">
                        {{ assignmentStore.errorAssignment.teams_msg }}
                      </p>
                    </q-item-section>
                  </div>
                </q-item>
                <q-item class="col-12 none_spacing">
                  <q-item-section class="none_spacing">
                    <div>
                      <q-checkbox
                        v-model="assignmentObj.verify_completion"
                        label="Issue certificates only to users who completed the assignment"
                      />
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-step>
            <q-step
              :disable="!assignmentObj.name || !assignmentObj.start_date || !assignmentObj.end_date"
              :done="step > 2"
              :header-nav="step > 2"
              icon="article"
              :name="2"
              :title="secondStepTitle"
            >
              <p class="error_msg_color none-spacing" style="font-size: 12px" v-for="error in errors" :key="error">{{ error }}</p>

              <q-item v-if="assignmentStore.assignmentInfo.journey" class="col-12 none_spacing">
                <q-item-section class="none_spacing">
                  <BaseSelect
                    label="Select journey"
                    :options="[]"
                    v-model="assignmentObj.journey"
                    option-label="label"
                    option-value="value"
                    disable
                  />
                </q-item-section>
              </q-item>

              <q-item v-else class="col-12 none_spacing full-width">
                <q-item-section class="none_spacing">
                  <div class="row full-width">
                    <div class="col-12">
                      <AssignmentFilters @hide-dropdown="hideDropDOwn()" @filterItems="filteredData">
                        <template v-slot:search>
                          <q-input
                            dense
                            outlined
                            size="sm"
                            color="grey"
                            v-model="filter"
                            label="Search"
                            @update:modelValue="searchFilter(filter)"
                          />
                        </template>
                      </AssignmentFilters>
                    </div>
                    <div class="col-12 q-pt-md">
                      <q-toolbar class="bg-portalColor text-white shadow-2">
                        <q-toolbar-title>Courses</q-toolbar-title>
                      </q-toolbar>
                      <q-list bordered separator style="max-height: 50vh; width: 100%; overflow-y: scroll">
                        <q-expansion-item
                          v-for="data in eventsOptions"
                          :group="data.id"
                          header-class="text-primary"
                          icon="explore"
                          :key="data.id"
                          :label="data.name"
                        >
                          <template v-slot:header>
                            <q-item-section avatar>
                              <q-checkbox size="md" color="indigo-7" v-model="assignmentObj.events" :val="data.id" />
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
                        <template v-if="eventsOptions.length === 0">
                          <q-toolbar class="bg-white text-primary shadow-2 text-center">
                            <q-toolbar-title>No data</q-toolbar-title>
                          </q-toolbar>
                        </template>
                      </q-list>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              <div class="full-width row">
                <div class="col-8">
                  <p v-if="assignmentStore.errorAssignment.events" class="text-caption text-negative">
                    {{ assignmentStore.errorAssignment.events_msg }}
                  </p>
                </div>
              </div>
            </q-step>

            <q-card-actions align="right">
              <q-btn class="ase-roboto ase-md" color="primary" no-caps push type="submit">Submit</q-btn>
            </q-card-actions>

            <template v-slot:navigation>
              <q-stepper-navigation>
                <q-btn flat @click="onCancel()">Cancel</q-btn>
                <q-btn v-if="step !== 1" flat @click="$refs.stepper.previous()">Back</q-btn>
                <q-btn v-if="step !== 2" flat @click="verifyDate() && $refs.stepper.next()">Next</q-btn>
                <q-btn
                  v-if="step === 2"
                  :disable="!assignmentObj.name || !assignmentObj.start_date || !assignmentObj.end_date || !assignmentObj.events.length"
                  flat
                  type="submit"
                >
                  Submit
                </q-btn>
              </q-stepper-navigation>
            </template>
          </q-stepper>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import AssignmentFilters from 'components/my_courses/AssignmentFilters.vue'
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import { useCoursesStore } from 'src/store/pinia/courses'
import { todayDateValueAsPerQuasarDate, urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { maxLength, minLength, number, required, min, max } from 'src/utils/rules'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useLearningPathStore } from 'src/store/pinia/learningPath'
import { useAssignmentStore } from 'src/store/pinia/assignment'
import { Notify } from 'quasar'

export default {
  name: 'CourseAssignmentCreate',
  components: { BaseInput, BaseSelect, AssignmentFilters },
  props: ['id', 'show', 'eventsList', 'title', 'stateDisabled'],
  data() {
    return {
      showDialog: this.show,
      eventsOptions: [],
      teamsOptions: [],
      usersOptions: [],
      assignmentObj: {
        name: '',
        start_date: '',
        end_date: '',
        pass_percentage: undefined,
        users: [],
        teams: [],
        events: [],
        is_active: false,
        verify_completion: true,
        journey: {
          label: '',
          value: ''
        }
      },
      disabledTeams: [],
      disabledUsers: [],
      openFilterMenu: false,
      proficiencyOptions: [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' }
      ],
      proficiencySelect: [],
      lpOptions: [],
      lpSelect: [],
      todayDateValueAsPerQuasarDate,
      maxLength,
      minLength,
      required,
      step: 1,
      selected: [],
      filter: '',
      listShow: {},
      eventsColumns: [
        {
          name: 'name',
          label: 'Name',
          field: 'name',
          sortable: true,
          align: 'left'
        },
        {
          name: 'proficiency',
          label: 'Proficiency',
          field: 'proficiency',
          sortable: true,
          align: 'center'
        }
      ],
      isTeamsVisible: false,
      isUsersVisible: false,
      min,
      max
    }
  },
  async created() {
    if (this.id) {
      this.getDataInfo()
      this.getDynamicInfo()
    }
    if (this.companyUserTeamsStore.teamList.length === 0) {
      await this.companyUserTeamsStore.fetchCompanyTeams({})
    }
    if (this.companyUserTeamsStore.listOfUsers.length === 0) {
      await this.companyUserTeamsStore.allUsersList({ users: { all: true } })
    }

    this.teamsOptions = this.companyUserTeamsStore.teamList.map((data) => ({ label: data.name, value: data.id }))
    this.usersOptions = this.companyUserTeamsStore.listOfUsers
    this.disabledTeams = []
    this.disabledUsers = []
  },
  methods: {
    filterOpen() {
      this.openFilterMenu = !this.openFilterMenu
    },
    showData(name) {
      if (name in this.listShow) {
        if (this.listShow[name]) {
          this.listShow[name] = false
        } else {
          this.listShow[name] = true
        }
      } else {
        this.listShow[name] = true
      }
    },
    async filteredData(payload) {
      await this.coursesStore.filterCourses(payload.data)
      this.eventsOptions = this.coursesStore.coursesData
      if (this.selected.length > 0) {
        await this.individualData()
      }
    },
    async individualData() {
      this.assignmentObj.events = this.eventsOptions.filter((element1) => this.selected.some((element2) => element1.id === element2))
      this.assignmentObj.events = this.assignmentObj.events.map((element) => element.id)
    },
    getDataInfo() {
      this.assignmentObj.name = this.assignmentStore.assignmentInfo.name
      this.assignmentObj.start_date = this.assignmentStore.assignmentInfo.start_date.replace(/-/g, '/')
      this.assignmentObj.end_date = this.assignmentStore.assignmentInfo.end_date.replace(/-/g, '/')
      this.assignmentObj.is_active = this.assignmentStore.assignmentInfo.is_active
      this.assignmentObj.verify_completion = this.assignmentStore.assignmentInfo.verify_completion
      this.assignmentObj.pass_percentage = this.assignmentStore.assignmentInfo.pass_percentage

      if (this.assignmentStore.assignmentInfo.events.length > 0) {
        this.selected = this.assignmentStore.assignmentInfo.events.map((eve) => eve.sk)
        this.assignmentObj.events = this.assignmentStore.assignmentInfo.events.map((eve) => eve.sk)
      }

      if (this.assignmentStore.assignmentInfo.journey) {
        this.assignmentObj.journey = {
          label: this.assignmentStore.assignmentInfo.journey?.name,
          value: this.assignmentStore.assignmentInfo.journey?.sk
        }
      }
    },
    getDynamicInfo() {
      if (this.assignmentStore.assignmentInfo.teams.length > 0) {
        this.assignmentObj.teams = this.assignmentStore.assignmentInfo.teams.map((eve) => ({ label: eve.team_name, value: eve.sk }))
        this.disabledTeams = this.assignmentObj.teams
      }

      if (this.assignmentStore.assignmentInfo.users.length > 0) {
        this.assignmentObj.users = this.assignmentStore.assignmentInfo.users.map((eve) => ({ label: eve, value: eve }))
        this.disabledUsers = this.assignmentObj.users
      }
    },
    searchFilter(item) {
      this.eventsOptions = this.coursesStore.coursesData.filter((creature) => creature.name.toLowerCase().includes(item.toLowerCase()))
    },
    async onSubmit() {
      const data = {
        name: this.assignmentObj.name,
        start_date: this.assignmentObj.start_date.replace(/\//g, '-'),
        end_date: this.assignmentObj.end_date.replace(/\//g, '-'),
        verify_completion: this.assignmentObj.verify_completion,
        pass_percentage: this.assignmentObj.pass_percentage !== '' ? this.assignmentObj.pass_percentage : undefined,
        is_active: true
      }
      if (this.assignmentObj.users && this.assignmentObj.users.length > 0) {
        const usersIDS = []
        for (const ids of this.assignmentObj.users) {
          usersIDS.push(ids.value)
        }
        data.users = usersIDS
      }
      if (this.assignmentObj.events && this.assignmentObj.events.length > 0) {
        data.events = this.assignmentObj.events
      }
      if (this.assignmentObj.teams && this.assignmentObj.teams.length > 0) {
        const teamsIDS = []
        for (const ids of this.assignmentObj.teams) {
          teamsIDS.push(ids.value)
        }
        data.teams = teamsIDS
      }

      if (this.id) {
        data.assign_id = this.id
        if (this.disabledTeams.length > 0) {
          const fromGetMethodTeams = []
          for (const ids of this.disabledTeams) {
            fromGetMethodTeams.push(ids.value)
          }
          data.teams = [...fromGetMethodTeams, ...(data.teams ? data.teams : [])]
          data.teams = [...new Set(data.teams)]
        }
        if (this.disabledUsers.length > 0) {
          const fromGetMethodUsers = []
          for (const ids of this.disabledUsers) {
            fromGetMethodUsers.push(ids.value)
          }
          data.users = [...fromGetMethodUsers, ...(data.users ? data.users : [])]
          data.users = [...new Set(data.users)]
        }
        //this.loadingStatus(true)
        if (this.assignmentStore.assignmentInfo?.journey) {
          delete data.events
        }
        await this.assignmentStore.updateCompanyAssignment(data)
        if (this.assignmentStore.statusOfAssignmentAPI) {
          this.onCancel()
          this.assignmentObj = {
            name: '',
            start_date: '',
            end_date: '',
            teams: [],
            events: [],
            verify_completion: true,
            is_active: false
          }
          const dataUpdate = {
            assign_id: urlSafeBase64Decode(this.$route.params.assignmentId),
            extra: 'a_'
          }
          //await this.loadingStatus(true)
          await this.assignmentStore.fetchCompanyAssignmentGet(dataUpdate)
        }
      } else {
        //this.loadingStatus(true)
        await this.assignmentStore.createCompanyAssignment(data)

        if (this.assignmentStore.statusOfAssignmentAPI) {
          this.onCancel()
          this.assignmentObj = {
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
    },
    onCancel() {
      this.$emit('onCancel', { show: true })
    },
    loadMoreTeams() {
      this.companyUserTeamsStore.fetchPaginatedCompanyTeams({ LastEvaluatedKey: this.companyUserTeamsStore.paginatedTeam })
    },
    verifyDate() {
      if (
        this.assignmentObj.start_date < todayDateValueAsPerQuasarDate() ||
        this.assignmentObj.end_date < todayDateValueAsPerQuasarDate()
      ) {
        Notify.create({
          type: 'negative',
          position: 'top',
          progress: true,
          message: `Start date or end date must be greater than or equal to today's date`
        })
        return false
      } else if (this.assignmentObj.end_date && this.assignmentObj.start_date > this.assignmentObj.end_date) {
        Notify.create({ type: 'negative', position: 'top', progress: true, message: `Start date must be behind end date` })
        return false
      } else if (!this.assignmentObj.end_date || !this.assignmentObj.start_date) {
        Notify.create({ type: 'negative', position: 'top', progress: true, message: `Start date or end date field is missing` })
        return false
      } else if (this.assignmentObj.start_date && this.assignmentObj.end_date < this.assignmentObj.start_date) {
        Notify.create({ type: 'negative', position: 'top', progress: true, message: `End date must be greater than start date` })
        return false
      } else if (this.assignmentObj.pass_percentage < 0 || this.assignmentObj.pass_percentage > 100) {
        return false
      } else {
        return true
      }
    },
    toggleTeams() {
      this.isTeamsVisible = !this.isTeamsVisible
    },
    toggleUsers() {
      this.isUsersVisible = !this.isUsersVisible
    }
  },
  computed: {
    errors() {
      const errorMessages = Object.entries(this.assignmentStore.errorAssignment)
        .filter(([key, value]) => {
          return key.endsWith('_msg') && value
        })
        .map(([key, value]) => value)

      return errorMessages
    },
    selectedTeamsCount() {
      return this.assignmentObj.teams ? this.assignmentObj.teams.length : 0
    },
    selectedUsersCount() {
      return this.assignmentObj.users ? this.assignmentObj.users.length : 0
    },
    secondStepTitle() {
      return this.assignmentStore.assignmentInfo?.journey ? 'Journey' : 'Courses'
    }
  },
  setup() {
    const coursesStore = useCoursesStore()
    const companyUserTeamsStore = useCompanyUserTeamsStore()
    const learningPath = useLearningPathStore()
    const assignmentStore = useAssignmentStore()
    return { coursesStore, learningPath, assignmentStore, companyUserTeamsStore }
  }
}
</script>
<style lang="scss" scoped>
.dropdown-button {
  padding: 10px 12px;
  border: 1px solid lightgray;
}
</style>
