<template>
  <BaseCard class="q-pa-md br-4">
    <div class="row q-col-gutter-lg">
      <div class="col-6">
        <div class="q-mb-md col-12 row justify-end" v-if="!assignmentStore.assignmentInfo.delivery_id">
          <BaseBtn color="primary" @click="showCreateCertificate()">Create Certificate</BaseBtn>
        </div>
        <AssignmentGetInfo
          @updatePage="showUpdate($event)"
          @sendCertificate="isConfirmPopUpVerify($event)"
          @deletePage="showDelete($event)"
        ></AssignmentGetInfo>
      </div>
      <div class="col-6">
        <BaseCard class="rectangle">
          <BaseTabs
            align="left"
            no-caps
            v-model="tab"
            class="base-tabs"
            switch-indicator
            indicator-color="blue-12"
            active-bg-color="grey-12"
          >
            <q-tab name="Teams" v-if="assignmentStore.assignmentInfo.teams ? assignmentStore.assignmentInfo.teams.length > 0 : false">
              <p class="ase-roboto text-subtitle2 ase-black-shade line-height-normal none-spacing">Teams</p>
            </q-tab>
            <q-tab name="Courses">
              <p class="ase-roboto text-subtitle2 ase-black-shade line-height-normal none-spacing">Courses</p>
            </q-tab>
            <q-tab name="Users" v-if="assignmentStore.assignmentInfo.users ? assignmentStore.assignmentInfo.users.length > 0 : false">
              <p class="ase-roboto text-subtitle2 ase-black-shade line-height-normal none-spacing">Users</p>
            </q-tab>
            <q-tab name="Certificate Details" v-if="assignmentStore.assignmentInfo.details">
              <p class="ase-roboto text-subtitle2 ase-black-shade line-height-normal none-spacing">Certificate Details</p>
            </q-tab>
            <q-tab name="Issued Certificates" v-if="assignmentStore.assignmentInfo.details" @click="certificateInfoIssuedUsers">
              <p class="ase-roboto text-subtitle2 ase-black-shade line-height-normal none-spacing">Issued Certificates</p>
            </q-tab>
          </BaseTabs>

          <q-separator />

          <q-tab-panels v-model="tab" class="none-spacing q-pa-none">
            <q-tab-panel name="Teams">
              <teams-table
                :cmpId="companyUsersStore.companyInfo.id"
                :dataInfo="assignmentStore.assignmentInfo.teams ? assignmentStore.assignmentInfo.teams : []"
                :title="'Teams'"
              />
            </q-tab-panel>
            <q-tab-panel name="Users">
              <users-table
                :cmpId="companyUsersStore.companyInfo.id"
                :dataInfo="assignmentStore.assignmentInfo.users ? assignmentStore.assignmentInfo.users : []"
                :title="'Users'"
              />
            </q-tab-panel>
            <q-tab-panel name="Users">
              <users-table
                :cmpId="companyUsersStore.companyInfo.id"
                :dataInfo="assignmentStore.assignmentInfo.users ? assignmentStore.assignmentInfo.users : []"
                :title="'Users'"
              />
            </q-tab-panel>
            <q-tab-panel name="Courses">
              <events-table
                :title="'Courses'"
                :dataInfo="assignmentStore.assignmentInfo.events ? assignmentStore.assignmentInfo.events : []"
              ></events-table>
            </q-tab-panel>
            <q-tab-panel name="Certificate Details" v-if="assignmentStore.assignmentInfo.details">
              <DeliveryGetInfo />
            </q-tab-panel>
            <q-tab-panel name="Issued Certificates">
              <issued-certificates :title="'Issued Certificates'" :dataInfo="assignmentStore.issuedCertificateInfo"></issued-certificates>
            </q-tab-panel>
          </q-tab-panels>
        </BaseCard>
      </div>
    </div>
    <template v-if="isCreateCertificate && !isDeleteCertificate">
      <create-certificate
        :eventsList="eventsList"
        :id="updateIdCertificate"
        :show="isCreateCertificate"
        :title="titleCertificate"
        @onCacel="cancelCreateAssignmentCertificate($event)"
      />
    </template>
    <template v-if="isCreate && !isDelete">
      <create-assignment
        :eventsList="eventsList"
        :id="updateId"
        :show="isCreate"
        :title="title"
        :stateDisabled="assignmentStore.assignmentInfo.details ? assignmentStore.assignmentInfo.details.status === 'Sent' : false"
        @onCancel="cancelCreateAssignment($event)"
      />
    </template>
    <delete
      v-if="isDelete"
      :show="isDelete"
      :header="`to delete '${nameTemp}' assignment`"
      :loading="assignmentStore.isLoading"
      @confirmDelete="assignmentConfirmDeletion($event)"
      @confirmDeleteCancel="assignmentConfirmDeleteCancel($event)"
    />
    <BaseDialog v-model="showCertificateDetails" persistent title="Certificate issued" @close="confirmStatusCancel">
      <q-card-section>
        <div v-if="assignmentStore.certificateStatusInfo && assignmentStore.certificateStatusInfo.users" class="overflow_scroll">
          <q-list
            v-for="(user, index) of assignmentStore.certificateStatusInfo.users"
            bordered
            class="list-group-item"
            :key="index"
            separator
          >
            <q-item style="color: green">
              <q-item-section>{{ user }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <BaseBtn color="primary" label="Close" @click="confirmStatusCancel()" />
      </q-card-actions>
    </BaseDialog>
    <Confirm
      v-model="typeConfirm"
      :show="isConfirm"
      :header="'Are you sure to issue Certificate'"
      @confirmSend="sendCertificate($event)"
      @confirmSendCancel="confirmCancel($event)"
    ></Confirm>
    <BaseDialog
      v-model="isConfirmVerify"
      persistent
      title="Do you want to verify ?"
      width="200px"
      @close="confirmVerifyCancel"
      :style="{
        width: '300px'
      }"
    >
      <q-card-actions align="right" class="text-primary q-my-md">
        <BaseBtn color="primary" label="Close" @click="confirmVerifyCancel()" />
        <BaseBtn color="green-12" label="Verify" @click="confirmVerify()" />
      </q-card-actions>
    </BaseDialog>
    <BaseDialog v-model="showCustomFieldsPopup" persistent title="Add Custom Fields" @close="confirmCancelCustomFIeldds">
      <q-card-section>
        <q-form class="q-gutter-md" @submit.prevent="onSubmitVerificationOptionalFields()" ref="submitForm">
          <div class="row">
            <template v-if="customFieldsVerify.length > 0">
              <q-item v-for="fieldName in customFieldsVerify" class="col-12" :key="fieldName.key">
                <div style="width: 100%">
                  <BaseInput :label="`${fieldName.key} *`" v-model="fieldName.value" :rules="maxLength(50)" />
                  <p
                    v-if="
                      assignmentStore.errorVerification[fieldName.key] &&
                      !fieldName.value &&
                      assignmentStore.errorVerification[fieldName.key + '_msg'].length > 0
                    "
                    class="text-caption text-negative"
                  >
                    {{ assignmentStore.errorVerification[fieldName.key + '_msg'] }}
                  </p>
                </div>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row justify-end">
                <BaseBtn color="primary" :loading="assignmentStore.isLoading" type="submit">
                  SEND
                  <template v-slot:loading>
                    <q-spinner-hourglass class="on-left" />
                    Loading...
                  </template>
                </BaseBtn>
              </q-item>
            </template>
          </div>
        </q-form>
      </q-card-section>
    </BaseDialog>
    <BaseInnerLoading :showing="assignmentStore.isLoading || coursesStore.isLoading || companyUserTeamsStore.isLoading" />
  </BaseCard>
