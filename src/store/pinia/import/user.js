import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
const useImportStore = defineStore('importStore', () => {
  const acknowledgeLoading = ref(false)
  async function getPresignedUrl() {
    try {
      const { data } = await api.get('company/users/import')
      return data
    } catch (err) {
      return false
    }
  }

  async function getStatus() {
    try {
      const { data } = await api.get('company/users/import/status')

      return data
    } catch (err) {
      console.warn(err)
      return false
    }
  }

  async function acknowledgeStatus() {
    try {
      acknowledgeLoading.value = true
      const { data } = await api.delete('company/users/import/status')
      Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Acknowledged!' })
    } catch (err) {
      console.warn(err)
    } finally {
      acknowledgeLoading.value = false
    }
  }

  return {
    getPresignedUrl,
    getStatus,
    acknowledgeStatus
  }
})

export { useImportStore }
