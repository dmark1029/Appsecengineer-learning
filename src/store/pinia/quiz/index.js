import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'

export const useQuizStore = defineStore('quizStore', () => {
  const isLoading = ref(false)
  const quizData = ref({})
  const isError = ref('')
  const aiquizData = ref({})

  async function getQuizData(payload) {
    try {
      isLoading.value = true
      const res = await api.post('item/get-by-id', payload, isLoading)
      if (res.data.success) {
        quizData.value = {
          id: res.data?.data?.sk,
          name: res.data?.data?.quiz_name,
          url: urlSafeBase64Decode(res.data?.data?.quiz_url)
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    isError,
    quizData,
    getQuizData
  }
})
