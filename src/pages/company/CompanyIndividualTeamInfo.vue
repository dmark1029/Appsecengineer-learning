<template>
  <div class="text-subtitle1">
    {{ teamName }}
  </div>
  <BaseCard class="br-4 column q-py-lg q-px-lg">
    <div class="row q-col-gutter-lg">
      <div class="col-9">
        <CompanyIndividualTeamContent />
      </div>
      <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
        <StatisticCard :stats="statistics" />
      </div>
    </div>
  </BaseCard>
</template>

<script>
import CompanyIndividualTeamContent from 'components/company/CompanyIndividualTeamContent.vue'
import { QSpinnerFacebook } from 'quasar'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'

import useBreadcrumbs from 'src/composables/use-breadcrumb'
import StatisticCard from 'src/components/common/StatisticCard.vue'
import { useReportStore } from 'src/store/pinia/report'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
export default {
  name: 'CompanyIndividualTeamInfo',
  components: { CompanyIndividualTeamContent, StatisticCard },
  data() {
    return {
      teamName: urlSafeBase64Decode(this.$route.params.teamName)
    }
  },
  created() {
    const data = {
      team_id: urlSafeBase64Decode(this.$route.params.id)
    }
    this.companyUserTeamsStore.includeUsersFinalList({ users: { all: true }, team: data })

    this.reportStore.fetchTeamsUsersStats({ team_id: urlSafeBase64Decode(this.$route.params.id), select: 'overall' })
    this.reportStore.fetchTeamStatsCountFun({ select: 'team', team_id: urlSafeBase64Decode(this.$route.params.id) })
    this.setBreadcrumb([
      {
        label: this.teamName
      }
    ])
  },
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
  computed: {
    statistics() {
      return [
        {
          title: 'Active Users',
          count: this.reportStore.statsTeamCountData?.totalUsersCount || 0
        },
        {
          title: 'Certificates Earned',
          count: this.reportStore.statsTeamCountData.totalBadgesCount || 0
        },
        {
          title: 'Total Outliers',
          count: this.reportStore.teamUserStats.outliners ? this.reportStore.teamUserStats?.outliners?.length : 0 || 0
        }
      ]
    }
  },
  setup() {
    const reportStore = useReportStore()
    const companyUserTeamsStore = useCompanyUserTeamsStore()
    return {
      reportStore,
      ...useBreadcrumbs(),
      companyUserTeamsStore
    }
  }
}
</script>
