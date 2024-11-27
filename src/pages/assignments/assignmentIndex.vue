<template>
  <div>
    <div v-if="!isCreate && !isDelete">
      <div class="row">
        <div class="col-12 justify-end row">
          <div class="" @click="changeView()" v-if="filterDataType !== 'Course'">
            <BaseBtn flat dense color="blue-10" v-if="viewType === 'ListView'" no-caps>
              <q-icon name="analytics"></q-icon>
              Reports
            </BaseBtn>
            <q-btn flat color="blue-10" v-else no-caps>
              <q-icon name="library_books"></q-icon>
              Assessments
            </q-btn>
          </div>
        </div>

        <div class="col-12" v-if="viewType === 'ListView'">
          <div class="flex flex-center absolute-center" v-if="assignmentStore.challengeAssignmentList.length === 0"></div>

          <TestsTable
            v-if="filterDataType === 'Tests'"
            :filterData="filterData"
            @updatePage="showUpdateTests($event)"
            @deletePage="showDelete($event)"
          >
            <template #filter-right-header>
              <BaseBtn
                v-if="(filterDataType !== 'Course' && viewType === 'ListView') || filterDataType === 'Course'"
                color="green-12"
                @click="showCreate({ show: true })"
                size="md"
              >
                Create
              </BaseBtn>
            </template>
          </TestsTable>
        </div>
        <div class="col-12" v-if="viewType === 'Dashboard' && filterDataType !== 'Course'">
          <Dashboard />
        </div>
      </div>
    </div>
    <div v-if="isCreate && !isDelete">
      <CreateAssignment
        :eventsList="eventsList"
        :id="updateId"
        :show="isCreate"
        :title="title"
        @onCancel="cancelCreateAssignment({ show: true })"
      />
    </div>
    <div v-if="isCreateTestsORInterview && !isDeleteTestsORInterview">
      <q-dialog v-model="isCreateTestsORInterview" persistent>
        <q-card>
          <CreateTests :id="''" v-if="typeRadio === 'Challenge'" @onCancel="cancelTestsORInterview({ show: true })">
            <template v-slot:closeBtn>
              <q-btn
                class="ase-roboto ase-md"
                color="secondary"
                round
                size="sm"
                icon="close"
                @click="cancelTestsORInterview({ show: true })"
              />
            </template>
            <template v-slot:selectDropdown>
              <q-radio name="typeRadio" v-model="typeRadio" val="Challenge" label="Tests" />
              <q-radio name="typeRadio" v-model="typeRadio" val="Interview" label="Interview" />
            </template>
          </CreateTests>
          <CreateInterview :id="''" v-if="typeRadio === 'Interview'" @onCancel="cancelTestsORInterview({ show: true })">
            <template v-slot:closeBtn>
              <q-btn
                class="ase-roboto ase-md"
                color="secondary"
                round
                size="sm"
                icon="close"
                @click="cancelTestsORInterview({ show: true })"
              />
            </template>
            <template v-slot:selectDropdown>
              <q-radio name="typeRadio" v-model="typeRadio" val="Challenge" label="Tests" />
              <q-radio name="typeRadio" v-model="typeRadio" val="Interview" label="Interview" />
            </template>
          </CreateInterview>
        </q-card>
      </q-dialog>
    </div>
    <div v-if="updateId && isCreateTests && !isDeleteTests">
      <q-dialog v-model="isCreateTests" persistent>
        <CreateTests @onCancel="cancelTestsORInterview({ show: true })" :id="updateId">
          <template v-slot:closeBtn>
            <q-btn class="ase-roboto ase-md" color="secondary" round size="sm" icon="close" @click="cancelCreateTests({ show: true })" />
          </template>
        </CreateTests>
      </q-dialog>
    </div>
    <div v-if="updateId && isCreateInterview && !isDeleteInterview">
      <q-dialog v-model="isCreateInterview" persistent>
        <CreateInterview :id="updateId" @onCancel="cancelTestsORInterview({ show: true })">
          <template v-slot:closeBtn>
            <q-btn
              class="ase-roboto ase-md"
              color="secondary"
              round
              size="sm"
              icon="close"
              @click="cancelCreateInterview({ show: true })"
            />
          </template>
        </CreateInterview>
      </q-dialog>
    </div>

    <delete
      v-if="isDelete"
      :show="isDelete"
      :header="`to delete '${nameTemp}' assignment`"
      :loading="testsStore.isLoading"
      @confirmDelete="assignmentTestsConfirmDeletion($event)"
      @confirmDeleteCancel="assignmentConfirmDeleteCancel($event)"
    />
    <q-dialog v-model="showCertificateDetails" persistent>
      <q-card style="min-width: 500px; min-height: 400px">
        <q-separator />
        <q-card-section v-if="assignmentStore.certificateStatusInfo && assignmentStore.certificateStatusInfo.users">
          <div v-for="(user, index) of assignmentStore.certificateStatusInfo.users" class="list-group-item overflow_scroll" :key="index">
            <q-list bordered separator>
              <q-item style="color: green">
                <q-item-section>{{ user }}</q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn color="primary" size="sm" label="Close" @click="confirmStatusCancel()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import CreateTests from 'components/assignments/challengeAssignment.vue'
