import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { computed, ref } from 'vue'

export const useCompanyJourney = defineStore('companyJourney', () => {
  const journeys = ref([])

  async function fetchAllJourneys() {
    try {
      const res = await api.post('company/journey/list', {})
      if (res.data.success) {
        journeys.value = res.data?.data ?? []
      }
    } catch (error) {
      //
    }
  }

  const assignmentFormOptions = computed(() => {
    return journeys.value.map((journey) => {
      return { label: journey.name, value: journey.sk }
    })
  })

  return {
    journeys,
    assignmentFormOptions,
    fetchAllJourneys
  }
})
