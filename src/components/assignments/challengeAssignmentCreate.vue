<template>
  <div>
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 550px" transition-show="flip-up" transition-hide="flip-down">
        <q-card-section class="padding_12">
          <q-bar class="bg-white none-spacing">
            <p class="text-subtitle1 text-weight-bold ase-roboto ase-black-shade none-spacing">
              {{ title }}
            </p>
            <q-space />
            <q-btn class="ase-roboto ase-md" color="secondary" round size="sm" icon="close" @click="onCacel()" />
          </q-bar>
          <hr />
        </q-card-section>
        <q-form greedy @submit="onSubmit()" class="q-gutter-md">
          <q-card-section class="q-pt-none">
            <q-list class="row">
              <q-item class="col-12">
                <q-item-section>
                  <BaseInput
                    :disable="stateDisabled"
                    label="Name *"
                    :maxLength="50"
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
              <q-item class="col-6">
                <q-item-section>
                  <BaseInput
                    label="From Date"
                    type="date"
                    required
                    v-model="assignmentObj.start_date"
                    @update:model-value="listenToDataFrom"
                  />
                  <p v-if="assignmentObj.start_date_status" class="text-caption text-negative">{{ assignmentObj.start_date_status_msg }}</p>
                </q-item-section>
              </q-item>
              <q-item class="col-6">
                <q-item-section>
                  <BaseInput label="To Date" type="date" required v-model="assignmentObj.end_date" @update:model-value="listenToDataTo" />
                  <p v-if="assignmentObj.end_date_status" class="text-caption text-negative">{{ assignmentObj.end_date_status_msg }}</p>
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <multiple-select
                    :disabled="stateDisabled"
                    :densed="true"
                    v-model="assignmentObj.tags"
                    :options="teamsOptions"
                    :title="'Select tags'"
                    :autofocus="false"
                    :showMore="companyUserTeamsStore.showMore"
                    :loading="assignmentStore.isLoading"
                    @paginatedData="loadMoreTeams"
                    :errorStatus="assignmentStore.errorAssignment.tags"
                    :errorMessage="assignmentStore.errorAssignment.tags_msg"
                    :disabledList="disabledTeams"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <q-item-section>
                  <multiple-select
                    :disabled="stateDisabled"
                    :densed="true"
                    v-model="assignmentObj.teams"
                    :options="teamsOptions"
                    :title="'Select teams'"
                    :autofocus="false"
                    :showMore="companyUserTeamsStore.showMore"
                    :loading="assignmentStore.isLoading"
                    @paginatedData="loadMoreTeams"
                    :errorStatus="assignmentStore.errorAssignment.teams"
                    :errorMessage="assignmentStore.errorAssignment.teams_msg"
                    :disabledList="disabledTeams"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <q-item-section>
                  <multiple-select
                    :densed="true"
                    v-model="assignmentObj.users"
                    :options="companyUserTeamsStore.listOfUsersEmail"
                    :title="'Select users'"
                    :autofocus="false"
                    :loading="assignmentStore.isLoading"
                    :errorStatus="assignmentStore.errorAssignment.teams"
                    :errorMessage="assignmentStore.errorAssignment.teams_msg"
                    :disabledList="disabledUsers"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <q-item-section>
                  <q-slider marker-labels v-model="assignmentObj.percentage" markers :min="3.5" :max="10" />
                </q-item-section>
              </q-item>

              <q-item class="col-12 none_spacing">
                <q-item-section class="none_spacing">
                  <div>
                    <q-checkbox v-model="assignmentObj.verify_completion" label="Show answers on completion" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="right">
            <div></div>
            <div>
              <q-btn push class="ase-roboto ase-md" no-caps color="primary" @click="onSubmit()">Submit</q-btn>
            </div>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import BaseInput from 'components/shared/BaseInput.vue'
import MultipleSelect from 'components/shared/MultiSelectChip.vue'
import { useCoursesStore } from 'src/store/pinia/courses'
import { DateComparison, urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { maxLength, minLength } from 'src/utils/rules'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useAssignmentStore } from 'src/store/pinia/assignment'

