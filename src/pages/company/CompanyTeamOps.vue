<template>
  <BaseCard class="br-4 column q-py-sm q-px-lg">
    <template v-if="!isCreate && !isDelete && !showIndividualTeam">
      <div class="row q-py-md">
        <div class="q-pa-xs col-12 q-gutter-y-lg" v-if="!isCreate && !isDelete">
          <div>
            <titleSearch
              createBtn
              :dropDown="false"
              showSearch
              v-model="search"
              @showCreate="enableCreateTeam($event)"
              @clearSearchData="companyTeams.clearSearch()"
              @searchData="setSearch(search)"
            />
          </div>
          <CompanyTeamOpsTable
            @showCreateTeam="enableCreateTeam($event)"
            @showIncludeUsers="enableIncludeUser($event)"
            @showUpdateTeam="enableUpdateTeam($event)"
            @showDeleteTeam="enableDeleteTeam($event)"
            @showTeamInfo="enableTeamInfo($event)"
          />
        </div>
      </div>
    </template>
    <template v-if="isCreate && !isDelete">
      <CreateCompanyTeam :id="updateId" :isCreate="isCreate" @onCacel="cancelCreateTeam($event)" :title="title"></CreateCompanyTeam>
    </template>
    <template v-if="isIncludeGroup">
      <IncludeUsersIntoGroup
        :isIncludeGroup="isIncludeGroup"
        :id="teamId"
        @showPopup="showPopup($event)"
        @onCacel="cancleIncludeUser($event)"
      />
    </template>
    <template v-if="isDelete">
      <Delete
        :show="isDelete"
        :header="`you want to delete ${teamName} Team`"
        @confirmDelete="teamConfirmDeletion($event)"
        @confirmDeleteCancel="teamConfirmDeleteCancel($event)"
      />
    </template>
    <template v-if="showIndividualTeam && !isCreate && !isDelete">
      <div>
        <label class="text-link" style="float: right" @click="backButton()">Back</label>
      </div>
      <CompanyIndividualTeamInfo />
    </template>
    <q-dialog v-model="errorIncludeUsers" persistent @escape-key="confirmCloseDisclimar()">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="padding_12">
          <q-bar class="bg-white none-spacing">
            <p class="text-subtitle1 text-weight-bold ase-roboto ase-black-shade">Disclaimer</p>
            <q-space />
            <q-btn color="secondary" round size="sm" icon="close" @click="confirmCloseDisclimar()" />
          </q-bar>
          <hr />
        </q-card-section>

        <q-separator />
        <q-card-section style="margin: 0% 1% 0% 1%">
          <div v-for="(value, name) in successErrorAttachUsers" v-bind:key="name">
            <p>
              <span class="ase-lg portal_bold">{{ name }}</span>
              :
              <span class="error_msg_color ase-lg">{{ value.message }}</span>
            </p>
          </div>
        </q-card-section>
        <br />
      </q-card>
    </q-dialog>
  </BaseCard>
</template>

<script>
import CompanyTeamOpsTable from 'components/company/CompanyTeamOpsTable.vue'
import CreateCompanyTeam from 'components/company/CreateCompanyTeam.vue'
import IncludeUsersIntoGroup from 'components/company/IncludeUsersIntoGroup.vue'
import titleSearch from 'components/company/companyInfo/titleSearch.vue'
import Delete from 'components/shared/Delete.vue'
import CompanyIndividualTeamInfo from 'pages/company/CompanyIndividualTeamInfo.vue'
import { QSpinnerFacebook, useQuasar } from 'quasar'

//setup
import { computed, ref, watch } from 'vue'
import { useCompanyTeam } from 'src/store/pinia/company/team.js'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { storeToRefs } from 'pinia'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'

