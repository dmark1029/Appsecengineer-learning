<template>
  <BaseCard transition-show="flip-up" transition-hide="flip-down" bordered>
    <q-card-section class="bg-grey-2 text-primary">
      <q-bar class="bg-grey-2 none-spacing">
        <div class="text-subtitle1" color="primary">Course Assignment</div>
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
              :rules="[...minLength(1), ...maxLength(50)]"
              v-model="assignmentObj.name"
            />
            <p v-if="assignmentStore.errorAssignment.name" class="text-caption text-negative">
              {{ assignmentStore.errorAssignment.name_msg }}
            </p>
            <p v-if="assignmentStore.errorAssignment.name" class="text-caption text-negative">
              {{ assignmentStore.errorAssignment.name_msg }}
            </p>
          </q-item-section>
        </q-item>
        <q-item class="col-sm-6 col-xs-12">
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
            <p v-if="assignmentStore.errorAssignment.start_date" class="text-caption text-negative">
              {{ assignmentStore.errorAssignment.start_date_msg }}
            </p>
          </q-item-section>
        </q-item>
        <q-item class="col-sm-6 col-xs-12">
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
            <p v-if="assignmentStore.errorAssignment.end_date" class="text-caption text-negative">
              {{ assignmentStore.errorAssignment.end_date_msg }}
            </p>
          </q-item-section>
        </q-item>
        <q-item class="col-12">
          <q-item-section>
            <BaseSelect
              :disable="stateDisabled"
              placeholder="Select teams"
              multiple
              :options="teamsOptions"
              :showMore="companyUserTeamsStore.showMore"
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
        </q-item>
        <q-item class="col-12">
          <q-item-section>
            <BaseSelect
              placeholder="Select Users"
              multiple
              :options="companyUserTeamsStore.listOfUsersEmail"
              v-model="assignmentObj.users"
              option-label="label"
              option-value="value"
            />
            <div v-if="assignmentStore.errorAssignment.teams" class="text-caption text-negative">
              {{ assignmentStore.errorAssignment.teams_msg }}
            </div>
            <div v-if="assignmentStore.errorAssignment.teams" class="text-caption text-negative">
              {{ assignmentStore.errorAssignment.teams_msg }}
            </div>
          </q-item-section>
        </q-item>
        <q-item class="col-12 none_spacing full-width">
          <q-item-section class="none_spacing">
            <div class="row full-width">
              <div class="col-12">
                <AssignmentFilters @hide-dropdown="hideDropDOwn()" @filterItems="filteredData">
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
                :disable="!assignmentObj.name || !assignmentObj.start_date || !assignmentObj.end_date || !assignmentObj.events.length"
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

<script>
import AssignmentFilters from 'components/my_courses/AssignmentFilters.vue'
import { useCoursesStore } from 'src/store/pinia/courses'
// import BaseSelect from 'components/shared/BaseSelect.vue'
import { todayDateValueAsPerQuasarDate, urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { maxLength, minLength, required } from 'src/utils/rules'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useAssignmentStore } from 'src/store/pinia/assignment'
import { storeToRefs } from 'pinia'

