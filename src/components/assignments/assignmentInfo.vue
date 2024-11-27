<template>
  <BaseCard class="br-2" flat bordered>
    <q-item>
      <q-item-section>
        <div class="text-subtitle1">{{ assignmentStore.assignmentInfo.name }}</div>
      </q-item-section>
    </q-item>
    <q-separator />

    <q-card-section>
      <div class="row">
        <div class="text-subtitle1 col-2">Start Date:</div>
        <div class="text-subtitle1">
          {{ assignmentStore.assignmentInfo.start_date ? updateDateFormatter(assignmentStore.assignmentInfo.start_date) : '' }}
        </div>
      </div>
      <div class="row q-mt-sm">
        <div class="text-subtitle1 col-2">End Date:</div>
        <div class="text-subtitle1">
          {{ assignmentStore.assignmentInfo.end_date ? updateDateFormatter(assignmentStore.assignmentInfo.end_date) : '' }}
        </div>
      </div>
      <div class="row q-mt-sm">
        <div class="text-subtitle1 col-2">Status:</div>
        <div class="text-subtitle1">
          {{ assignmentStore.assignmentInfo?.is_active ? 'Acitve' : 'Expired' }}
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions
      align="right"
      v-if="
        assignmentStore.assignmentInfo.delivery_id && assignmentStore.assignmentInfo.details
          ? assignmentStore.assignmentInfo.details.status !== 'Sent'
          : false
      "
      @click="sendCertificate(assignmentStore.assignmentInfo.sk)"
    >
      <q-btn color="green-12" @click="sendCertificate(assignmentStore.assignmentInfo.sk)">
        Send Certificate
        <q-avatar text-color="white" icon="send" size="sm" />
      </q-btn>
    </q-card-actions>
  </BaseCard>
  <div class="row items-center q-gutter-md q-mt-sm">
    <q-btn
      color="primary"
      @click="deletePage(assignmentStore.assignmentInfo.sk, assignmentStore.assignmentInfo.name)"
      label="DELETE"
      v-if="assignmentStore.assignmentInfo.details ? assignmentStore.assignmentInfo.details.status !== 'Sent' : true"
    ></q-btn>
    <q-btn
      label="edit"
      color="green-12"
      @click="updatePage(assignmentStore.assignmentInfo.sk)"
      v-if="
        statusDateFormatter(assignmentStore.assignmentInfo.end_date) !== 'EXPIRED' &&
        (assignmentStore.assignmentInfo.details ? assignmentStore.assignmentInfo.details.status !== 'Sent' : true)
      "
    ></q-btn>
  </div>
</template>
<script>
import { dateFormatReadable, differenceDates } from 'src/utils/reuseFunctions'
import { useAssignmentStore } from 'src/store/pinia/assignment'
export default {
  name: 'CompanyAssignmentGetInfo',
  created() {},
  watch: {},
  props: {
    showDataInfo: {
      default: true
    },
    showUpdatePage: {
      default: true
    }
  },
  setup() {
    const assignmentStore = useAssignmentStore()
    return {
      assignmentStore
    }
  },
  methods: {
    rollbackSettings() {
      this.$emit('rollbackSettingsData', {
        show: true
      })
    },
    updateDateFormatter(date) {
      return dateFormatReadable(date)
    },
    deletePage(id, name) {
      this.$emit('deletePage', { show: true, id: id, name: name })
    },
    updatePage(id) {
      this.$emit('updatePage', { show: true, id: id })
    },
    sendCertificate(id) {
      this.$emit('sendCertificate', { show: true, id: id })
    },
    statusDateFormatter(date) {
      const d = new Date()
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      const year = d.getFullYear()

      if (month.length < 2) {
        month = '0' + month
      }
      if (day.length < 2) {
        day = '0' + day
      }
      const finalDate = [year, month, day].join('-')
      return differenceDates('', date, finalDate)
    }
  }
}
</script>
