<template>
  <div class="viewPages">
    <p class="text-subtitle1 text-weight-bold ase-roboto ase-black-shade">Permissions</p>
    <div class="row">
      <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12" v-if="!isCreate && !isDelete">
        <titleSearch
          :dropDown="false"
          :createBtn="true"
          @showCreate="enableCreate($event)"
          :showSearch="false"
          v-model="search"
          @searchData="searchData"
          @clearSearchData="clearSearchData"
        />
      </div>
      <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12" v-if="macroMetaStore.saveToken">
        {{ macroMetaStore.saveToken }}
      </div>
      <q-btn @click="deleteTokenData">Delete</q-btn>
    </div>
  </div>
</template>
<script>
import titleSearch from 'components/companyInfo/titleSearch.vue'
import { QSpinnerFacebook } from 'quasar'
import { useMacroMetaStore } from 'src/store/pinia/macroMeta'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'

export default {
  name: 'CompanyTeamOps',
  components: {
    titleSearch
  },

  setup() {
    const macroMetaStore = useMacroMetaStore()
    const companyUserTeamsStore = useCompanyUserTeamsStore()
    return { macroMetaStore, companyUserTeamsStore }
  },

  data() {
    return {
      search: '',
      isCreate: false,
      isDelete: false,
      showIndividualTeam: false,
      isIncludeGroup: false,
      errorIncludeUsers: false,
      updateId: '',
      title: 'Create Team',
      teamId: '',
      typeDelete: '',
      teamName: ''
    }
  },
  created() {
    this.macroMetaStore.fetchToken()
  },
  watch: {
    'macroMetaStore.isLoading': {
      handler() {
        if (this.macroMetaStore.isLoading) {
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
    enableCreate(event) {
      this.macroMetaStore.generateToken({})
    },
    deleteTokenData(event) {
      this.macroMetaStore.deleteToken({})
    },
    cancelCreateTeam(event) {
      if (event.show) {
        this.isCreate = false
      }
    },
    async clearSearchData() {
      const data = {}
      this.search = ''
      await this.companyUserTeamsStore.fetchCompanyTeams(data)
    },
    async searchData() {
      if (!this.search) {
        const data = {}
        await this.companyUserTeamsStore.fetchCompanyTeams(data)
      } else {
        const data = {
          name: this.search
        }
        await this.companyUserTeamsStore.searchCompanyTeam(data)
      }
    },
    teamConfirmDeletion(event) {
      if (event.show) {
        const data = {
          team_id: this.teamId
        }
        this.companyUserTeamsStore.deleteCompanyTeam(data)
        this.teamId = ''
        this.isDelete = false
      }
    },
    teamConfirmDeleteCancel(event) {
      if (event.show) {
        this.isDelete = false
        this.teamId = ''
      }
    }
  }
}
</script>
