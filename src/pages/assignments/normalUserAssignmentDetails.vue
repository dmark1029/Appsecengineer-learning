<template>
  <div>
    <q-card class="cardStyle">
      <div class="row">
        <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <AssignmentGetInfo :showDataInfo="false" />
        </div>
        <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12 padding_7">
          <events-table-view-more
            :title="'Events'"
            :dataInfo="assignmentStore.assignmentInfo.events ? assignmentStore.assignmentInfo.events : []"
          ></events-table-view-more>
        </div>
      </div>
    </q-card>
  </div>
</template>
<script>
import AssignmentGetInfo from 'components/assignments/assignmentInfo.vue'
import EventsTable from 'components/assignments/eventsTableUser.vue'
import { QSpinnerFacebook } from 'quasar'
import { useCoursesStore } from 'src/store/pinia/courses'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'

import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useAssignmentStore } from 'src/store/pinia/assignment'

export default {
  name: 'normalUserAssignmentDetailsCertificateIndex',
  components: {
    'events-table-view-more': EventsTable,
    AssignmentGetInfo: AssignmentGetInfo
  },
  data() {
    return {
      isCreate: false,
      isDelete: false,
      assignmentId: '',
      updateId: '',
      title: 'Create Certificate',
      learningPathId: '',
      typeDelete: '',
      typeCreate: '',
      nameTemp: '',
      eventsList: []
    }
  },
  async created() {
    const data = {
      assign_id: urlSafeBase64Decode(this.$route.params.assignmentId)
    }
    //await this.loadingStatus(true)
    await this.assignmentStore.fetchCompanyAssignmentGet(data)
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
    }
  },
  methods: {
    async rollbackAssignments() {
      await this.$router.push({ name: 'company.assignments' })
    },
    async showCreate(event) {
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
      this.isCreate = true
    },
    async showUpdate(event) {
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
            assign_id: event.id
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

<style scoped>
.cardStyle {
  padding: 1%;
}
</style>
