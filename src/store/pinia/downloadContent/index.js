import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'

export const useDownloadContentStore = defineStore('downloadContent', () => {
  const isLoading = ref(false)
  const downloadData = ref({})
  const isError = ref('')

  async function getDownloadData(payload) {
    try {
      isLoading.value = true
      const res = await api.post('item/get-by-id', payload)
      if (res.data.success) {
        downloadData.value = {
          name: res.data.data.download_name,
          url: res.data.data.download_url,
          id: res.data.data.sk
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
    downloadData,
    getDownloadData
  }
})
