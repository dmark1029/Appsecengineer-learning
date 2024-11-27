<template>
  <div class="column q-gutter-y-md">
    <BaseCard class="q-pa-md">
      <div class="text-h6">Tournaments ({{ assessmentStore?.assessments?.assessment_count }})</div>
      <BaseTable
        :columns="columns"
        :rows="[...(assessmentStore?.assessments?.assessment_data ?? [])]"
        :loading="assessmentStore?.assessmentLoading"
        @row-click="handleClick"
      />
    </BaseCard>
    <BaseCard class="q-pa-md">
      <div class="text-h6">Courses ({{ assessmentStore?.userAssign?.length ?? 0 }})</div>
      <BaseTable
        :columns="assignColumns"
        :rows="[...(assessmentStore?.userAssign ?? [])]"
        :loading="assessmentStore?.assignAssignmentLoading"
        @row-click="handleAssignClick"
        row-key="id"
      />
    </BaseCard>
  </div>
</template>

<script setup>
import { useAssessmentStore } from 'src/store/pinia/assessments/assessments'
import { useAssessment } from 'src/composables/use-assessment'
const assessmentStore = useAssessmentStore()
const assessment = useAssessment()
import { date } from 'quasar'
import { useRouter } from 'vue-router'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: 'name',
    format: (val) => `${val}`,
    sortable: true,
    style: 'max-width: 500px'
  },
  {
    name: 'start_date',
    align: 'left',
    label: 'Start Date',
    field: (item) => date.formatDate(item.start_date, 'DD MMM YYYY')
  },
  { name: 'end_date', align: 'left', label: 'End Date', field: (item) => date.formatDate(item.end_date, 'DD MMM YYYY'), sortable: true },
  { name: 'duration', align: 'left', label: 'Duration (mins)', field: (item) => item.duration, sortable: true }
]
const router = useRouter()

const assignColumns = [
  ...columns.filter((item) => item.name !== 'duration'),
  {
    name: 'status',
    align: 'left',
    label: 'Status',
    field: (item) => (item.status === 'EXPIRED' ? 'EXPIRED' : 'ACTIVE'),
    format: (val) => `${val}`,
    sortable: true
  }
]

assessmentStore.fetchUserAssign()

function handleClick() {
  assessment.redirectToAssessments()
}

function handleAssignClick(row, item) {
  router.push(`/portal/individual-user-assignment-details/${urlSafeBase64Encode(item.sk)}}/`)
}

function getFormatTime(duration = 0) {
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  if (hours === 0) return `${minutes}min`

  //avoid 0 min
  if (minutes === 0) return `${hours}hr`
  return `${hours}hr ${minutes}min`
}
</script>

<style lang="scss" scoped></style>