export default {
  name: 'CompanyTeamOps',
  components: { CompanyTeamOpsTable, CreateCompanyTeam, IncludeUsersIntoGroup, CompanyIndividualTeamInfo, Delete, titleSearch },

  setup() {
    const isCreate = ref(false)
    const isDelete = ref(false)
    const showIndividualTeam = ref(false)
    const isIncludeGroup = ref(false)
    const errorIncludeUsers = ref(false)
    const updateId = ref('')
    const title = ref('Create Team')
    const teamId = ref('')
    const teamName = ref('')

    const $q = useQuasar()

    const companyUserTeamsStore = useCompanyUserTeamsStore()
    const companyUsersStore = useCompanyConsumerStore()

    const { isLoading } = storeToRefs(companyUserTeamsStore)

    const successErrorAttachUsers = computed(() => companyUserTeamsStore.user_attach_error_msg)

    const enableCreateTeam = (event) => {
      companyUserTeamsStore.errorMsgReset({ team_name: false, team_name_msg: '' })
      updateId.value = ''
      title.value = 'Create Team'
      if (event.show) {
        isCreate.value = true
      }
    }

    const cancelCreateTeam = (event) => {
      if (event.show) {
        isCreate.value = false
      }
    }

    const enableIncludeUser = (event) => {
      if (event.show) {
        companyUsersStore.fetchCompanyAllUsers({})
        teamId.value = ''
        teamId.value = event.id
        isIncludeGroup.value = true
      }
    }

    const cancleIncludeUser = (event) => {
      if (event.show) {
        teamId.value = ''
        isIncludeGroup.value = false
      }
    }

    const showPopup = (event) => {
      errorIncludeUsers.value = Boolean(event.show)
    }

    const backButton = () => {
      showIndividualTeam.value = false
    }

    const confirmCloseDisclimar = () => {
      errorIncludeUsers.value = false
    }

    const enableUpdateTeam = (event) => {
      companyUserTeamsStore.errorMsgReset({ team_name: false, team_name_msg: '' })
      if (event.show) {
        const data = {
          team_id: event.id
        }
        title.value = ''
        updateId.value = ''
        updateId.value = event.id
        title.value = 'Update Team'
        companyUserTeamsStore.fetchCompanyTeam(data)

        isCreate.value = true
      }
    }

    const enableDeleteTeam = (event) => {
      teamName.value = event.name
      if (event.show) {
        isDelete.value = true
        teamId.value = ''
        teamId.value = event.id
      }
    }

    const teamConfirmDeletion = (event) => {
      if (event.show) {
        const data = {
          team_id: teamId.value
        }
        companyTeams.deleteCompanyTeam(data)
        teamId.value = ''
        isDelete.value = false
      }
    }

    const teamConfirmDeleteCancel = (event) => {
      if (event.show) {
        isDelete.value = false
        teamId.value = ''
      }
    }

    const enableTeamInfo = (event) => {
      if (event.show) {
        const data = {
          team_id: event.id
        }
        showIndividualTeam.value = true
        companyUserTeamsStore.fetchUsersByTeam(data)
      }
    }

    watch(isLoading, (value) => {
      if (value) {
        $q.loading.show({
          spinner: QSpinnerFacebook,
          spinnerColor: 'white',
          spinnerSize: 140,
          message: 'Hang on...',
          messageColor: 'white'
        })
      } else {
        $q.loading.hide()
      }
    })

    const companyTeams = useCompanyTeam()

    function setSearch(value) {
      if (!value) return
      companyTeams.payload.name = value
      companyTeams.payload.LastEvaluatedKey = undefined
      companyTeams.companyTeams = []
      companyTeams.searchTeams()
    }

    const search = ref('')
    if (companyTeams.payload.name) search.value = companyTeams.payload.name

    return {
      isLoading,
      successErrorAttachUsers,
      search,
      isCreate,
      isDelete,
      showIndividualTeam,
      isIncludeGroup,
      errorIncludeUsers,
      updateId,
      title,
      teamId,
      teamName,
      enableCreateTeam,
      cancelCreateTeam,
      enableIncludeUser,
      cancleIncludeUser,
      showPopup,
      backButton,
      confirmCloseDisclimar,
      enableUpdateTeam,
      enableDeleteTeam,
      teamConfirmDeletion,
      teamConfirmDeleteCancel,
      enableTeamInfo,
      companyTeams,
      setSearch,
      companyUserTeamsStore,
      companyUsersStore
    }
  }
}
</script>