import CreateAssignment from 'components/assignments/create.vue'
import CreateInterview from 'components/assignments/interviewAssignment.vue'
import Delete from 'components/shared/Delete.vue'
import Dashboard from 'components/tasks/Dashboard.vue'
import TestsTable from 'components/tasks/tableView.vue'

import { useTestsStore } from 'src/store/pinia/tests'
import { useAssignmentStore } from 'src/store/pinia/assignment'
import { defineComponent, onBeforeMount, ref, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineComponent({
  name: 'AssignmentIndexPageInfo'
})

const showCertificateDetails = shallowRef(false)
const isCreate = shallowRef(false)
const isCreateTests = shallowRef(false)
const isCreateTestsORInterview = shallowRef(false)
const isCreateInterview = shallowRef(false)
const isDelete = shallowRef(false)
const isDeleteTests = shallowRef(false)
const isDeleteInterview = shallowRef(false)
const isDeleteTestsORInterview = shallowRef(false)
const assignmentId = shallowRef('')
const updateId = shallowRef('')
const title = shallowRef('Assignment')
const typeDelete = shallowRef('')
const nameTemp = shallowRef('')
const eventsList = ref([])
const filterData = shallowRef('Valid')
const viewType = shallowRef('ListView')
const filterDataType = shallowRef('Tests')

const testsStore = useTestsStore()
const assignmentStore = useAssignmentStore()

const route = useRoute()
const router = useRouter()

onBeforeMount(async () => {
  if (route.name === 'company.course_assignments.course') {
    filterDataType.value = 'Course'
    await changeType('Course')
  } else {
    filterDataType.value = 'Tests'
    await changeType('Tests')
  }
})

function changeView() {
  viewType.value = viewType.value === 'ListView' ? 'Dashboard' : 'ListView'
}

function confirmStatusCancel() {
  showCertificateDetails.value = false
}
async function changeType(data) {
  if (data === 'Course') {
    if (assignmentStore.assignmentList.length === 0) {
      const data = {}
      await assignmentStore.fetchCompanyAssignmentList(data)
    }
  } else {
    if (assignmentStore.challengeAssignmentList.length === 0) {
      let data = {}
      const isEmptyPayload = Object.keys(assignmentStore.filterStateChallenge.finalPayload).length
      if (isEmptyPayload) {
        data = assignmentStore.filterStateChallenge.finalPayload
      } else {
        data = { status: 'active' }
      }
      await assignmentStore.fetchCompanyChallengeAssignmentList({ ...data, ...{ reset: true } })
    }
  }
}
async function showCreate(event) {
  if (event.show && filterDataType.value === 'Course') {
    if (isCreate.value) {
      isCreate.value = false
    } else {
      await router.push('/portal/company/assignments/create/course')
    }
  }
  if (event.show && filterDataType.value === 'Tests') {
    if (isCreateTestsORInterview.value) {
      isCreateTestsORInterview.value = false
    } else {
      title.value = ''

      await router.push('/portal/company/assignments/create/test')

      updateId.value = ''
    }
  }
}

function cancelTestsORInterview(event) {
  if (event.show) {
    isCreateTestsORInterview.value = false
    isCreateTests.value = false
    isCreateInterview.value = false
  }
}

async function showUpdateTests(event) {
  if (event.show && event.type === 'test') {
    isCreateTests.value = true
    updateId.value = event.id
  }
  if (event.show && event.type === 'interview') {
    isCreateInterview.value = true
    updateId.value = event.id
  }
}
function showDelete(event) {
  if (event.show) {
    if (isDelete.value) {
      isDelete.value = false
    } else {
      isDelete.value = true
      assignmentId.value = ''
      nameTemp.value = event.name
      assignmentId.value = event.id
      typeDelete.value = null
    }
  }
}
async function assignmentTestsConfirmDeletion(event) {
  if (event.show) {
    const data = {
      test: assignmentId.value
    }
    const res = await testsStore.deleteTests(data)
    assignmentId.value = ''
    isDelete.value = false
    if (res) {
      await assignmentStore.fetchCompanyChallengeAssignmentList({
        ...{ reset: true },
        ...(assignmentStore.filterStateChallenge.finalPayloadPlain || {})
      })
    }
  }
}
function assignmentConfirmDeleteCancel(event) {
  if (event.show) {
    isDelete.value = !isDelete.value
  }
}
function cancelCreateAssignment(event) {
  if (event.show) {
    isCreate.value = false
  }
}
function cancelCreateTests(event) {
  if (event.show) {
    isCreateTests.value = false
    updateId.value = ''
  }
}
function cancelCreateInterview(event) {
  if (event.show) {
    isCreateInterview.value = false
    updateId.value = ''
  }
}
</script>

<style scoped>
.overflow_scroll {
  height: 300px;
  overflow-y: scroll;
}
</style>
