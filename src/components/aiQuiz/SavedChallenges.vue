<template>
  <section>
    <div class="flex justify-between q-mb-md">
      <p class="text-h6 q-mb-none">Saved Challenges</p>
      <q-btn flat color="black" :to="{ name: 'custom-challenge' }">
        <q-icon name="fas fa-wand-magic-sparkles" color="primary" />
        <span class="q-ml-sm text-primary" style="font-size: 1rem">Build Another Quiz</span>
      </q-btn>
    </div>
    <Filter />
    <q-infinite-scroll :offset="50">
      <div v-for="(challenges, index) in aiChallenges.challenges" :key="index" class="flex column q-mx-auto q-pt-md" style="width: 40vw">
        <q-card class="q-pa-none">
          <q-card-section>
            <div class="flex row justify-between">
              <div class="flex column">
                <div class="flex column">
                  <p class="text-subtitle1 q-mb-sm text-bold">
                    {{ challenges.name }}
                    <span class="text-subtitle2">(Randomly generated Challenge Name)</span>
                  </p>
                </div>
                <div>
                  <q-chip outline color="black" size="13px" text-color="white">Language: {{ challenges.language || 'None' }}</q-chip>
                  <q-chip v-if="challenges.framework" outline color="black" size="13px" text-color="white">
                    Framework: {{ challenges.framework || 'None' }}
                  </q-chip>
                  <q-chip outline color="black" size="13px" text-color="white">Proficiency: {{ challenges.difficulty }}</q-chip>
                </div>
              </div>
              <q-card-actions>
                <q-btn
                  color="grey"
                  round
                  flat
                  dense
                  :icon="isExpanded(index) ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                  @click="toggleExpanded(index)"
                />
              </q-card-actions>
            </div>
            <q-slide-transition>
              <div v-if="!isExpanded(index)" class="flex column">
                <highlightjs :language="challenges.language" :code="urlSafeBase64Decode(challenges.code)" style="width: 40vw" />
                <span class="text-subtitle2 q-mb-none">Hints:</span>
                <div v-for="(hint, index) in challenges.hints" :key="index" class="q-mt-xs">
                  <q-input :model-value="hint" filled readonly style="background-color: #edf1fa; border-radius: 6px" />
                </div>
              </div>
            </q-slide-transition>
          </q-card-section>
        </q-card>
        <div class="flex justify-between">
          <div v-if="!isExpanded(index)">
            <q-btn class="q-pa-xs" flat style="color: #000" @click="openDeleteDialog(challenges._key)">
              <q-icon name="delete" color="red" size="17px" />
              <span class="q-ml-xs text-caption" style="font-size: 13px">Delete</span>
            </q-btn>
          </div>
        </div>
      </div>
      <q-dialog v-model="deleteDialogVisible">
        <q-card>
          <q-card-section>
            <div class="text-h6">Are you sure you want to delete this challenge?</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn flat label="Delete" color="negative" @click="deleteChallenge(challengeToDelete)" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-infinite-scroll>
    <div v-if="aiChallenges.challenges.length === 0" class="text-center q-pa-lg">
      <q-card>
        <q-card-section>
          <div class="text-center q-pa-lg">
            <p class="text-h6">No challenges saved</p>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<script setup>
import hljsVuePlugin from '@highlightjs/vue-plugin'
import 'highlight.js/lib/common'
import 'highlight.js/styles/stackoverflow-light.css'
import { useAiChallengesStore } from 'src/store/pinia/aiChallenges/aiChallenges'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { ref, onMounted } from 'vue'
import Filter from './FilterAiChallenge.vue'

const aiChallenges = useAiChallengesStore()
const expandedItems = ref({})
const highlightjs = hljsVuePlugin.component
const deleteDialogVisible = ref(false)
let challengeToDelete = null

const fetchData = async () => {
  if (!aiChallenges.challenges.length) {
    await aiChallenges.fetchSavedChallenges(true)
  } else if (aiChallenges.isNextPage) {
    aiChallenges.currentPage++
    await aiChallenges.fetchSavedChallenges()
  }
}

onMounted(() => {
  fetchData()
})

const toggleExpanded = (index) => {
  if (expandedItems.value[index]) {
    expandedItems.value[index] = false
    return
  }

  Object.keys(expandedItems.value).forEach((key) => {
    expandedItems.value[key] = false
  })

  expandedItems.value[index] = true
}

const isExpanded = (index) => {
  return !expandedItems.value[index]
}

async function deleteChallenge(id) {
  const payload = {
    challenge: id
  }

  await aiChallenges.deleteChallenge(payload)
  deleteDialogVisible.value = false
}

function openDeleteDialog(challengeKey) {
  challengeToDelete = challengeKey
  deleteDialogVisible.value = true
}
</script>
