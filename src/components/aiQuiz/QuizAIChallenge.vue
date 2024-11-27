<template>
  <div class="flex row">
    <div class="col-md-6 col-sm-12 q-pr-md">
      <q-card flat>
        <q-card-section>
          <BaseMarkdown class="bg-blue-grey-1 q-pa-md" :content="urlSafeBase64Decode(aiChallenges.specificChallenges.code)" />
        </q-card-section>
      </q-card>
    </div>

    <div class="col-md-6 col-sm-12">
      <q-card>
        <q-card-section>
          <div>
            <p class="text-subtitle1 q-mb-none text-bold">Instructions</p>
            <p>{{ aiChallenges.specificChallenges.metadata }}</p>

            <p class="text-subtitle1 q-mb-none text-bold">Answer:</p>
            <q-input filled type="textarea" style="background-color: #edf1fa" />
          </div>

          <div class="flex q-mt-md">
            <q-btn class="q-mr-md text-black" label="Give me a Hint" size="12px" color="blue-1" @click="toggleHints" />
            <q-btn label="Show me the answer" icon="comment" size="12px" />
          </div>

          <q-slide-transition>
            <div v-if="showHints">
              <div v-for="(hint, index) in aiChallenges.specificChallenges.hints" :key="index" class="q-mt-xs">
                <q-input :model-value="hint" filled readonly style="background-color: #edf1fa; border-radius: 6px" />
              </div>
            </div>
          </q-slide-transition>

          <div class="flex justify-center q-mt-md">
            <q-btn class="q-pa-md text-center full-width" type="submit" color="primary">
              <span class="q-ml-sm">Submit Response</span>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import BaseMarkdown from 'components/shared/BaseMarkdown.vue'
import { ref } from 'vue'
import { useAiChallengesStore } from 'src/store/pinia/aiChallenges/aiChallenges'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'

const aiChallenges = useAiChallengesStore()

const showHints = ref(false)

const toggleHints = () => {
  showHints.value = !showHints.value
}
</script>
