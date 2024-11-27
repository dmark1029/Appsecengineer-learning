import { defineStore } from 'pinia'
import { ref } from 'vue'
const useTournament = defineStore('tournament', () => {
  const tournament = ref([])

  async function fetchTournaments() {}

  return {
    tournament,
    fetchTournaments
  }
})

export { useTournament }
