<template>
  <BaseCard bordered class="relative-position q-pa-md">
    <div>
      <q-item>
        <q-item-section avatar class="col-3">
          <q-icon name="fas fa-robot" size="50px" />
        </q-item-section>
        <q-item-section class="flex justify-center">
          <div>
            <p class="text-subtitle1 q-mb-none">AI Challenge</p>
            <p class="q-mb-none">By Artificial Intelligence</p>
            <p>
              <span class="text-bold text-subtitle1">{{ challenges.difficulty }}</span>
            </p>
          </div>
        </q-item-section>
        <div class="justify-center items-center flex">
          <q-btn color="green" label="start" @click="fetchSpecificChallenge(challenges._key)" />
        </div>
      </q-item>
    </div>
  </BaseCard>
</template>

<script setup>
import { useAiChallengesStore } from 'src/store/pinia/aiChallenges/aiChallenges'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { useRouter } from 'vue-router'

defineProps(['challenges'])

const aiChallenges = useAiChallengesStore()
const router = useRouter()

async function fetchSpecificChallenge(id) {
  await aiChallenges.fetchSpecificChallenge(id)
  router.push(`ai-challenge/${urlSafeBase64Encode(id)}`)
}
</script>
