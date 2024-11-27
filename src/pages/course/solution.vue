<template>
  <div class="row">
    <div :class="`q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12`">
      <SolutionHeader :data="labStore.challengeInfo" @backToChallenge="challengePage" />
    </div>
    <div :class="`q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12`">
      <p class="text-h4 ase-black-regular ase-roboto padding_7" style="line-height: 0.9" v-if="solutions.length > 0">Solution :</p>
      <BaseCard v-for="(data, index) of solutions" :key="data + index + 'Info'">
        <BaseMarkdown :content="data" class="md-body q-pa-md" />
        <br />
      </BaseCard>
      <p
        class="text-subtitle1 ase-black-regular flex flex-center ase-roboto padding_7"
        style="line-height: 0.9"
        v-if="solutions.length === 0 && !labStore.isLoading && showData"
      >
        {{ labStore.isLoading ? 'Loading' : 'Solution not found. Please contact support Help@appsecengineer.com' }}
      </p>
    </div>
  </div>
</template>
<script setup>
import { QSpinnerFacebook, useQuasar } from 'quasar'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { useLabStore } from 'src/store/pinia/lab'
import { defineComponent, onBeforeMount, ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'

import BaseMarkdown from 'components/shared/BaseMarkdown.vue'
import SolutionHeader from 'components/course/SolutionHeader.vue'

defineComponent({
  name: 'Solution'
})

const route = useRoute()
const $q = useQuasar()

const labStore = useLabStore()

const solutions = ref([])
const showData = shallowRef(false)

onBeforeMount(async () => {
  await labStore.fetchChallengeData({
    challenge_id: urlSafeBase64Decode(route.params.challengeId)
  })
  await labStore.fetchChallengeSolution({
    challenge_id: urlSafeBase64Decode(route.params.challengeId),
    event_id: urlSafeBase64Decode(route.params.courseId),
    lab_id: urlSafeBase64Decode(route.params.labId)
  })
  if (labStore.challengeSolution.instructions) {
    if (labStore.challengeSolution.instructions.length > 0) {
      solutions.value = []
      for (const data of labStore.challengeSolution.instructions) {
        const finalResult = await labStore.getMarkdownData(data)
        solutions.value.push(finalResult?.data ?? '')
      }
    } else {
      showData.value = true
    }
  } else {
    showData.value = true
  }
  if (solutions.value.length === 0) {
    showData.value = true
  }
})

watch(
  () => labStore.isLoading,
  () => {
    if (labStore.isLoading) {
      $q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: 'white',
        spinnerSize: 140,
        message: 'Hang on...',
        messageColor: 'white'
      })
    } else {
      $q.loading.hide()
    }
  }
)

function challengePage() {
  window.history.go(-1)
  return false
}
</script>
<style scoped>
.mediaQuery {
  position: absolute;
  top: 0;
  right: 0;
  padding: 3% 3% 3% 7px;
  height: 100%;
}
.mediaQueryCard {
  position: -webkit-sticky;
  position: sticky;
  top: 70px;
  right: 0;
  padding: 7%;
  z-index: auto;
}
.sticky {
  position: fixed;
  z-index: 9999;
  width: 100%;
}
</style>
