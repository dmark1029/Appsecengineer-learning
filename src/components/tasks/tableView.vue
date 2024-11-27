<template>
  <div class="column q-gutter-y-lg">
    <BaseCard class="br-4" v-if="filtersData">
      <div>
        <div class="row q-pa-md">
          <div class="row items-center q-gutter-md">
            <BaseInput dense outlined v-model="searchData" placeholder="Search...">
              <template v-slot:append>
                <q-separator color="grey-10" vertical class="q-ma-sm" />
                <q-icon name="search" @click="typeDataSelection('searchValue', searchData)" class="cursor-pointer"></q-icon>
              </template>
            </BaseInput>
            <BaseOptionGroup
              :options="optionsTypeData"
              size="md"
              type="checkbox"
              v-model="typeData"
              @update:modelValue="typeDataSelection('typeValue', typeData)"
              inline
            />
            <BaseOptionGroup
              :options="optionsStatusData"
              size="md"
              type="checkbox"
              color="green"
              v-model="statusData"
              @update:modelValue="typeDataSelection('statusValue', statusData)"
              inline
            />

            <BaseInput v-model="startDate" mask="date" class="q-mt-sm" placeholder="Start Date">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="startDate" mask="YYYY/MM/DD" :options="(date) => (endDate ? date < endDate : true)">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </BaseInput>

            <BaseInput v-model="endDate" mask="date" placeholder="End date">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="endDate" mask="YYYY/MM/DD" :options="(date) => (startDate ? date > startDate : true)">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </BaseInput>

            <BaseBtn
              v-if="
                (dateRange.startDate !== startDate || dateRange.endDate !== endDate) &&
                endDate &&
                startDate &&
                validateDateFun(endDate) &&
                validateDateFun(startDate)
              "
              @click="typeDataSelection('dateValue', '')"
              outline
              color="black"
            >
              Update
            </BaseBtn>

            <BaseBtn @click="typeDataSelection('clearFilter', statusData)" color="primary">Clear filter</BaseBtn>

            <div>
              <slot name="filter-right-header"></slot>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
    <div :class="`row col-${filtersData ? 10 : 12}`">
      <q-infinite-scroll
        :disable="assignmentStore.paginatedChallengeAssignment.length > 20 ? false : true"
        @load="onLoad"
        :debounce="200"
        :offset="750"
        class="full-width"
      >
        <div :class="`row col-${filtersData ? 10 : 12} `">
          <BaseTable
            no-data-label="No Assessments added."
            :rows="assignmentStore.challengeAssignmentList"
            :columns="columns"
            :rows-per-page-options="[0]"
            row-key="name"
            virtual-scroll
            customClasses="full-width"
            style="max-height: calc(100vh - 300px)"
            :pagination="{ sortBy: 'start_date', descending: true }"
            :loading="assignmentStore.isLoading"
          >
            <template v-slot:body-cell-Name="props">
              <q-td :props="props">
                <div class="cursor_pointer" @click="actionItemAssignment(props.row)">
                  {{ props.row.name }}
                  <q-tooltip>{{ props.row.name }}</q-tooltip>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-duration="props">
              <q-td :props="props">
                <div class="text-subtitle2 ase-roboto cursor_pointer" @click="actionItemAssignment(props.row)">
                  {{ props.row.duration }} min
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-type="props">
              <q-td :props="props">
                <div class="cursor_pointer" @click="actionItemAssignment(props.row)">
                  {{ props.row.type }}
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-total_score="props">
              <q-td :props="props">
                <div class="cursor_pointer" @click="actionItemAssignment(props.row)">
                  {{ props.row.total_score }}
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-start_date="props">
              <q-td :props="props">
                <div class="cursor_pointer">
                  {{ updateDateFormatter(props.row.start_date) }}
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-end_date="props">
              <q-td :props="props">
                <div class="cursor_pointer">
                  {{ updateDateFormatter(props.row.end_date) }}
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-Action="props">
              <q-td :props="props">
                <div class="row justify-end">
                  <div>
                    <BaseBtn
                      icon="edit"
                      flat
                      dense
                      :disable="new Date().toISOString() > props.row?.start_date || props.row.active"
                      @click="updatePage(props.row.id, props.row, props.row.type)"
                      color="blue-5"
                    />
                    <q-tooltip size="md">Edit</q-tooltip>
                  </div>
                  <div>
                    <BaseBtn
                      icon="check"
                      flat
                      dense
                      color="green-12"
                      :disable="props.row.active"
                      @click="reportingFinalizeDialog(props.row)"
                    />
                    <q-tooltip size="md">Finalize</q-tooltip>
                  </div>
                  <div>
                    <BaseBtn
                      icon="delete"
                      flat
                      dense
                      :disable="new Date().toISOString() > props.row?.start_date || props.row.active"
                      @click="deletePage(props.row.id, props.row.name, props.row.type)"
                    />
                    <q-tooltip size="md">Delete</q-tooltip>
                  </div>
                </div>
              </q-td>
            </template>
          </BaseTable>
        </div>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="dark" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>

    <BaseDialog v-model="isReportingFinalizeDialog" persistent title="Finalize" @close="isReportingFinalizeDialog = false">
      <q-card-section class="text-subtitle1 text-center">
        <p>Are you sure you want to finalize the assessment?</p>
        <p class="q-mb-none text-body2 text-negative">
          Make sure the challenges are attached before Finalizing
          <br />
          Once finalized, you can't Edit or Delete the assessment
        </p>
      </q-card-section>

      <q-separator></q-separator>

      <q-card-actions align="right">
        <BaseBtn label="Cancel" size="md" color="primary" v-close-popup />
        <BaseBtn
          label="Finalize"
          color="primary"
          size="md"
          v-close-popup
          @click="reportingFinalize(reportingFinalizeData.id, reportingFinalizeData.name, reportingFinalizeData.type)"
          :loading="assignmentStore.isLoading"
        />
      </q-card-actions>
    </BaseDialog>
  </div>
