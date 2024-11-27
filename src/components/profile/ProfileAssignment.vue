<template>
  <q-card class="bg-transparent q-my-md" flat>
    <q-card-section>
      <p class="text-subtitle1">Basics</p>
      <AssignmentTable />
    </q-card-section>
  </q-card>
</template>

<script>
import AssignmentTable from 'components/assignments/userAssignmentTable.vue'
import { QSpinnerFacebook } from 'quasar'

import { useAssignmentStore } from 'src/store/pinia/assignment'

export default {
  name: 'AssignmentUserIndexIndividual',
  components: { AssignmentTable },
  setup() {
    const assignmentStore = useAssignmentStore()
    return {
      assignmentStore
    }
  },
  data() {
    return {
      isCreate: false,
      isDelete: false,
      assignmentId: '',
      updateId: '',
      title: 'Create Assignment',
      learningPathId: '',
      typeDelete: '',
      typeCreate: '',
      nameTemp: '',
      eventsList: []
    }
  },
  async created() {
    const data = {}
    //this.loadingStatus(true)
    this.assignmentStore.fetchCompanyAssignmentUserList(data)
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
  }
}
</script>