export default {
  name: 'CreateChallengeAssignmentCreate',
  components: {
    'multiple-select': MultipleSelect,
    BaseInput
  },
  props: ['id', 'show', 'eventsList', 'title', 'stateDisabled'],
  data() {
    return {
      eventsOptions: [],
      showDialog: this.show,
      teamsOptions: [],
      usersOptions: [],
      assignmentObj: {
        name: '',
        start_date: '',
        end_date: '',
        users: [],
        teams: [],
        tags: [],
        events: [],
        is_active: false,
        verify_completion: true,
        percentage: 35
      },
      disabledTeams: [],
      disabledUsers: [],
      maxLength,
      minLength
    }
  },
  async created() {
    this.eventsOptions = []
    this.coursesStore.coursesData.forEach((data) => {
      this.eventsOptions.push({
        label: data.name,
        value: data.id
      })
    })
    this.companyUserTeamsStore.teamList.forEach((data) => {
      this.teamsOptions.push({
        label: data.name,
        value: data.id
      })
    })
    this.usersOptions = this.companyUserTeamsStore.listOfUsers
    this.disabledTeams = []
    this.disabledUsers = []
    if (this.id) {
      this.getDataInfo()
    }
  },
  methods: {
    base64encode(str) {
      const encode = encodeURIComponent(str).replace(/%([a-f0-9]{2})/gi, (m, $1) => String.fromCharCode(parseInt($1, 16)))
      return btoa(encode)
    },
    getDataInfo() {
      this.assignmentObj.name = this.assignmentStore.assignmentInfo.name
      this.assignmentObj.start_date = this.assignmentStore.assignmentInfo.start_date
      this.assignmentObj.end_date = this.assignmentStore.assignmentInfo.end_date
      this.assignmentObj.is_active = this.assignmentStore.assignmentInfo.is_active
      this.assignmentObj.verify_completion = this.assignmentStore.assignmentInfo.verify_completion

      if (this.assignmentStore.assignmentInfo.events.length > 0) {
        this.assignmentObj.events = this.assignmentStore.assignmentInfo.events.map((eve) => ({ label: eve.event_name, value: eve.sk }))
      }

      if (this.assignmentStore.assignmentInfo.teams.length > 0) {
        this.assignmentObj.teams = this.assignmentStore.assignmentInfo.teams.map((eve) => ({ label: eve.team_name, value: eve.sk }))
        this.disabledTeams = this.assignmentObj.teams
      }

      if (this.assignmentStore.assignmentInfo.users.length > 0) {
        this.assignmentObj.users = this.assignmentStore.assignmentInfo.users.map((eve) => ({ label: eve, value: eve }))
        this.disabledUsers = this.assignmentObj.users
      }
    },
    async onSubmit() {
      const data = {
        name: this.assignmentObj.name,
        start_date: this.assignmentObj.start_date,
        end_date: this.assignmentObj.end_date,
        verify_completion: this.assignmentObj.verify_completion,
        is_active: true
      }
      if (this.assignmentObj.users && this.assignmentObj.users.length > 0) {
        data.users = this.assignmentObj.users.map((user) => user.value)
      }
      if (this.assignmentObj.events && this.assignmentObj.events.length > 0) {
        data.events = this.assignmentObj.events.map((eve) => eve.value)
      }
      if (this.assignmentObj.teams && this.assignmentObj.teams.length > 0) {
        data.teams = this.assignmentObj.teams.map((eve) => eve.value)
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
        if (this.assignmentStore.statusOfAssignmentAPI === true) {
          this.$emit('onCacel', { show: true })
          this.assignmentObj = {
            name: '',
            start_date: '',
            end_date: '',
            teams: [],
            tags: [],
            events: [],
            verify_completion: true,
            is_active: false,
            percentage: 35
          }
          const dataUpdate = {
            assign_id: urlSafeBase64Decode(this.$route.params.assignmentId),
            extra: 'a_'
          }
          //await this.loadingStatus(true)
          await this.assignmentStore.fetchCompanyAssignmentGet(dataUpdate)
        } else {
          this.$emit('onCacel', { show: false })
        }
      } else {
        t //his.loadingStatus(true)
        await this.assignmentStore.createCompanyAssignment(data)

        if (this.assignmentStore.statusOfAssignmentAPI === true) {
          this.$emit('onCacel', { show: true })
          this.assignmentObj = {
            name: '',
            start_date: '',
            end_date: '',
            teams: [],
            tags: [],
            users: [],
            events: [],
            verify_completion: true,
            is_active: false,
            percentage: 35
          }
        } else {
          this.$emit('onCacel', { show: false })
        }
      }
    },
    validationData(from, to) {
      return DateComparison(from, to)
    },
    listenToDataTo(data) {
      this.assignmentObj.end_date = data
      if (this.assignmentObj.end_date && this.assignmentObj.start_date) {
        const infoData = this.validationData(this.assignmentObj.start_date, this.assignmentObj.end_date)
        this.assignmentObj.end_date_status = false
        this.assignmentObj.end_date_status_msg = ''
        if (!infoData) {
          this.assignmentObj.start_date_status = true
          this.assignmentObj.start_date_status_msg = "Ensure 'To' date must be greater than or equal to 'Start date'"
        } else {
          this.assignmentObj.start_date_status = false
          this.assignmentObj.start_date_status_msg = ''
        }
        if (this.assignmentObj.end_date && this.assignmentObj.start_date && infoData) {
          this.statsResults()
        }
      }
    },
    listenToDataFrom(data) {
      this.assignmentObj.start_date = data
      if (this.assignmentObj.end_date && this.assignmentObj.start_date) {
        const infoData = this.validationData(this.assignmentObj.start_date, this.assignmentObj.end_date)
        this.assignmentObj.start_date_status = false
        this.assignmentObj.start_date_status_msg = ''
        if (!infoData) {
          this.assignmentObj.end_date_status = true
          this.assignmentObj.end_date_status_msg = "Ensure 'Start date' must be less than or equal to 'To' date"
        } else {
          this.assignmentObj.end_date_status = false
          this.assignmentObj.end_date_status_msg = ''
        }
        if (this.assignmentObj.end_date && this.assignmentObj.start_date && infoData) {
          this.statsResults()
        }
      }
    },
    onCacel() {
      this.$emit('onCacel', { show: true })
    },
    loadMoreTeams() {
      const data = {
        LastEvaluatedKey: this.companyUserTeamsStore.paginatedTeam
      }
      this.isStatus(true)
      this.fetchPaginatedCompanyTeams(data)
    }
  },
  setup() {
    const coursesStore = useCoursesStore()
    const companyUserTeamsStore = useCompanyUserTeamsStore()
    const assignmentStore = useAssignmentStore()
    return { coursesStore, assignmentStore, companyUserTeamsStore }
  }
}
</script>

<style scoped></style>
