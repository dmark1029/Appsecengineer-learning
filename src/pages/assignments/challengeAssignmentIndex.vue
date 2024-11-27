<template>
  <div>
    <template v-if="!isCreate && !isDelete">
      <assignment-table
        @createPage="showCreate($event)"
        @updatePage="showUpdate($event)"
        @sendCertificate="sendCertificate($event)"
        @deletePage="showDelete($event)"
      ></assignment-table>
    </template>
    <template v-if="isCreate && !isDelete">
      <create-assignment
        :eventsList="eventsList"
        :id="updateId"
        :show="isCreate"
        :title="title"
        @onCacel="cancelCreateAssignment($event)"
      ></create-assignment>
    </template>
    <delete
      v-if="isDelete"
      :show="isDelete"
      :header="`to delete '${nameTemp}' assignment`"
      @confirmDelete="assignmentConfirmDeletion($event)"
      @confirmDeleteCancel="assignmentConfirmDeleteCancel($event)"
    ></delete>
    <q-dialog v-model="showCertificateDetails" persistent>
      <q-card style="min-width: 500px; min-height: 400px">
        <q-separator />
        <q-card-section>
          <template v-if="assignmentStore.certificateStatusInfo">
            <template v-if="assignmentStore.certificateStatusInfo.users">
              <div
                class="list-group-item overflow_scroll"
                v-for="(user, index) of assignmentStore.certificateStatusInfo.users"
                :key="user + 'indexInfoUser' + index"
              >
                <q-list bordered separator>
                  <q-item style="color: green">
                    <q-item-section>{{ user }}</q-item-section>
                  </q-item>
                </q-list>
              </div>
            </template>
          </template>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn color="primary" size="sm" label="Close" @click="confirmStatusCancel()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import CreateAssignment from 'components/assignments/challengeAssignmentCreate.vue'
import AssignmentTable from 'components/assignments/table.vue'
import Delete from 'components/shared/Delete.vue'
import { QSpinnerFacebook } from 'quasar'
import { useCoursesStore } from 'src/store/pinia/courses'

import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useAssignmentStore } from 'src/store/pinia/assignment'
import { storeToRefs } from 'pinia'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'

