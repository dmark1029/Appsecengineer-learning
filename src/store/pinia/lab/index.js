import axios from 'axios'
import { Notify } from 'quasar'
import { urlSafeBase64Decode, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { apiChallenge } from 'src/boot/axios'
import { api } from 'src/boot/axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useLabStore = defineStore('labStore', () => {
  const isLoading = ref(false)
  const isError = ref('')
  const listLabData = ref([])
  const isLabInstruction = ref(false)
  const labInstructionInfo = ref('')
  const runningLabs = ref([])
  const individualLabInfo = ref({
    subject_id: '',
    event_id: ''
  })
  const challengeInfo = ref({})
  const challengeSolution = ref({})
  const challengeSolvedCount = ref(0)
  const individualUserChallengeSolvedCount = ref(0)
  const errorVerifyLab = ref({ status: false, status_msg: '', token: false, token_msg: '' })
  const statusOfApi = ref(false)
  const successResponseChallenge = ref('')
  const markdownData = ref('')

  async function manageLoading(callback, errorCallback = undefined) {
    try {
      isLoading.value = true
      return await callback()
    } catch (error) {
      return errorCallback ? errorCallback(error) : undefined
    } finally {
      isLoading.value = false
    }
  }

  const fetchLabInstructionInfo = computed(() => urlSafeBase64Decode(labInstructionInfo.value))

  function labInstructionStatus(status) {
    isLabInstruction.value = status
  }

  function errorMsgResetLab(data) {
    errorVerifyLab.value = data
  }

  function verifyLabAction(payload) {
    statusOfApi.value = false
    return manageLoading(
      async () => {
        successResponseChallenge.value = ''
        errorVerifyLab.value = { status: false, status_msg: '', token: false, token_msg: '' }
        const res = await apiChallenge.post('consumer/verify-challenge', payload)
        if (res.data.success) {
          statusOfApi.value = true
          successResponseChallenge.value = res.data.message
          errorVerifyLab.value = { status: true, status_msg: '', token: false, token_msg: '' }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: `${res.data.message}` })
        }
      },
      (error) => {
        if (error.toString() === 'Error: Network Error') {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Server busy please try later!' })
        }
        if (error.response.status !== 400) {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          return
        }
        const err_msgs = { status: false }
        Object.entries(payload).forEach(([key, value]) => {
          err_msgs[key] = false
          err_msgs[key + '_msg'] = ''
        })
        Object.entries(error.response.data.message).forEach(([key, value]) => {
          err_msgs[key] = true
          err_msgs[key + '_msg'] =
            typeof error.response.data.message[key] === 'object' ? error.response.data.message[key].toString() : value
        })
        errorVerifyLab.value = err_msgs
        if (typeof error.response.data.message === 'string') {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      }
    )
  }

  function fetchLabInstructions(payload) {
    return manageLoading(
      async () => {
        const res = await api.post('lab/instruction', payload)
        isLabInstruction.value = false
        res.data.success && (labInstructionInfo.value = res.data.data)
      },
      (err) => (isLabInstruction.value = false)
    )
  }

  function getMarkdownData(url) {
    return manageLoading(
      async () => {
        const res = await axios.get(url, {
          headers: {
            'Content-Type': 'text/markdown'
          }
        })
        markdownData.value = res.data
        return res
      },
      (error) => {
        Notify.create({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: error.response.data.message
        })
      }
    )
  }

  function fetchChallengeData(payload) {
    return manageLoading(async () => {
      challengeSolution.value = {}
      const res = await apiChallenge.post('consumer/get-challenge', payload)
      res.data.success && (challengeInfo.value = res.data.data)
    })
  }

  function fetchChallengeSolution(payload) {
    return manageLoading(
      async () => {
        challengeSolution.value = {}
        const res = await apiChallenge.post('consumer/get-solution', payload)
        res.data.success && (challengeSolution.value = res.data.data)
      },
      (err) => {
        if (typeof err.response.data.message === 'string') {
          Notify.create({
            type: 'negative',
            position: 'top',
            progress: true,
            icon: 'warning',
            message: err.response.data.message
          })
        }
      }
    )
  }

  function fetchChallengeSolvedCount() {
    return manageLoading(
      async () => {
        challengeSolvedCount.value = 0
        const res = await apiChallenge.get('consumer/challenge-solved-count')
        res.data.success && (challengeSolvedCount.value = res.data.data)
      },
      (err) => {
        if (typeof err.response.data.message === 'string') {
          Notify.create({
            type: 'negative',
            position: 'top',
            progress: true,
            icon: 'warning',
            message: err.response.data.message
          })
        }
      }
    )
  }

  function fetchIndividualUserChallengeSolvedCount(payload) {
    return manageLoading(
      async () => {
        individualUserChallengeSolvedCount.value = 0
        const res = await apiChallenge.post('/consumer/list-solved-challenges', payload)
        res.data.success && (individualUserChallengeSolvedCount.value = res.data.data)
      },
      (err) => {
        if (typeof err.response.data.message === 'string') {
          Notify.create({
            type: 'negative',
            position: 'top',
            progress: true,
            icon: 'warning',
            message: err.response.data.message
          })
        }
      }
    )
  }

  function fetchLabInfo(payload) {
    return manageLoading(async () => {
      const res = await api.post('lab/user-running-lab', payload, {
        crossDomain: true
      })
      const baseCondition = Object.keys(res.data.data.running_labs).length > 0

      listLabData.value = [
        {
          name: res.data.data.lab.lab_name,
          event_id: res.data.data.lab.event_id || res.data.data.running_labs.event_id,
          id: res.data.data.lab.sk,
          lab_id: urlSafeBase64Encode(res.data.data.lab.sk),
          description: res.data.data.lab.description,
          regions: res.data.data.lab.regions,
          challenge_id: res.data.data.lab.challenge_id || '',
          url_badge: res.data.data.url || '',
          is_alive: baseCondition ? res.data.data.running_labs.is_active : false,

          ...(baseCondition
            ? {
                dns_entry: 'https://' + res.data.data.running_labs.dns_entry,
                dns_pass_entry: res.data.data.running_labs.dns_entry,
                ipv4: res.data.data.running_labs.ipv4,
                password: res.data.data.running_labs.password,
                running_ttl: res.data.data.running_labs.running_ttl,
                created_on: res.data.data.running_labs.created_on,
                port_map: res.data.data.running_labs.port_map,
                running_instance_id: res.data.data.running_labs.pk,
                instance_id: res.data.data.running_labs.sk
              }
            : {}),

          ...(baseCondition && res.data?.data?.running_labs?.cloud_type === 'multi'
            ? {
                cloud_type: res.data.data.lab.cloud_type,
                password: res.data?.data?.running_labs?.credentials?.password,
                is_alive: true
              }
            : {}),

          ...(res.data.data.lab.is_cloud
            ? {
                ou_id: res.data.data.lab.ou_id,
                cloud_type: res.data.data.lab.cloud_type,
                is_cloud: res.data.data.lab.is_cloud
              }
            : {})
        }
      ]
    })
  }

  function fetchIndividualLabInfo(payload) {
    return manageLoading(async () => {
      individualLabInfo.value = {
        subject_id: '',
        event_id: ''
      }
      const res = await api.post('lab/user-lab', payload, {
        crossDomain: true
      })(
        (individualLabInfo.value = {
          subject_id: res.data.data.subject_id,
          event_id: res.data.data.event_id
        })
      )
    })
  }

  function fetchRunningLabs() {
    return manageLoading(async () => {
      const res = await api.get('lab/user-running-labs')
      if (res.data.success) {
        runningLabs.value = res.data.data?.map((labData) => {
          const lab = labData.running_lab
          return {
            name: labData.lab_name,
            id: labData.lab_id,
            event_id: labData.event_id,
            subject_id: labData.subject_id,
            event_name: labData.event_name,
            dns_entry: 'http://' + lab.dns_entry,
            running_instance_id: lab.pk,
            instance_id: lab.sk,
            running_ttl: lab.running_ttl,
            created_on: lab.created_on,
            password: lab.password,
            logo: labData.logo,
            challenge_id: lab.challenge_id || ''
          }
        })
      }
    })
  }

  return {
    isLoading,
    isError,
    listLabData,
    isLabInstruction,
    labInstructionInfo,
    runningLabs,
    individualLabInfo,
    challengeInfo,
    challengeSolution,
    challengeSolvedCount,
    individualUserChallengeSolvedCount,
    errorVerifyLab,
    statusOfApi,
    successResponseChallenge,
    fetchLabInstructionInfo,
    markdownData,
    verifyLabAction,
    fetchLabInstructions,
    getMarkdownData,
    fetchChallengeData,
    fetchChallengeSolution,
    fetchChallengeSolvedCount,
    fetchIndividualUserChallengeSolvedCount,
    fetchLabInfo,
    fetchIndividualLabInfo,
    fetchRunningLabs,
    labInstructionStatus,
    errorMsgResetLab
  }
})