export default {
  name: 'CourseAssignmentCreate',
  components: { AssignmentFilters },
  props: ['id', 'show', 'eventsList', 'title', 'stateDisabled'],
  data() {
    return {
      eventsOptions: [],
      teamsOptions: [],
      usersOptions: [],
      assignmentObj: {
        name: '',
        start_date: '',
        end_date: '',
        users: [],
        teams: [],
        events: [],
        is_active: false,
        verify_completion: true
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
      stepCourse: 1,
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
      ]
    }
  },
  async created() {
    if (this.companyUserTeamsStore.teamList.length === 0) {
      //await this.isStatusUserTeams(true)
      await this.companyUserTeamsStore.fetchCompanyTeams({})
    }

    if (this.companyUserTeamsStore.listOfUsers.length === 0) {
      await this.companyUserTeamsStore.allUsersList({ users: { all: true } })
    }

    this.teamsOptions = this.companyUserTeamsStore.teamList.map((data) => ({ label: data.name, value: data.id }))
    this.usersOptions = this.companyUserTeamsStore.listOfUsers
    this.disabledTeams = []
    this.disabledUsers = []

    if (this.id) {
      await this.getDataInfo()
    }
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
    },
    getDataInfo() {
      this.assignmentObj.name = this.assignmentStore.assignmentInfo.name
      this.assignmentObj.start_date = this.assignmentStore.assignmentInfo.start_date.replace(/-/g, '/')
      this.assignmentObj.end_date = this.assignmentStore.assignmentInfo.end_date.replace(/-/g, '/')
      this.assignmentObj.is_active = this.assignmentStore.assignmentInfo.is_active
      this.assignmentObj.verify_completion = this.assignmentStore.assignmentInfo.verify_completion
      this.assignmentObj.name = this.assignmentStore.assignmentInfo.name
      this.assignmentObj.start_date = this.assignmentStore.assignmentInfo.start_date.replace(/-/g, '/')
      this.assignmentObj.end_date = this.assignmentStore.assignmentInfo.end_date.replace(/-/g, '/')
      this.assignmentObj.is_active = this.assignmentStore.assignmentInfo.is_active
      this.assignmentObj.verify_completion = this.assignmentStore.assignmentInfo.verify_completion

      if (this.assignmentStore.assignmentInfo.events.length > 0) {
        this.selected = this.assignmentStore.assignmentInfo.events.map((eve) => eve.sk)
        this.assignmentObj.events = this.assignmentStore.assignmentInfo.events.map((eve) => eve.sk)
        if (this.assignmentStore.assignmentInfo.events.length > 0) {
          this.selected = this.assignmentStore.assignmentInfo.events.map((eve) => eve.sk)
          this.assignmentObj.events = this.assignmentStore.assignmentInfo.events.map((eve) => eve.sk)
        }

        if (this.assignmentStore.assignmentInfo.teams.length > 0) {
          this.assignmentObj.teams = this.assignmentStore.assignmentInfo.teams.map((eve) => ({ label: eve.team_name, value: eve.sk }))
          if (this.assignmentStore.assignmentInfo.teams.length > 0) {
            this.assignmentObj.teams = this.assignmentStore.assignmentInfo.teams.map((eve) => ({ label: eve.team_name, value: eve.sk }))
            this.disabledTeams = this.assignmentObj.teams
          }

          if (this.assignmentStore.assignmentInfo.users.length > 0) {
            this.assignmentObj.users = this.assignmentStore.assignmentInfo.users.map((eve) => ({ label: eve, value: eve }))
            if (this.assignmentStore.assignmentInfo.users.length > 0) {
              this.assignmentObj.users = this.assignmentStore.assignmentInfo.users.map((eve) => ({ label: eve, value: eve }))
              this.disabledUsers = this.assignmentObj.users
            }
          }
        }
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
        await this.assignmentStore.updateCompanyAssignment(data)
        if (this.assignmentStore.statusOfAssignmentAPI) {
          //this.loadingStatus(true)
          await this.assignmentStore.updateCompanyAssignment(data)
          if (this.assignmentStore.statusOfAssignmentAPI) {
            this.$router.push({ name: 'company.course_assignments.course' })
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
            //await this.loadingStatus(true)
            await this.assignmentStore.fetchCompanyAssignmentGet(dataUpdate)
          }
        } else {
          //this.loadingStatus(true)
          await this.assignmentStore.createCompanyAssignment(data)
          //this.loadingStatus(true)
          await this.assignmentStore.createCompanyAssignment(data)

          if (this.assignmentStore.statusOfAssignmentAPI) {
            if (this.assignmentStore.statusOfAssignmentAPI) {
              this.$router.push({ name: 'company.course_assignments.course' })
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
        }
      }
    },
    onCancel() {
      this.$emit('onCancel', { show: true })
    },
    loadMoreTeams() {
      this.companyUserTeamsStore.fetchPaginatedCompanyTeams({ LastEvaluatedKey: this.companyUserTeamsStore.paginatedTeam })
    }
  },

  setup() {
    const coursesStore = useCoursesStore()
    const companyUserTeamsStore = useCompanyUserTeamsStore()
    const assignmentStore = useAssignmentStore()
    return { coursesStore, companyUserTeamsStore, assignmentStore }
  }
}
</script>
