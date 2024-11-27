<template>
  <q-page v-if="quizStore.quizData.url" class="full-width">
    <div class="row full-width">
      <div class="q-pa-xs col-12">
        <div style="margin: 0px; padding: 0px; overflow: hidden">
          <iframe :src="quizStore.quizData.url" height="100%" width="100%"></iframe>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuizStore } from 'src/store/pinia/quiz'
const quizStore = useQuizStore()
</script>

<style scoped>
iframe {
  border: none;
  bottom: 0px;
  height: 100%;
  left: 0px;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: hidden;
  position: absolute;
  right: 0px;
  top: 0px;
  width: 100%;
}
</style>