</template>

<script setup>
import { dateFormatReadable, urlSafeBase64Encode, validateDate } from 'src/utils/reuseFunctions'
import { debounce } from 'quasar'

import { useAssignmentStore } from 'src/store/pinia/assignment'

import { watch, shallowRef, ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps(['filterData'])
const emit = defineEmits(['updatePage', 'deletePage'])

const assignmentStore = useAssignmentStore()

const router = useRouter()

const columns = ref([
  { name: 'Name', label: 'Name', field: 'name', sortable: true, align: 'left', classes: 'cursor-pointer' },
  { name: 'start_date', label: 'Start date', field: 'start_date', sortable: true, align: 'center' },
  { name: 'end_date', label: 'End date', field: 'end_date', sortable: true, align: 'center' },
  { name: 'duration', label: 'Duration', field: 'duration', sortable: true, align: 'center' },
  { name: 'type', label: 'Type', field: 'type', sortable: true, align: 'center' },
  { name: 'Action', label: 'Action', field: 'Action', sortable: false, align: 'right' }
])
const filtersData = shallowRef(true)
const isReportingFinalizeDialog = shallowRef(false)
const reportingFinalizeData = ref({})
const typeData = ref(['interview', 'test'])
const statusData = ref(['active'])
const optionsTypeData = ref([
  { label: 'Interviews', value: 'interview', color: 'indigo-7' },
  { label: 'Assessments', value: 'test', color: 'indigo-7' }
])
const optionsStatusData = ref([
  { label: 'Active', value: 'active', color: 'indigo-7' },
  { label: 'Expired', value: 'expired', color: 'indigo-7' }
])
const startDate = shallowRef('')
const endDate = shallowRef('')
const searchData = shallowRef('')
const dateRange = ref({
  startDate: '',
  endDate: ''
})

watch(startDate, (oldValue, newValue) => {
  if (oldValue && oldValue.trim() !== '') {
    statusData.value = []
  }
})

watch(endDate, (oldValue, newValue) => {
  if (oldValue && oldValue.trim() !== '') {
    statusData.value = []
  }
})

watch(statusData, (newValue, oldValue) => {
  if (newValue.length > 0) {
    startDate.value = ''
    endDate.value = ''
  }
})

function updatePage(id, row, type) {
  assignmentStore.updateTestsAssignmentInfo(row)
  emit('updatePage', { show: true, id: id, type: type })
}

function statePersistance() {
  if (assignmentStore.filterStateChallenge.test_type.length > 0) {
    typeData.value = assignmentStore.filterStateChallenge.test_type
  }
  if (assignmentStore.filterStateChallenge.status.length > 0) {
    statusData.value = assignmentStore.filterStateChallenge.status
  }
  if (assignmentStore.filterStateChallenge.search_term.length > 0) {
    searchData.value = assignmentStore.filterStateChallenge.search_term
  }
  if (assignmentStore.filterStateChallenge.start_date) {
    startDate.value = assignmentStore.filterStateChallenge.start_date
  }
  if (assignmentStore.filterStateChallenge.end_date) {
    endDate.value = assignmentStore.filterStateChallenge.end_date
  }
}

async function onLoad(_index, done) {
  const payloadData = {}
  if (startDate.value && endDate) {
    payloadData.start_date = startDate.value.replaceAll('/', '-')
    payloadData.end_date = endDate.value.replaceAll('/', '-')
  }
  if (searchData.value) {
    payloadData.search_term = searchData.value
  }
  if (typeData.value.length === 1) {
    payloadData.test_type = typeData.value[0]
  }
  if (statusData.value.length === 1) {
    payloadData.status = statusData.value[0]
  }
  assignmentStore.setStateChallenge({
    test_type: typeData,
    status: statusData,
    search_term: searchData,
    start_date: startDate,
    end_date: endDate,
    finalPayload: {
      pagination: assignmentStore.paginatedChallengeAssignment,
      reset: false,
      ...payloadData
    },
    finalPayloadPlain: payloadData
  })
  if (assignmentStore.paginatedChallengeAssignment && typeof assignmentStore.paginatedChallengeAssignment !== 'object') {
    await assignmentStore.fetchCompanyChallengeAssignmentList({
      last_value: assignmentStore.paginatedChallengeAssignment,
      reset: false,
      ...payloadData
    })
    done(!assignmentStore.paginatedChallengeAssignment)
  }
  done(!assignmentStore.paginatedChallengeAssignment)
}

async function actionItemAssignment(value) {
  await router.push(`/portal/company/test/${urlSafeBase64Encode(value.id)}/${urlSafeBase64Encode(value.name)}`)
}

function deletePage(id, name, type) {
  emit('deletePage', { show: true, id: id, name: name, type: type })
}

function reportingFinalizeDialog({ id, name, type }) {
  reportingFinalizeData.value = { id, name, type }
  isReportingFinalizeDialog.value = true
}

async function reportingFinalize(id) {
  await assignmentStore.finalizeLab({ test: id })
}

function validateDateFun(date) {
  return validateDate(date)
}

function updateDateFormatter(date) {
  return dateFormatReadable(date)
}

let typeDataSelection = (key, value) => {
  const payloadData = {}
  if (key === 'statusValue') {
    startDate.value = null
    endDate.value = null
  }
  if (key === 'dateValue') {
    payloadData.start_date = startDate.value.replaceAll('/', '-')
    payloadData.end_date = endDate.value.replaceAll('/', '-')
  }
  if (key === 'searchValue') {
    payloadData.search_term = searchData.value || undefined
  }
  if (typeData.value.length === 1) {
    payloadData.test_type = typeData.value[0]
  }
  if (key === 'statusValue' && value.length > 1) {
    statusData.value = [value[value.length - 1]]
  }
  if (key === 'clearFilter') {
    statusData.value = ['active']
  }
  if (statusData.value.length === 1) {
    payloadData.status = statusData.value[0]
  }
  assignmentStore.setStateChallenge({
    test_type: typeData,
    status: statusData,
    search_term: searchData,
    start_date: startDate,
    end_date: endDate,
    finalPayload: payloadData,
    finalPayloadPlain: payloadData
  })
  assignmentStore.fetchCompanyChallengeAssignmentList({ ...payloadData, ...{ reset: true } })
}

onBeforeMount(() => {
  statePersistance()
  typeDataSelection = debounce(typeDataSelection, 200)
})
</script>

<style scoped lang="scss">
.triangle {
  border-top-color: transparent;
  border-right-color: transparent;
  border-style: solid;
  border-width: 0 16px 10px 0;
  display: inline-block;
  filter: brightness(75%);
  height: 8px;
  position: absolute;
  right: 0;
  top: -10px;
  vertical-align: middle;
  width: 16px;

  &.valid {
    border-bottom-color: $green;
    border-left-color: $green;
  }

  &.expired {
    border-bottom-color: $red;
    border-left-color: $red;
  }
}
</style>
