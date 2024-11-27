<template>
  <div class="column q-gutter-y-lg">
    <BaseCard class="br-4">
      <div class="row q-pa-md justify-between items-center">
        <div class="row items-center q-gutter-x-md">
          <BaseInput dense class="border-5" outlined v-model="assignmentCourse.searchData" placeholder="Search...">
            <template v-slot:append>
              <q-separator color="grey-10" vertical class="q-ma-sm" />
              <q-icon name="search" />
            </template>
          </BaseInput>
          <BaseOptionGroup
            :options="assignmentCourse.optionsStatusData"
            size="sm"
            type="checkbox"
            v-model="assignmentCourse.statusData"
            inline
            dense
            class="q-pa-sm"
          />
        </div>
        <BaseBtn color="green-12" :to="`/portal/company/assignments/create/${isJourney ? 'journey' : 'course'}`" padding="10px 20px">
          Create
        </BaseBtn>
      </div>
    </BaseCard>

    <BaseCard :class="`row col-12 q-pa-sm br-4`">
      <BaseTable
        no-data-label="No Assessments added."
        :rows="assignmentCourse.filteredAssignmentCourse"
        :columns="columns"
        :rows-per-page-options="[0]"
        row-key="name"
        virtual-scroll
        bordered
        customClasses="sticky-head full-width"
        style="max-height: calc(100vh - 300px)"
        :loading="assignmentCourse.loading"
      >
        >
        <template v-slot:body-cell-Name="props">
          <q-td :props="props">
            <div class="" @click="actionItemAssignment(props.row)">
              {{ props.row.name }}
            </div>
          </q-td>
        </template>
      </BaseTable>
    </BaseCard>
  </div>
</template>

<script setup>
import { useAssignmentCourse } from 'src/store/pinia/assignments/course.js'
import { dateFormatReadable, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  isJourney: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const assignmentCourse = useAssignmentCourse()

const columns = ref([
  {
    name: 'Name',
    label: 'Name',
    field: 'name',
    sortable: true,
    align: 'left',
    classes: 'cursor-pointer'
  },
  {
    name: 'start_date',
    label: 'Start date',
    field: (item) => dateFormatReadable(item.start_date),
    sortable: true,
    align: 'center'
  },
  {
    name: 'end_date',
    label: 'End date',
    field: (item) => dateFormatReadable(item.end_date),
    sortable: true,
    align: 'center'
  },
  {
    name: 'status_assignment',
    label: 'Status',
    field: (item) => item.status_assignment,
    sortable: true,
    align: 'center'
  }
])

async function actionItemAssignment(item) {
  await router.push(`/portal/company/assignments/${urlSafeBase64Encode(item.sk)}}`)
}
</script>

<style lang="scss" scoped></style>
