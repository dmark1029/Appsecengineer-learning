<template>
  <q-form v-if="!showThirdCard" @submit="submit">
    <q-card style="border-radius: 6px !important">
      <q-card-section>
        <p class="text-subtitle1 q-mb-xs">Programming Language *</p>
        <BaseSelect label="Choose a Language" :options="languages" v-model="language" required />

        <div class="flex row justify-between">
          <div class="col-6 q-pr-sm">
            <p class="text-subtitle1 q-mb-xs">Enter a Framework *</p>
            <BaseInput label="Enter a Framework" v-model="framework" required />
          </div>

          <div class="col-6">
            <p class="text-subtitle1 q-mb-xs">Vulnerability *</p>
            <BaseSelect label="Select Vulnerability" :options="vulnerabilityOptions" v-model="vulnerability" required />
          </div>
        </div>

        <div class="flex row justify-between">
          <div class="col-6 q-pr-sm">
            <p class="text-subtitle1 q-mb-xs">Difficulty Level *</p>
            <BaseSelect
              :bottom-slots="false"
              :options="difficultyOptions"
              label="Choose a Difficulty Level"
              v-model="difficulty"
              required
            />
          </div>

          <div class="col-6">
            <p class="text-subtitle1 q-mb-xs">Answer Type *</p>
            <BaseSelect :bottom-slots="false" :options="answerTypeOptions" label="Choose the Answer Type" v-model="answerType" />
          </div>
        </div>

        <p class="text-subtitle1 q-mt-md">Add additional context</p>
        <q-input v-model="metadata" filled type="textarea" style="background-color: #edf1fa; border-radius: 6px" />
      </q-card-section>
    </q-card>

    <div class="flex justify-center q-mt-md q-mb-xl">
      <q-btn class="q-pa-md text-center full-width" type="submit" color="primary">
        <q-icon name="fas fa-wand-magic-sparkles" size="xs" />
        <span class="q-ml-sm">Show me the Challenge!</span>
      </q-btn>
    </div>
  </q-form>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import { useAiChallengesStore } from 'src/store/pinia/aiChallenges/aiChallenges'

const aiChallenges = useAiChallengesStore()
const emit = defineEmits(['showChallenge'])

const showThirdCard = ref(false)
const answerType = ref('')
const language = ref('')
const framework = ref('')
const vulnerability = ref('')
const difficulty = ref('')
const metadata = ref('')

const languages = ['Java', 'Python', 'Javascript', 'C#', 'Ruby', 'Go']

const difficultyOptions = ['Random', 'Basic', 'Intermediate', 'Advanced']

const answerTypeOptions = ['Code', 'Text']

const vulnerabilityOptions = [
  'SQL Injection',
  'Command Injection',
  'File Upload Vulnerability',
  'XML Injection',
  'Server-Side Request Forgery',
  'Insecure Deserialization',
  'Excessive Data Exposure',
  'Insecure Direct Object Reference (Broken AuthZ)',
  'Mass Assignment',
  'Session Fixation'
]

const submit = async () => {
  if (difficulty.value === 'Random') {
    const options = difficultyOptions.filter((option) => option !== 'Random')
    difficulty.value = options[Math.floor(Math.random() * options.length)]
  }
  const payload = {
    language: language.value,
    framework: framework.value,
    difficulty: difficulty.value,
    metadata: metadata.value,
    vulnerability: vulnerability.value,
    validation_type: answerType.value
  }
  await aiChallenges.postNewChallenge(payload)
  emit('showChallenge')
}
</script>