</template>

<script setup>
import AssignmentGetInfo from 'components/assignments/assignmentInfo.vue'
import CreateAssignment from 'components/assignments/create.vue'
import createCertificate from 'components/assignments/createCertificate.vue'
import DeliveryGetInfo from 'components/assignments/deliveryDetails.vue'
import EventsTable from 'components/assignments/eventsTable.vue'
import IssuedCertificates from 'components/assignments/issuedCertificates.vue'
import TeamsTable from 'components/assignments/teamsTable.vue'
import UsersTable from 'components/assignments/usersTable.vue'
import BaseInput from 'components/shared/BaseInput.vue'
import Confirm from 'components/shared/Confirm.vue'
import Delete from 'components/shared/Delete.vue'

import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'

import { maxLength } from 'src/utils/rules'

import useBreadcrumbs from 'src/composables/use-breadcrumb'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useAssignmentStore } from 'src/store/pinia/assignment'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'
import { defineComponent, onBeforeMount, ref, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseInnerLoading from 'src/components/wrappers/BaseInnerLoading/BaseInnerLoading.vue'

defineComponent({
  name: 'CertificateIndex'
})

const coursesStore = useCoursesStore()
const companyUserTeamsStore = useCompanyUserTeamsStore()
const assignmentStore = useAssignmentStore()
const companyUsersStore = useCompanyConsumerStore()

const breadCrumb = useBreadcrumbs()
const route = useRoute()
const router = useRouter()

const assignmentId = shallowRef('')
const customFieldsVerify = ref([])
const eventsList = ref([])
const isConfirm = shallowRef(false)
const isConfirmId = shallowRef('')
const isConfirmVerify = shallowRef(false)
const isCreate = shallowRef(false)
const isCreateCertificate = shallowRef(false)
const isDelete = shallowRef(false)
const isDeleteCertificate = shallowRef(false)
const nameTemp = shallowRef('')
const showCertificateDetails = shallowRef(false)
const showCustomFieldsPopup = shallowRef(false)
const tab = shallowRef('Courses')
const title = shallowRef('Create Assignment')
const titleCertificate = shallowRef('Create Certificate')
const typeConfirm = shallowRef('')
const updateId = shallowRef('')
const updateIdCertificate = shallowRef('')

onBeforeMount(async () => {
  const data = {
    assign_id: urlSafeBase64Decode(route.params.assignmentId),
    extra: 'a_'
  }

  await assignmentStore.fetchCompanyAssignmentGet(data)
  tab.value = assignmentStore.assignmentInfo.teams ? (assignmentStore.assignmentInfo.teams.length > 0 ? 'Teams' : 'Courses') : 'Courses'

  breadCrumb.setBreadcrumb([
    {
      label: assignmentStore.assignmentInfo.name
    }
  ])
})

function cancelCreateAssignmentCertificate() {
  isCreateCertificate.value = false
}

function showCreateCertificate(event) {
  assignmentStore.setErrorAssignment({
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
  isCreateCertificate.value = true
}

function confirmStatusCancel() {
  showCertificateDetails.value = false
}

async function isConfirmPopUpVerify(event) {
  isConfirmVerify.value = true
}
async function confirmVerifyCancel(event) {
  isConfirmVerify.value = false
}
async function confirmVerify(event) {
  isConfirmVerify.value = false
  isConfirmPopUp({ show: true })
}
async function isConfirmPopUp(event) {
  if (event.show) {
    await assignmentStore.fetchVerificationOptions({
      assign_id: urlSafeBase64Decode(route.params.assignmentId)
    })
    if (assignmentStore.statusOfVerifyAPI) {
      if (assignmentStore.verificationOptions.length === 0) {
        isConfirm.value = true
      } else {
        const dataList = assignmentStore.verificationOptions.map((data) => ({
          key: data.key,
          value: data.value
        }))
        customFieldsVerify.value = dataList
        showInfoVerify()
      }
      isConfirmId.value = event.id
    }
  }
}

function showInfoVerify() {
  showCustomFieldsPopup.value = true
}

function confirmCancelCustomFIeldds() {
  showCustomFieldsPopup.value = false
}

async function showUpdate(event) {
  assignmentStore.setErrorAssignment({
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
    if (isCreate.value) {
      isCreate.value = false
    } else {
      title.value = ''
      title.value = 'Update Assignment'
      const data = { assign_id: urlSafeBase64Decode(route.params.assignmentId), extra: 'a_' }
      //await loadingStatus(true)
      await assignmentStore.fetchCompanyAssignmentGet(data)
      isCreate.value = true
      updateId.value = event.id
    }
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
      typeConfirm.value = null
    }
  }
}

async function assignmentConfirmDeletion(event) {
  if (event.show) {
    const data = { assign_id: assignmentId.value }
    await assignmentStore.deleteCompanyAssignment(data)
    assignmentId.value = ''
    isDelete.value = false
    if (assignmentStore.statusOfAssignmentAPI) {
      await router.push({ name: 'company.course_assignments.course' })
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

function confirmCancel(event) {
  isConfirm.value = false
  typeConfirm.value = ''
  isConfirmId.value = ''
}

async function sendCertificate(event) {
  //await loadingStatus(true)
  await assignmentStore.assignCertificateSend({ assign_id: urlSafeBase64Decode(route.params.assignmentId) })
  if (assignmentStore.statusOfAssignmentAPI) {
    const data = { assign_id: urlSafeBase64Decode(route.params.assignmentId), extra: 'a_' }
    //await loadingStatus(true)
    await assignmentStore.fetchCompanyAssignmentGet(data)
    showCertificateDetails.value = true
    isConfirm.value = false
    typeConfirm.value = ''
  } else {
    showCertificateDetails.value = false
  }
  isConfirm.value = false
  typeConfirm.value = ''
}

async function certificateInfoIssuedUsers() {
  const data = { assign_id: urlSafeBase64Decode(route.params.assignmentId), startIndex: 0, length: 80 }
  await assignmentStore.fetchIssuedCertificateInfo(data)
}

async function onSubmitVerificationOptionalFields() {
  let trueStatus = true
  const err_msgs = {}
  customFieldsVerify.value.forEach((info) => {
    if (info.key && !info.value) {
      err_msgs[info.key] = true
      err_msgs[info.key + '_msg'] = 'Ensure this field has minimum 1 and maximum 50 characters.'
      trueStatus = false
    }
  })
  assignmentStore.errorMsgResetVerification(err_msgs)
  if (trueStatus) {
    const data = { assign_id: urlSafeBase64Decode(route.params.assignmentId) }
    customFieldsVerify.value.map((dataField) => (data[dataField.key] = dataField.value))
    //await loadingStatus(true)
    await assignmentStore.assignCertificateSend(data)
    if (assignmentStore.statusOfAssignmentAPI) {
      showCertificateDetails.value = true
      isConfirm.value = false
      showCustomFieldsPopup.value = false
      typeConfirm.value = ''
      const data = { assign_id: urlSafeBase64Decode(route.params.assignmentId), extra: 'a_' }
      await assignmentStore.fetchCompanyAssignmentGet(data)
    } else {
      showCertificateDetails.value = false
    }

    isConfirm.value = false
    typeConfirm.value = ''
  }
}
</script>

<style scoped>
.cardStyle {
  padding: 1%;
}
</style>
