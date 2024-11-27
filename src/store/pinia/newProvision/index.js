import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { apiProvisional } from 'src/boot/axios'
import { useRouter } from 'vue-router'

export const useNewProvisionStore = defineStore('newProvision', () => {
  const isServerClicked = ref(false)
  const isServerStatus = ref(false)
  const isServerProvisioned = ref(false)
  const isServerDeleted = ref(false)
  const serverProgress = ref([])
  const provisionServerInfo = ref([])
  const completedSteps = ref(0)
  const isProvisionErrorMessage = ref('')
  const isProvisionError = ref(false)
  const isProvisionIPErrorMessage = ref('')
  const provisionerErrorMessage = ref('')
  const isProvisionDNSErrorMessage = ref('')
  const isProvisionServerStatusErrorMessage = ref('')
  const checkFinal = ref(0)
  const statusOfApi = ref(false)
  const markLab = ref(false)
  const feedBackStatus = ref(false)
  const feedBackItemDetails = ref({})
  const provisionCount = ref(0)
  const ipCount = ref(0)
  const go_next = ref(false)
  const go_next_ip = ref(false)
  const provisionReload = ref(false)
  const markResponse = ref('')

  const router = useRouter()

  function resetMarkResponse(status) {
    markResponse.value = status
  }

  async function clearStoragePopupLab(payload) {
    feedBackStatus.value = payload
    sessionStorage.setItem('feedback', payload)
  }
  async function deleteLabServer(payload) {
    try {
      statusOfApi.value = false
      markLab.value = false
      isServerDeleted.value = true
      const res = await apiProvisional.post('provision/delete-server', payload)
      if (!res.data.success) return
      isServerDeleted.value = false
      res.data.data.mark && (markLab.value = true)
      statusOfApi.value = true
    } catch (error) {
      console.log(error)
      statusOfApi.value = error.response.status === 404
      if (error.response.status === 400) {
        markLab.value = false
        statusOfApi.value = false
      }
      if (error.response.status === 401) {
        if (error.response.data.message === 'The incoming token has expired') {
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Token expired renewing new token' })
        }
      }
      if (typeof error.response.data.message === 'string') {
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
      }
    }
  }
  async function markTopicCompletedLab(payload) {
    try {
      feedBackItemDetails.value = {}
      feedBackStatus.value = false
      markResponse.value = ''
      const res = await api.post('item/mark', payload)
      markLab.value = false
      if (res.data.success) {
        if (Object.entries(res.data.data).length > 0) {
          if (res.data.data.feedback) {
            res.data.data.completed && (payload.feedback_completed = true)
            feedBackStatus.value = true
            if (res.data.data.badge) {
              payload.feedback_badge = true
              payload.redirect_badge_id = res.data.data.badge
            }
          }
        }
        feedBackItemDetails.value = payload
        markResponse.value = res.data.data.credential

        if(res.data?.data?.badge){
          router.push(`/portal/course-info/completed/${btoa(payload.event_id)}/${!res.data.data.completed ? btoa(res.data.data.badge) : ''}`)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  async function forceDeleteLabServer(payload) {
    try {
      isServerDeleted.value = true
      const res = await apiProvisional.post('provision/force-delete-server', payload)
      if (res.data.success) {
        isServerDeleted.value = false
        router.go()
      }
    } catch (error) {
      isServerDeleted.value = false
      console.log(error)
    }
  }

  return {
    isServerClicked,
    isServerStatus,
    isServerProvisioned,
    isServerDeleted,
    serverProgress,
    provisionServerInfo,
    completedSteps,
    isProvisionErrorMessage,
    isProvisionError,
    isProvisionIPErrorMessage,
    provisionerErrorMessage,
    isProvisionDNSErrorMessage,
    isProvisionServerStatusErrorMessage,
    checkFinal,
    statusOfApi,
    markLab,
    feedBackStatus,
    feedBackItemDetails,
    provisionCount,
    ipCount,
    go_next,
    go_next_ip,
    provisionReload,
    markResponse,
    clearStoragePopupLab,
    deleteLabServer,
    markTopicCompletedLab,
    forceDeleteLabServer,
    resetMarkResponse
  }
})
