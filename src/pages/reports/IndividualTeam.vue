<template>
  <div>
    <company-individual-team-content :id="id" :teamName="username" @singleUserTeam="singleUserTeam"></company-individual-team-content>
  </div>
</template>
<script>
import { QSpinnerFacebook } from 'quasar'

import CompanyIndividualTeamContent from './CompanyIndividualTeamContent.vue'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'

export default {
  name: 'CompanyIndividualTeamInfoReport',
  components: {
    'company-individual-team-content': CompanyIndividualTeamContent
  },
  props: {
    id: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  setup() {
    const companyUserTeamsStore = useCompanyUserTeamsStore()
    return {
      companyUserTeamsStore
    }
  },
  created() {},
  watch: {
    'companyUserTeamsStore.isLoading': {
      handler() {
        if (this.companyUserTeamsStore.isLoading) {
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
    singleUserTeam(event) {
      this.$emit('singleUserTeam', event)
    }
  }
}
</script>
