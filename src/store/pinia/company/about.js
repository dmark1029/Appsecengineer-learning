import { defineStore } from 'pinia'
import { computed } from 'vue'
const useCompanySettings = defineStore('companySettings', () => {
  const statistics = computed(() => {
    return [
      {
        title: 'Company Name',
        count: getCompanyInfo.value?.name || '-'
      },
      {
        title: 'Subscription Start Date',
        count: getCompanyInfo.value.startDate || 0
      },
      {
        title: 'Subscription End Date',
        count: getCompanyInfo.value.endDate || 0
      },
      {
        title: 'Total Users',
        count: getCompanyInfo.value.totalUsers || 0
      },
      {
        title: 'Users Registered',
        count: getCompanyInfo.value.activeUsers || 0
      },
      {
        title: 'Remaining Users',
        count: getCompanyInfo.value.remainingUsers || 0
      }
    ]
  })
  return {
    statistics
  }
})

export { useCompanySettings }
