<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card flat class="q-pa-sm" style="width: 800px; max-width: 90vw" transition-show="flip-up" transition-hide="flip-down">
      <div class="q-py-sm">
        <q-bar class="bg-white none-spacing">
          <p class="text-subtitle1 ase-roboto ase-black-shade none-spacing">Attach Custom Challenge</p>
          <q-space />
          <q-btn class="ase-roboto text-caption" color="secondary" icon="close" round size="sm" @click="onCancel({ show: true })" />
        </q-bar>
      </div>
      <q-separator></q-separator>
      <q-form class="row justify-center q-py-md" greedy @submit="submit()">
        <div class="flex">
          <div class="flex">
            <BaseSelect label="Language" :options="languages" v-model="selectedLanguage" class="col-auto q-mr-sm radius-8" />
            <BaseInput label="Framework" v-model="selectedFramework" class="col-auto q-mr-sm radius-8" />
          </div>

          <div>
            <q-btn
              class="col-auto q-mr-sm radius-8"
              color="indigo-8"
              no-caps
              @click="filterChallenges()"
              :disabled="!languages?.length > 0"
            >
              Apply
            </q-btn>
            <q-btn class="col-auto radius-8" color="indigo-8" no-caps @click="clearFilters()">Clear</q-btn>
          </div>
        </div>
        <div class="col-12">
          <BaseSelect
            label="List of challenges *"
            multiple
            :options="selectValue"
            v-model="selectedChallenges"
            :option-disable="(opt) => getDisable(opt)"
          />
        </div>
        <div class="col-12" align="right">
          <q-btn
            color="secondary"
            :disabled="!selectValue?.length || !selectedChallenges || testsStore.isLoading"
            :loading="testsStore.isLoading"
            label="Submit"
            type="submit"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import BaseSelect from 'components/shared/BaseSelect.vue'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { useAiChallengesStore } from 'src/store/pinia/aiChallenges/aiChallenges'
import { computed, onMounted, ref } from 'vue'
import { BaseInput } from '../wrappers/BaseInput'
import { useRoute } from 'vue-router'

import { useTestsStore } from 'src/store/pinia/tests'
import { useAssignmentStore } from 'src/store/pinia/assignment'

const aiChallenges = useAiChallengesStore()
const testsStore = useTestsStore()
const assignmentStore = useAssignmentStore()
const route = useRoute()

const emit = defineEmits(['onCancel'])
const props = defineProps(['show', 'name'])

const showDialog = props.show
const languages = ref(['Java', 'Python', 'Javascript', 'C#', 'Ruby', 'Go', 'Kubernetes YAML', 'Terraform'])
const selectedChallenges = ref([])
const selectedLanguage = ref([])
const selectedFramework = ref(null)
const selectValue = ref([])

const test = computed(() => assignmentStore.attachChallenge)
const disableChallenge = computed(() => testsStore.customTests)

onMounted(async () => {
  await aiChallenges.listChallenges()

  selectValue.value = aiChallenges.listedChallenges.map((item) => {
    return {
      label: item.name,
      value: item._key
    }
  })
})

onMounted(async () => {
  await aiChallenges.listChallenges()

  selectValue.value = aiChallenges.listedChallenges.map((item) => {
    return {
      label: item.name,
      value: item._key
    }
  })
})

async function filterChallenges() {
  const payload = {
    language: selectedLanguage.value ? selectedLanguage.value.toLowerCase() : null,
    framework: selectedFramework.value ? selectedFramework.value.toLowerCase() : null
  }

  await aiChallenges.filterChallenges(payload)

  selectValue.value = aiChallenges.listedChallenges.map((item) => {
    return {
      label: item.name,
      value: item._key
    }
  })
}

async function clearFilters() {
  selectedLanguage.value = null
  selectedFramework.value = null
  selectedChallenges.value = []
}

async function submit() {
  const payload = {
    test_id: props.name === 'testIndex' ? urlSafeBase64Decode(route.params.testId) : test.value.sk,
    challenges: selectedChallenges.value.map((item) => item.value)
  }

  await testsStore.attachChallenge(payload)

  const updateList = {
    test: props.name === 'testIndex' ? urlSafeBase64Decode(route.params.testId) : test.value.sk
  }

  await testsStore.fetchTests(updateList)

  onCancel()
  clearFilters()
}

async function onCancel() {
  emit('onCancel', { show: true })
}

function getDisable(item) {
  return disableChallenge.value.some((item2) => item2._key.includes(item.value))
}
</script>
