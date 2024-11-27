import { defineStore } from 'pinia'
import axios from 'axios'
const useChatStore = defineStore('chatStore', () => {
  async function submitQuestions(payload = {}) {
    try {
      const { data } = await axios.post('https://appsec-gpt.fly.dev/', payload)
      return data
    } catch (err) {
      return false
    }
  }

  return {
    submitQuestions
  }
})

export { useChatStore }
