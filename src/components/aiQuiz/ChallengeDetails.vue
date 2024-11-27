<template>
  <div class="col-7 q-pl-md">
    <q-card style="border-radius: 6px !important">
      <q-card-section>
        <p class="text-subtitle1 q-mb-none text-bold">Instructions:</p>
        <p>Identify the vulnerability in this source code</p>
        <highlightjs :language="details.language" :code="urlSafeBase64Decode(details.code)" />

        <q-form @submit="saveChallenges">
          <div class="q-my-sm">
            <p class="text-subtitle1 q-mb-xs">Hints:</p>
            <div v-for="(hint, index) in details.hints" :key="index" class="q-mt-xs">
              <q-input :model-value="hint" filled readonly style="background-color: #edf1fa; border-radius: 6px" />
            </div>
          </div>

          <div class="flex justify-center q-py-sm">
            <q-btn class="q-pa-md text-center full-width" type="submit" label="Save Question" color="green" />
          </div>

          <div class="q-py-xs">
            <q-icon name="fas fa-thin fa-face-frown" color="grey-8" />
            <span class="q-ml-xs">
              Not happy?
              <q-btn class="q-ml-sm" unelevated color="primary" size="10.5px" @click="regenerate(details)">Regenerate</q-btn>
            </span>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useAiChallengesStore } from 'src/store/pinia/aiChallenges/aiChallenges'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import 'highlight.js/styles/stackoverflow-light.css'
import 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin'

const aiChallenges = useAiChallengesStore()
const router = useRouter()

const details = computed(() => aiChallenges.challengeDetails)

const highlightjs = hljsVuePlugin.component

const saveChallenges = async () => {
  const payload = {
    code: details.value.code,
    language: details.value.language,
    framework: details.value.framework,
    difficulty: details.value.difficulty,
    metadata: details.value.metadata,
    vulnerability: details.value.vulnerability,
    hints: details.value.hints,
    validation_type: details.value.validation_type
  }
  await aiChallenges.saveChallenge(payload).then(() => {
    router.push('custom-challenge/saved-challenges')
  })
}

const regenerate = async () => {
  const payload = {
    code: details.value.code,
    language: details.value.language,
    framework: details.value.framework,
    difficulty: details.value.difficulty,
    metadata: details.value.metadata,
    vulnerability: details.value.vulnerability,
    hints: details.value.hints
  }
  const newDetails = await aiChallenges.postNewChallenge(payload)
  details.value = newDetails
}
</script>
