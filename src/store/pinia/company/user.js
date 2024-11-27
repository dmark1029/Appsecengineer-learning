import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
const useCompanyUsers = defineStore('companyUsers', () => {
  const companyUsers = ref([])
  const payload = ref({
    all: false,
    LastEvaluatedKey: undefined,
    name: undefined
  })
  const loading = ref(false)
  async function fetchCompanyUser() {
    loading.value = true
    try {
      const { data } = await api.post('company/users-list', payload.value)
      companyUsers.value.push(...(data?.data?.Items ?? []))
      payload.value.LastEvaluatedKey = data?.data?.LastEvaluatedKey
      return data
    } catch (err) {
      console.warn(err)
      return false
    } finally {
      loading.value = false
    }
  }

  function clearSearch() {
    payload.value.LastEvaluatedKey = undefined
    payload.value.name = undefined
    payload.value.all = false
    companyUsers.value = []
    fetchCompanyUser()
  }

  async function searchUsers() {
    payload.value.LastEvaluatedKey = undefined
    payload.value.name = search
    payload.value.all = undefined
    companyUsers.value = []
    fetchCompanyUser(true)
  }

  async function searchUsers() {
    loading.value = true
    try {
      const { data } = await api.post('company/search-user', payload.value)
      companyUsers.value.push(...(data?.data?.data ?? []))
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
    fetchCompanyUser,
    companyUsers,
    payload,
    loading,
    clearSearch,
    searchUsers
  }
})

export { useCompanyUsers }
