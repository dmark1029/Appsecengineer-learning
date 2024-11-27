import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { default as axios } from 'axios'
import { Notify } from 'quasar'

export const useFileUploadStore = defineStore('fileUploadStore', () => {
  const isLoading = ref(false)

  async function getUrl(payload) {
    isLoading.value = true
    try {
      const response = await api.post('user/showcase', payload)
      isLoading.value = false
      return response.data
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }
  function handleMessage(status) {
    const messageMapping = {
      204: {
        type: 'positive',
        message: 'File uploaded successfully',
        icon: 'done'
      },
      '4xx': {
        type: 'negative',
        message: 'File upload failed. Please try again later',
        icon: 'warning'
      },
      '5xx': {
        type: 'negative',
        message: 'Internal server error. Please try again later',
        icon: 'warning'
      }
    }
    let notification
    switch (true) {
      case status === 204:
        notification = messageMapping[204]
        break
      case status >= 400 && status <= 499:
        notification = messageMapping['4xx']
        break
      default:
        notification = {
          type: 'negative',
          message: 'An unknown error occurred. Please try again later',
          icon: 'error'
        }
    }

    if (notification) {
      Notify.create({
        type: notification.type,
        position: 'top',
        progress: true,
        message: notification.message,
        timeout: 1100,
        icon: notification.icon
      })
    }
  }
  async function fileUpload({ signedUrl, form }) {
    isLoading.value = true
    try {
      const res = await axios.post(signedUrl, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      handleMessage(res.status)
      return res.status
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }
  return {
    isLoading,
    getUrl,
    fileUpload
  }
})
