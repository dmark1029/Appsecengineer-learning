import { defineStore } from 'pinia'
import { Notify, useQuasar } from 'quasar'
import { api, apiQuiz } from 'src/boot/axios'
import { loader, secondLoader } from 'src/utils/helpers'
import { ref } from 'vue'

const useAiChallengesStore = defineStore('aiChallenges', () => {
  const $q = useQuasar()
  const challenges = ref([])
  const challengeDetails = ref([])
  const specificChallenges = ref([])
  const filteredChallenges = ref([])
  const currentPage = ref(1)
  const pageInfo = ref([])
  const isLoading = ref(false)
  const listedChallenges = ref([])
  const attachedChallenges = ref([])
  const quizData = ref([])
  const getQuizAnswer = ref([])
  const isNextPage = ref(false)

  function $reset() {
    challenges.value = []
    currentPage.value = 1
    filteredChallenges.value = []
  }

  function $resetQuizAnswer() {
    getQuizAnswer.value = []
  }

  async function fetchSavedChallenges(reset = false) {
    $q.loading.show(secondLoader({}))
    try {
      isLoading.value = true
      if (reset) {
        challenges.value = []
      }
      const { data: res } = await apiQuiz.get(`custom-challenges?page=${currentPage.value || 1}`)
      if (res.success) {
        challenges.value.push(...res.data)
        isNextPage.value = res.next
        return res
      } else {
        Notify.create({
          type: 'positive',
          position: 'top',
          progress: true,
          timeout: 1000,
          color: 'red',
          message: 'Fetching saved challenges failed'
        })
        return false
      }
    } catch (err) {
      console.warn(err)
      return false
    } finally {
      isLoading.value = false
      $q.loading.hide()
    }
  }

  async function postNewChallenge(payload) {
    $q.loading.show(secondLoader({}))
    try {
      const { data: res } = await apiQuiz.post('custom-challenge/generate', payload)
      challengeDetails.value = res.data

      return res
    } catch (err) {
      console.warn(err)
      return false
    } finally {
      $q.loading.hide()
    }
  }

  async function saveChallenge(payload) {
    $q.loading.show(secondLoader({}))
    try {
      const { data } = await apiQuiz.post('custom-challenges', payload)

      challenges.value = []
      currentPage.value = 1
      await fetchSavedChallenges()

      return data
    } catch (err) {
      console.warn(err)
      return false
    } finally {
      $q.loading.hide()
    }
  }

  async function fetchSpecificChallenge(payload) {
    try {
      const { data } = await apiQuiz.get('custom-challenges', {
        params: {
          query: payload
        }
      })

      specificChallenges.value = data.data

      return data
    } catch (err) {
      console.warn(err)
      return false
    } finally {
    }
  }

  async function deleteChallenge(payload) {
    $q.loading.show(secondLoader({}))
    try {
      const { data } = await apiQuiz.delete('custom-challenges', {
        data: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const index = challenges.value.findIndex((challenge) => challenge.key !== payload)
      challenges.value.splice(index, 1)

      Notify.create({
        type: 'positive',
        position: 'top',
        progress: true,
        message: 'Removed Challenge',
        icon: 'done'
      })

      return data
    } catch (err) {
      console.warn(err)
      Notify.create({
        type: 'negative',
        position: 'top',
        progress: true,
        message: 'Error removing challenge',
        icon: 'report_problem'
      })

      return false
    } finally {
      $q.loading.hide()
    }
  }

  async function filterChallenges(payload) {
    $q.loading.show(secondLoader({}))
    try {
      const { data } = await apiQuiz.get('custom-challenges', {
        params: {
          language: payload.language,
          framework: payload.framework,
          difficulty: payload.difficulty
        }
      })

      filteredChallenges.value = data.data
      listedChallenges.value = filteredChallenges.value
      challenges.value = filteredChallenges.value
      pageInfo.value = data.page_info

      return data
    } catch (err) {
      console.warn(err)
      return false
    } finally {
      $q.loading.hide()
    }
  }

  async function listChallenges() {
    try {
      const { data } = await apiQuiz.get(`custom-challenges?page=1&size=20`)
      listedChallenges.value = data.data
      return data
    } catch (err) {
      console.warn(err)
      return false
    } finally {
    }
  }

  async function attachChallenge(payload) {
    $q.loading.show(loader({}))
    try {
      const { data } = await apiQuiz.post('publish-challenge', payload)

      Notify.create({
        type: 'positive',
        position: 'top',
        progress: true,
        message: 'Challenge attached',
        icon: 'done'
      })

      return data
    } catch (err) {
      console.warn(err)
      Notify.create({
        type: 'negative',
        position: 'top',
        progress: true,
        message: 'Error attaching challenge',
        icon: 'report_problem'
      })

      return false
    } finally {
      $q.loading.hide()
    }
  }

  async function detachChallenge(payload, loading = true) {
    loading && $q.loading.show(loader({}))
    try {
      const { data } = await apiQuiz.delete('publish-challenge', { data: payload })

      const index = listedChallenges.value.findIndex((challenge) => challenge._id === payload)
      listedChallenges.value.splice(index, 1)

      Notify.create({
        type: 'positive',
        position: 'top',
        progress: true,
        message: 'Challenge detached',
        icon: 'done'
      })

      return data
    } catch (err) {
      console.warn(err)
      Notify.create({
        type: 'negative',
        position: 'top',
        progress: true,
        message: 'Error detaching challenge',
        icon: 'report_problem'
      })

      return false
    } finally {
      loading && $q.loading.hide()
    }
  }

  async function getQuizData(payload) {
    try {
      isLoading.value = true
      const { data } = await api.post('item/get-by-id', payload)
      quizData.value = data.data
    } catch (err) {
      console.warn(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function validateAnswer(payload) {
    try {
      // isLoading.value = true
      const { data } = await apiQuiz.post('/evaluate-challenge', payload)
      getQuizAnswer.value = data.data
    } catch (err) {
      console.warn(err)
      return false
    } finally {
      // isLoading.value = false
    }
  }

  async function validateCodeAnswer(payload) {
    try {
      await apiQuiz.post('/validate-code', payload)

      setTimeout(async () => {
        const { data } = await apiQuiz.post('/check-progress', payload)
        getQuizAnswer.value = data.data
        if (data.data.status === 'pass') {
          Notify.create({
            type: 'positive',
            position: 'top',
            progress: true,
            message: 'Challenge passed',
            icon: 'done'
          })
        } else {
          Notify.create({
            type: 'negative',
            position: 'top',
            progress: true,
            message: 'Challenge failed',
            icon: 'report_problem'
          })
        }
      }, 10000)
    } catch (err) {
      console.warn(err)
      return false
    } finally {
    }
  }

  return {
    challenges,
    challengeDetails,
    specificChallenges,
    filteredChallenges,
    currentPage,
    pageInfo,
    isLoading,
    listedChallenges,
    attachedChallenges,
    quizData,
    getQuizAnswer,
    isNextPage,
    fetchSavedChallenges,
    postNewChallenge,
    saveChallenge,
    fetchSpecificChallenge,
    deleteChallenge,
    filterChallenges,
    attachChallenge,
    listChallenges,
    detachChallenge,
    $reset,
    getQuizData,
    validateAnswer,
    validateCodeAnswer,
    $resetQuizAnswer
  }
})

export { useAiChallengesStore }
