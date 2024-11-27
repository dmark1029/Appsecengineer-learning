<template>
  <section class="justify-evenly q-gutter-lg row">
    <span class="q-loading-spin" v-if="badgeStore.isLoading">
      <q-spinner-hourglass class="on-left" />
      Loading...
    </span>
    <div v-for="(medal, index) in medals" class="self-center" :key="index" v-else>
      <img :src="medal.image" alt="x" />
      <q-tooltip
        anchor="center middle"
        self="center middle"
        class="q-pa-xs text-center text-dark"
        style="border-radius: 14px; white-space: pre-line"
      >
        <q-card class="q-py-md" style="width: 22rem">
          <q-card-section class="q-py-none">
            <q-img :class="{ rotating: medal.history?.length }" :src="medal.image" width="8rem" />
            <div class="q-mt-md text-subtitle2">{{ medal.description }}</div>
          </q-card-section>
          <q-card-section v-if="medal.history?.length" class="q-py-none">
            <q-separator spaced="lg" />
            <p class="text-body2 text-bold text-left">History</p>
            <q-timeline class="text-left">
              <q-timeline-entry v-for="(time, index) in medal.history" :key="index" style="margin-bottom: -1.5rem">
                <div class="text-caption">{{ fullDateTimeUTC(time) }}</div>
              </q-timeline-entry>
            </q-timeline>
          </q-card-section>
        </q-card>
      </q-tooltip>
    </div>
  </section>
</template>

<script setup>
import { fullDateTimeUTC } from 'src/utils/reuseFunctions'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useBadgeStore } from 'src/store/pinia/badge'

const route = useRoute()

const badgeStore = useBadgeStore()

const streaks = [
  { name: 'ThreeDaysActivityStreak', description: 'Logged in and engaged for 3 consecutive days.' },
  { name: 'SevenDaysActivityStreak', description: 'Logged in and engaged for 7 consecutive days.' },
  { name: 'ThirtyDaysActivityStreak', description: 'Logged in and engaged for 30 consecutive days.' },
  { name: 'Guru', description: 'Achieve mastery by completing all courses in this Learning Path.' },
  { name: 'L337Streak', description: 'Earn the title of L337 Scientist by running 10 labs across Learning Paths.' },
  { name: 'InterapidChallengerStreak', description: 'Become an Intrepid Challenger by solving 3 challenges in AppSecEngineer.' },
  { name: 'Samurai', description: 'Attain the rank of Learning Path Samurai by conquering all challenges.' }
]

const medals = computed(() => {
  return streaks.map((streak) => {
    const matchingStreaks = badgeStore.streaks?.filter((item) => item.streak === streak.name)

    const totalCount = matchingStreaks?.reduce((total, _item) => total + 1, 0)

    return {
      description: streak.description,
      history: matchingStreaks?.map((item) => item.timestamp).filter((item) => item),
      image: totalCount > 0 ? `/streaks/full/${streak.name}.png` : `/streaks/empty/${streak.name}.png`,
      name: streak.name
    }
  })
})

onMounted(async () => {
  if (route.params.id) {
    await badgeStore.fetchPublicStreaks({ user: route.params.id })
    return
  }
  await badgeStore.fetchStreaks()
})
</script>

<style scoped>
.rotating {
  animation: rotating 1.6s cubic-bezier(0.22, 0.61, 0.36, 1);
}

@keyframes rotating {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(720deg);
  }
}
</style>