export default {
  name: 'ChallengeAssignmentIndex',
  components: {
    'assignment-table': AssignmentTable,
    'create-assignment': CreateAssignment,
    delete: Delete
  },
  data() {
    return {
      showCertificateDetails: false,
      isCreate: false,
      isDelete: false,
      assignmentId: '',
      updateId: '',
      title: 'Create Assignment',
      learningPathId: '',
      typeDelete: '',
      nameTemp: '',
      eventsList: []
    }
  },
  async created() {
    if (this.assignmentStore.assignmentList.length === 0) {
      const data = {}
      //await this.loadingStatus(true)
      await this.assignmentStore.fetchCompanyAssignmentList(data)
    }
  },
  watch: {
    'assignmentStore.isLoading': {
      handler() {
        if (this.assignmentStore.isLoading) {
          this.$q.loading.show({
            spinner: QSpinnerFacebook,
            spinnerColor: 'white',
            spinnerSize: 140,
            message: 'Hang on...',
            messageColor: 'white'
          })
        } else {
          this.$q.loading.hide()
        }
      }
    },
    'coursesStore.isLoading': {
      handler() {
        if (this.coursesStore.isLoading) {
          this.$q.loading.show({
            spinner: QSpinnerFacebook,
            spinnerColor: 'white',
            spinnerSize: 140,
            message: 'Hang on...',
            messageColor: 'white'
          })
        } else {
          this.$q.loading.hide()
        }
      }
    },
    'companyUserTeamsStore.isLoading': {
      handler() {
        if (this.companyUserTeamsStore.isLoading) {
          this.$q.loading.show({
            spinner: QSpinnerFacebook,
            spinnerColor: 'white',
            spinnerSize: 140,
            message: 'Hang on...',
            messageColor: 'white'
          })
        } else {
          this.$q.loading.hide()
        }
      }
    },
    'companyUsersStore.isLoading': {
      handler() {
        if (this.companyUsersStore.isLoading) {
          this.$q.loading.show({
            spinner: QSpinnerFacebook,
            spinnerColor: 'white',
            spinnerSize: 140,
            message: 'Hang on...',
            messageColor: 'white'
          })
        } else {
          this.$q.loading.hide()
        }
      }
    }
  },
  methods: {
    confirmStatusCancel() {
      this.showCertificateDetails = false
    },
    async showCreate(event) {
      if (this.coursesStore.coursesData.length === 0) {
        await this.coursesStore.fetchCourses()
      }
      if (this.companyUserTeamsStore.teamList.length === 0) {
        //this.isStatusUserTeams(true)
        const data = {}
        await this.companyUserTeamsStore.fetchCompanyTeams(data)
      }

      if (this.companyUserTeamsStore.listOfUsers.length === 0) {
        this.companyUserTeamsStore.allUsersList({ users: { all: true } })
      }

      this.assignmentStore.setErrorAssignment({
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
      if (event.show) {
        if (this.isCreate) {
          this.isCreate = false
        } else {
          this.title = ''
          this.title = 'Create Assignment'
          this.isCreate = true
          this.updateId = ''
        }
      }
    },
    async showUpdate(event) {
      if (this.companyUserTeamsStore.listOfUsers.length === 0) {
        this.companyUserTeamsStore.allUsersList({ users: { all: true } })
      }
      if (this.coursesStore.coursesData.length === 0) {
        await this.coursesStore.fetchCourses()
      }
      if (this.companyUserTeamsStore.teamList.length === 0) {
        //this.isStatusUserTeams(true)
        const data = {}
        await this.companyUserTeamsStore.fetchCompanyTeams(data)
      }
      this.assignmentStore.setErrorAssignment({
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
      if (event.show) {
        if (this.isCreate) {
          this.isCreate = false
        } else {
          this.title = ''
          this.title = 'Update  Assignment'
          const data = {
            assign_id: event.id,
            extra: 'a_'
          }
          //await this.loadingStatus(true)
          await this.assignmentStore.fetchCompanyAssignmentGet(data)
          this.isCreate = true
          this.updateId = event.id
        }
      }
    },
    showDelete(event) {
      if (event.show) {
        if (this.isDelete) {
          this.isDelete = false
        } else {
          this.isDelete = true
          this.assignmentId = ''
          this.nameTemp = event.name
          this.assignmentId = event.id
          this.typeDelete = null
        }
      }
    },
    assignmentConfirmDeletion(event) {
      if (event.show) {
        const data = {
          assign_id: this.assignmentId
        }
        //this.loadingStatus(true)
        this.assignmentStore.deleteCompanyAssignment(data)
        this.assignmentId = ''
        this.isDelete = false
      }
    },
    assignmentConfirmDeleteCancel(event) {
      if (event.show) {
        if (this.isDelete) {
          this.isDelete = false
        } else {
          this.isDelete = true
        }
      }
    },
    cancelCreateAssignment(event) {
      if (event.show) {
        this.isCreate = false
      }
    },
    async sendCertificate(event) {
      //await this.loadingStatus(true)
      await this.assignmentStore.assignCertificateSend({
        assign_id: event.id
      })
      if (this.assignmentStore.statusOfAssignmentAPI) {
        this.showCertificateDetails = true
      }
    }
  },
  setup() {
    const coursesStore = useCoursesStore()
    const companyUserTeamsStore = useCompanyUserTeamsStore()
    const assignmentStore = useAssignmentStore()
    const companyUsersStore = useCompanyConsumerStore()
    return { coursesStore, companyUserTeamsStore, assignmentStore, companyUsersStore }
  }
}
</script>
<style scoped>
.overflow_scroll {
  height: 300px;
  overflow-y: scroll;
}
</style>
