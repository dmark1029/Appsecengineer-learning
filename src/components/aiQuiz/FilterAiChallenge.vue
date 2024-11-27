<template>
  <q-banner class="q-mb-md shadow-2" style="border-radius: 6px; padding: 2px">
    <div class="flex justify-between">
      <div class="flex q-ml-sm">
        <BaseSelect label="Language" :options="languages" v-model="selectedLanguage" class="q-mr-sm q-mt-lg" />
        <BaseInput label="Framework" v-model="selectedFramework" class="q-mr-sm q-mt-lg" />
        <BaseSelect label="Difficulty" :options="difficultyOptions" v-model="selectedDifficulty" class="q-mt-lg" />
      </div>
      <div class="row q-gutter-sm" style="padding: 21px">
        <BaseBtn no-caps @click="filterChallenges">Apply</BaseBtn>
        <BaseBtn :disabled="areFiltersEmpty" no-caps @click="clearFilters">Clear</BaseBtn>
      </div>
    </div>
  </q-banner>
</template>

<script setup>
import BaseSelect from 'components/shared/BaseSelect.vue'
import BaseInput from 'components/shared/BaseInput.vue'
import BaseBtn from 'components/wrappers/BaseBtn/BaseBtn.vue'
import { useAiChallengesStore } from 'src/store/pinia/aiChallenges/aiChallenges'
import { computed, ref } from 'vue'

const aiChallenges = useAiChallengesStore()

const languages = ref(['Java', 'Python', 'Javascript', 'C#', 'Ruby', 'Go', 'Kubernetes YAML', 'Terraform'])
const difficultyOptions = ['Basic', 'Intermediate', 'Advanced']

const selectedLanguage = ref(null)
const selectedFramework = ref(null)
const selectedDifficulty = ref(null)

const areFiltersEmpty = computed(() => {
  return !selectedLanguage.value && !selectedFramework.value && !selectedDifficulty.value
})

async function filterChallenges() {
  const payload = {
    language: selectedLanguage.value ? selectedLanguage.value.toLowerCase() : null,
    framework: selectedFramework.value ? selectedFramework.value.toLowerCase() : null,
    difficulty: selectedDifficulty.value ? selectedDifficulty.value.toLowerCase() : null
  }

  await aiChallenges.filterChallenges(payload)
}

async function clearFilters() {
  selectedLanguage.value = null
  selectedFramework.value = null
  selectedDifficulty.value = null

  aiChallenges.$reset()

  await aiChallenges.fetchSavedChallenges()
}
</script>
