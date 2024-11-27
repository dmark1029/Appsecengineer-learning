import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { computed, ref } from 'vue'
const useAssignmentCourse = defineStore('assignmentCourse', () => {
  const assignmentCourses = ref([])
  const payload = ref({})
  const searchData = ref('')
  const statusData = ref(['Valid'])
  const loading = ref(false)
  const updateStatus = ref(false) // status value when created and deleted one
  const optionsStatusData = [
    { label: 'Active', value: 'Valid', color: 'indigo-7' },
    { label: 'Expired', value: 'Expired', color: 'indigo-7' }
  ]

  async function fetchAssignmentCourse(status) {
    if (status === 'created' || status === 'deleted') {
      updateStatus.value = true
      assignmentCourses.value = []
    }
    loading.value = true
    try {
      const response = await api.post('company/assign/list', payload.value)
      assignmentCourses.value = [...assignmentCourses.value, ...(response?.data?.data?.Items ?? [])]
      payload.value.LastEvaluatedKey = response.data?.data?.LastEvaluatedKey ?? undefined
      if (payload.value.LastEvaluatedKey) {
        await fetchAssignmentCourse()
      }
    } catch (err) {
      console.warn(err)
    } finally {
      updateStatus.value = false
      loading.value = false
    }
  }

  const filteredAssignmentCourse = computed(() => {
    let filteredData = assignmentCourses.value
    if (searchData.value) {
      filteredData = filteredData.filter((item) => {
        return item.name.toLowerCase().includes(searchData.value?.toLowerCase())
      })
    }

    if (statusData.value.length) {
      filteredData = filteredData.filter((item) => {
        return statusData.value.includes(item.status_assignment)
      })
    }

    return filteredData
  })

  return {
    assignmentCourses,
    fetchAssignmentCourse,
    payload,
    searchData,
    optionsStatusData,
    statusData,
    loading,
    filteredAssignmentCourse,
    updateStatus
  }
})

export { useAssignmentCourse }
