import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { urlSafeBase64Decode } from '/src//utils/reuseFunctions'

export const useMediaStore = defineStore('media', () => {
  const isLoading = ref(false)
  const isError = ref('')
  const mediaData = ref({})

  async function getMediaData(payload) {
    try {
      isLoading.value = true
      const res = await api.post('item/get-by-id', payload)
      if (res.data.success) {
        const mediaInfo = {
          name: res.data.data.media_name,
          url: urlSafeBase64Decode(res.data.data.media_url),
          id: res.data.data.sk
        }
        mediaData.value = mediaInfo
      }
    } catch (error) {
      //
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    isError,
    mediaData,
    getMediaData
  }
})
