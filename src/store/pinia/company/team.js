import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { Notify } from 'quasar'
const useCompanyTeam = defineStore('companyTeam', () => {
  const companyTeams = ref([])
  const payload = ref({
    LastEvaluatedKey: undefined,
    name: undefined
  })
  const loading = ref(false)
  const isLoading = ref(false)
  const statusOfTeamAPI = ref({ status: false, data: '', info: [], message: '' })
  async function fetchCompanyTeam() {
    loading.value = true
    try {
      const { data } = await api.post('team/list', payload.value)
      //companyTeams.value.push(...(data?.data?.Items ?? []))
      const companyTeamData = data?.data?.Items.map((team) => ({
        created_on: team.created_on,
        pk: team.pk,
        search_name: team.search_name,
        team_name: team.team_name.toString(),
        sk: team.sk
        //teamId: urlSafeBase64Encode(team.sk)
      }))
      companyTeams.value = companyTeamData

      payload.value.LastEvaluatedKey = data?.data?.LastEvaluatedKey
      return data
    } catch (err) {
      console.warn(err)
      return false
    } finally {
      loading.value = false
    }
  }
  // Delete company team
  async function deleteCompanyTeam(payload) {
    loading.value = true
    try {
      const res = await api.post('team/delete', payload)
      if (res.data.success) {
        fetchCompanyTeam({})
        Notify.create({ type: 'positive', position: 'top', progress: true, message: 'The team has been successfully deleted' })
      } else {
        $q.notify({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: `${res.data.message}`
        })
      }
    } catch (err) {
      console.log(err)
    } finally {
      loading.value = false
    }
  }

  // Update Team
  async function updateCompanyTeam(payload) {
    loading.value = true
    try {
      const res = await api.post('team/update', payload)
      if (res.data.success) {
        statusOfTeamAPI.value = { status: false, data: '', info: [], message: res.data.message }
        fetchCompanyTeam({})
        Notify.create({ type: 'positive', position: 'top', progress: true, message: 'The team has been successfully updated' })
      } else {
        $q.notify({
          type: 'negative',
          message: `${res.data.message}`,
          position: 'top',
          progress: true,
          icon: 'warning'
        })
      }
    } catch (err) {
      console.log(err)
      Notify.create({ type: 'negative', position: 'top', progress: true, message: `${err.response.data.message}` })
    } finally {
      loading.value = false
    }
  }

  function clearSearch() {
    payload.value.LastEvaluatedKey = undefined
    payload.value.name = undefined
    companyTeams.value = []
    fetchCompanyTeam()
  }

  async function searchTeams() {
    payload.value.LastEvaluatedKey = undefined
    payload.value.name = search
    companyTeams.value = []
    fetchCompanyTeam(true)
  }

  async function searchTeams() {
    loading.value = true
    try {
      const { data } = await api.post('company/search-team', payload.value)
      companyTeams.value.push(...(data?.data?.data ?? []))
      payload.value.LastEvaluatedKey = data?.data?.LastEvaluatedKey
      return data
    } catch (err) {
      console.warn(err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    fetchCompanyTeam,
    companyTeams,
    payload,
    loading,
    clearSearch,
    searchTeams,
    deleteCompanyTeam,
    updateCompanyTeam,
    statusOfTeamAPI,
    isLoading
  }
})

export { useCompanyTeam }
