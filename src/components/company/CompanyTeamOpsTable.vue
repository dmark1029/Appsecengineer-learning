<template>
  <div>
    <BaseTable
      :columns="columns"
      row-key="sk"
      :rows="companyTeams.companyTeams"
      :rows-per-page-options="[0]"
      virtual-scroll
      style="max-height: calc(100vh - 300px)"
      hide-pagination
      :loading="companyTeams.loading"
      @virtual-scroll="loadMore"
      customClasses="sticky-head"
    >
      <template #body-cell-name="props">
        <q-td @click="showTeamInfo(props.row.sk, props.value)" class="cursor-pointer">
          {{ props.value }}
        </q-td>
      </template>
      <template #body-cell-serial_number="props">
        <q-td>
          {{ props.pageIndex + 1 }}
        </q-td>
      </template>
      <template #body-cell-action="props">
        <q-td class="q-gutter-sm">
          <div class="row q-gutter-md">
            <q-btn class="ase-roboto ase-md" round color="primary" @click="showUpdateTeam(props.row.sk)" size="sm">
              <q-avatar text-color="white" icon="edit" size="sm" />
            </q-btn>
            <q-btn round color="primary" @click="showDeleteTeam(props.row.sk, props.row.team_name)" size="sm">
              <q-avatar text-color="white" icon="delete" size="sm" />
            </q-btn>
          </div>
        </q-td>
      </template>
    </BaseTable>
  </div>
</template>
<script>
import { ref } from 'vue'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'

import { useRouter } from 'vue-router'
import { useCompanyTeam } from 'src/store/pinia/company/team.js'

export default {
  name: 'CompanyTeamOpsTable',
  components: {},
  setup(_, { emit }) {
    const companyTeams = useCompanyTeam()
    const router = useRouter()

    async function fetchCompanyTeam() {
      companyTeams.clearSearch()
    }
    const pageIndex = ref(undefined)

    function bootTeam() {
      if (companyTeams.companyTeams?.length) return
      fetchCompanyTeam()
    }

    bootTeam()

    async function loadMore(details) {
      if (details.index === companyTeams.companyTeams.length - 1 && companyTeams.payload.LastEvaluatedKey && !companyTeams.loading) {
        if (companyTeams.payload.name) {
          companyTeams.searchUsers()
        } else {
          companyTeams.fetchCompanyTeam()
        }
      }
    }

    const columns = [
      {
        name: 'serial_number',
        align: 'left',
        label: '#',
        field: 'serial_number'
      },
      {
        name: 'name',
        label: 'Name',
        field: 'team_name',
        sortable: true,
        align: 'left'
      },
      {
        name: 'action',
        label: '',
        field: 'Action',
        sortable: false,
        align: 'right'
      }
    ]

    const showTeamInfo = async (id, name) => {
      await router.push(`/portal/company/team-info/${urlSafeBase64Encode(id)}/${urlSafeBase64Encode(name)}/`)
    }

    const showUpdateTeam = (id) => {
      emit('showUpdateTeam', { show: true, id: id })
    }

    const showDeleteTeam = (id, name) => {
      emit('showDeleteTeam', { show: true, id: id, name: name })
    }

    return {
      companyTeams,
      loadMore,
      pageIndex,
      columns,
      showTeamInfo,
      showUpdateTeam,
      showDeleteTeam
    }
  }
}
</script>
