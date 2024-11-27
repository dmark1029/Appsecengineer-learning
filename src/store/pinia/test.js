import { defineStore } from 'pinia'

export const useTestStore = defineStore('testStore', {
  state: () => ({
    testValue: 10
  }),
  actions: {
    updateTestValue() {
      this.testValue++
    }
  }
})
