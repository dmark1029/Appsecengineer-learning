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
        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit()" class="q-gutter-md">
            <q-list class="row">
              <q-item class="col-12">
                <q-item-section>
                  <BaseInput
                    :disabled="stateDisabled"
                    v-model="assignmentObj.name"
                    :maxLength="50"
                    label="Name *"
                    :rules="[...minLength(1), ...maxLength(50)]"
                  ></BaseInput>
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
              <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
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
                  ></multiple-select>
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
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
                  ></multiple-select>
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
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
                  ></multiple-select>
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-slider marker-labels v-model="assignmentObj.percentage" markers :min="3.5" :max="10" />
                </q-item-section>
              </q-item>

              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12 none_spacing">
                <q-item-section class="none_spacing">
                  <div>
                    <q-checkbox v-model="assignmentObj.verify_completion" label="Show answers on completion" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <div></div>
          <div>
            <q-btn push class="ase-roboto ase-md" no-caps color="primary" @click="onSubmit()">Submit</q-btn>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import BaseInput from 'components/shared/BaseInput.vue'
import MultipleSelect from 'components/shared/MultiSelectChip.vue'
import { DateComparison, urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { maxLength, minLength } from 'src/utils/rules'

import { useCoursesStore } from 'src/store/pinia/courses'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useAssignmentStore } from 'src/store/pinia/assignment'
import { storeToRefs } from 'pinia'

export default {
  name: 'CreateChallengeAssignmentCreate',
  components: {
    'multiple-select': MultipleSelect,
    BaseInput
  },
  props: ['id', 'show', 'eventsList', 'title', 'stateDisabled'],
  setup() {
    const coursesStore = useCoursesStore()
    const companyUserTeamsStore = useCompanyUserTeamsStore()
    const assignmentStore = useAssignmentStore()
    return {
      coursesStore,
      companyUserTeamsStore,
      assignmentStore
    }
  },

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
    this.coursesStore.coursesData.map((data) =>
      this.eventsOptions.push({
        label: data.name,
        value: data.id
      })
    )
    this.companyUserTeamsStore.teamList.map((data) =>
      this.teamsOptions.push({
        label: data.name,
        value: data.id
      })
    )
    this.usersOptions = this.companyUserTeamsStore.listOfUsers
    this.disabledTeams = []
    this.disabledUsers = []
    if (this.id) {
      await this.getDataInfo()
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

      const tempList = []
      if (this.assignmentStore.assignmentInfo.events.length > 0) {
        this.assignmentStore.assignmentInfo.events.map((eve) =>
          tempList.push({
            label: eve.event_name,
            value: eve.sk
          })
        )
      }
      this.assignmentObj.events = tempList

      const tempListTeams = []
      if (this.assignmentStore.assignmentInfo.teams.length > 0) {
        this.assignmentStore.assignmentInfo.teams.map((eve) =>
          tempListTeams.push({
            label: eve.team_name,
            value: eve.sk
          })
        )
        this.disabledTeams = tempListTeams
      }
      this.assignmentObj.teams = tempListTeams

      const tempListUsers = []
      if (this.assignmentStore.assignmentInfo.users.length > 0) {
        this.assignmentStore.assignmentInfo.users.map((eve) =>
          tempListUsers.push({
            label: eve,
            value: eve
          })
        )
        this.disabledUsers = tempListUsers
      }
      this.assignmentObj.users = tempListUsers
    },
    async onSubmit() {
      const data = {
        name: this.assignmentObj.name,
        start_date: this.assignmentObj.start_date,
        end_date: this.assignmentObj.end_date,
        verify_completion: this.assignmentObj.verify_completion,
        is_active: true
      }
      if (this.assignmentObj.users) {
        if (this.assignmentObj.users.length > 0) {
          const usersIDS = []
          for (const ids of this.assignmentObj.users) {
            usersIDS.push(ids.value)
          }
          data.users = usersIDS
        }
      }
      if (this.assignmentObj.events) {
        if (this.assignmentObj.events.length > 0) {
          const eventsIDS = []
          for (const ids of this.assignmentObj.events) {
            eventsIDS.push(ids.value)
          }
          data.events = eventsIDS
        }
      }
      if (this.assignmentObj.teams) {
        if (this.assignmentObj.teams.length > 0) {
          const teamsIDS = []
          for (const ids of this.assignmentObj.teams) {
            teamsIDS.push(ids.value)
          }
          data.teams = teamsIDS
        }
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
        //this.loadingStatus(true)
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
      //this.isStatus(true)
      this.companyUserTeamsStore.fetchPaginatedCompanyTeams(data)
    }
  }
}
</script>

<style scoped></style>
