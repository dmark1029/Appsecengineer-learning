<template>
  <div class="flex column q-gutter-md q-mt-lg q-mx-lg full-width">
    <div class="col-md-7 col-sm-12">
      <q-card>
        <q-card-section v-if="aiChallenge.quizData.validation_type === 'Text'">
          <p class="text-subtitle1 q-mb-none">
            <b>Quiz name:</b>
            {{ aiChallenge.quizData.name }}
          </p>
          <highlightjs v-if="data" :language="aiChallenge.quizData.language" :code="data" />
        </q-card-section>

        <q-card-section v-if="aiChallenge.quizData.validation_type === 'Code'">
          <q-form @submit="validateCodeResponse">
            <div class="flex justify-between">
              <p class="text-subtitle1">
                <b>Instructions:</b>
                Identify the vulnerability in this source code.
              </p>
              <q-btn class="q-mb-md" color="primary" size="sm" icon="restart_alt" @click="reloadPage">
                <q-tooltip>Reset challenge</q-tooltip>
              </q-btn>
            </div>
            <CodeEditor v-if="codeEditor" v-model="codeEditor" />
            <q-btn class="text-black q-mt-md" label="Give me a Hint" size="12px" color="blue-1" @click="toggleHints" />
            <q-slide-transition>
              <div v-if="showHints">
                <div v-for="(hint, index) in aiChallenge.quizData.hints" :key="index" class="q-mt-xs">
                  <q-input :model-value="hint" filled readonly style="background-color: #edf1fa; border-radius: 6px" />
                </div>
              </div>
            </q-slide-transition>
            <q-btn
              class="q-pa-md text-center full-width q-mt-md"
              type="submit"
              :loading="progress[0].loading"
              :percentage="progress[0].percentage"
              @click="startComputing(0)"
              color="primary"
            >
              <span class="q-ml-sm">Submit Response</span>
            </q-btn>

            <q-input
              v-if="aiChallenge.getQuizAnswer.airesponse"
              v-model="aiChallenge.getQuizAnswer.airesponse"
              readonly
              filled
              label="Explanation"
              type="textarea"
              style="background-color: #edf1fa; border-radius: 6px"
              class="q-mt-md"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </div>

    <q-form v-if="aiChallenge.quizData.validation_type === 'Text'" class="col-md-5 col-sm-12" @submit="validateResponse">
      <div>
        <q-card>
          <q-card-section>
            <div>
              <p class="text-subtitle1 q-mb-none text-bold">Instructions</p>
              <p>Identify the vulnerability in this source code.</p>

              <p class="text-subtitle1 q-mb-none text-bold">Answer:</p>
              <q-input
                v-model="answer"
                :error="aiChallenge.getQuizAnswer.is_correct === false ? true : false"
                filled
                type="textarea"
                style="background-color: #edf1fa"
                required
              />
            </div>

            <div class="flex q-mt-md">
              <q-btn class="q-mr-md text-black" label="Give me a Hint" size="12px" color="blue-1" @click="toggleHints" />
              <q-btn label="Show me the answer" icon="comment" size="12px" @click="showAnswerResponse" />
            </div>

            <q-slide-transition>
              <div v-if="onShowAnswer" class="q-mt-xs">
                <q-input
                  v-model="onShowAnswer"
                  :loading="aiChallenge.isLoading"
                  readonly
                  type="textarea"
                  filled
                  style="background-color: #edf1fa; border-radius: 6px"
                />
              </div>
            </q-slide-transition>

            <q-slide-transition>
              <div v-if="showHints">
                <div v-for="(hint, index) in aiChallenge.quizData.hints" :key="index" class="q-mt-xs">
                  <q-input :model-value="hint" filled readonly style="background-color: #edf1fa; border-radius: 6px" />
                </div>
              </div>
            </q-slide-transition>

            <div class="flex justify-center q-mt-md">
              <q-btn class="q-pa-md text-center full-width" type="submit" :loading="aiChallenge.isLoading" color="primary">
                <span class="q-ml-sm">Submit Response</span>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import hljsVuePlugin from '@highlightjs/vue-plugin'
import 'highlight.js/lib/common'
import 'highlight.js/styles/stackoverflow-light.css'
import { Notify } from 'quasar'
import CodeEditor from 'src/components/aiQuiz/CodeEditor.vue'
import { useAiChallengesStore } from 'src/store/pinia/aiChallenges/aiChallenges'
import { urlSafeBase64Decode, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'

const showHints = ref(false)
const aiChallenge = useAiChallengesStore()
const showAnswer = ref(false)
const onShowAnswer = ref('')
const answer = ref('')
const highlightjs = hljsVuePlugin.component
const route = useRoute()

const data = computed(() => urlSafeBase64Decode(aiChallenge.quizData.code))
const codeEditor = ref('')
const progress = ref([{ loading: false, percentage: 0 }])

const intervals = [null]

function startComputing(id) {
  progress.value[id].loading = true
  progress.value[id].percentage = 0

  intervals[id] = setInterval(() => {
    progress.value[id].percentage += 4
    if (progress.value[id].percentage >= 100 && aiChallenge.getQuizAnswer.airesponse) {
      clearInterval(intervals[id])
      progress.value[id].loading = false
    }
  }, 500)

  aiChallenge.$resetQuizAnswer()
}

onBeforeUnmount(() => {
  intervals.forEach((val) => {
    clearInterval(val)
  })
})

const toggleHints = () => {
  showHints.value = !showHints.value
}

const showAnswerResponse = async () => {
  if (showAnswer.value) {
    showAnswer.value = false
    onShowAnswer.value = ''
    return
  }

  showAnswer.value = true

  const payload = {
    event_id: urlSafeBase64Decode(route.params.courseId),
    challenge_id: aiChallenge.quizData._key,
    answer: answer.value,
    show_answer: true
  }

  await aiChallenge.validateAnswer(payload)

  onShowAnswer.value = aiChallenge.getQuizAnswer.actual_answer
}

const validateResponse = async () => {
  aiChallenge.isLoading = true
  const payload = {
    event_id: urlSafeBase64Decode(route.params.courseId),
    challenge_id: aiChallenge.quizData._key,
    answer: answer.value,
    show_answer: false
  }
  await aiChallenge.validateAnswer(payload)
  aiChallenge.isLoading = false

  if (aiChallenge.getQuizAnswer.is_correct === true) {
    Notify.create({ message: 'Correct Answer', color: 'green', position: 'top' })
    showAnswer.value = false
  } else {
    Notify.create({ message: 'Incorrect Answer', color: 'red', position: 'top' })
    onShowAnswer.value = aiChallenge.getQuizAnswer.response
    showAnswer.value = true
  }
}

const validateCodeResponse = async () => {
  const payload = {
    event_id: urlSafeBase64Decode(route.params.courseId),
    challenge_id: aiChallenge.quizData._key,
    answer: urlSafeBase64Encode(codeEditor.value)
  }
  await aiChallenge.validateCodeAnswer(payload)
}

const reloadPage = () => {
  location.reload()
}

codeEditor.value = urlSafeBase64Decode(aiChallenge.quizData.code)
</script>
