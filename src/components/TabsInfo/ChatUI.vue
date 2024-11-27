<template>
  <div class="row chatUI">
    <div class="row gptUI" v-if="!this.isQuestionStarted">
      <div class="q-pa-xs col-12">
        <img :src="imageUrl" alt="x" />
      </div>
      <div class="q-pa-xs col-12">
        <p class="text-subtitle1 text-justify">What would you like to know?</p>
        <p>Explore deeper insight into this course, engage in meaningful conversations.</p>
      </div>
    </div>
    <div class="row" v-if="!this.isQuestionStarted">
      <div class="q-pa-xs col-12">
        <div class="q-pa-xs col-12 explore-feature">
          <div class="q-pa-xs col-12">
            <img :src="imageUrl" alt="x" />
          </div>
          <div class="q-pa-xs col-12">
            <p class="text-subtitle1 text-justify">Explore our Feature</p>
            <p class="text-subtitle1 text-justify">ex: What techniques do I need to know about the data query</p>
          </div>
        </div>
        <div class="q-pa-xs col-12 sample-questions">
          <q-item-label class="q-ml-md q-tab-asking">Try asking</q-item-label>
          <div>
            <q-list bordered class="question-sample">
              <q-item class="question-item">
                <q-item-section>
                  <q-item-label>Transcribe and summarise this labs</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-list bordered class="question-sample">
              <q-item class="question-item">
                <q-item-section>
                  <q-item-label>Threat Modelling be used in real-world development scenarios?</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-list bordered class="question-sample">
              <q-item class="question-item">
                <q-item-section>
                  <q-item-label>Agile Threat Model apply to the software development lifecycle?</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
    </div>
    <q-item-section class="question-input">
      <BaseInput
        label="Question"
        v-model="query"
        sendButton
        @send="sendQuestion"
        @keyup.enter="sendQuestion()"
        :disabled="courseStore.isGptAnswerFetched"
      />
    </q-item-section>
    <div class="q-pa-xs col-12">
      <div class="question" v-if="this.questionInputted">
        <p>{{ question }}</p>
        <div v-if="fetchUserInfo" class="q-gutter-x-lg text-center user-info">
          <q-avatar v-if="fetchUserInfo.picture" class="image" :class="!fetchUserInfo.picture ? 'bg-primary' : ''" size="25px">
            <q-img :src="fetchUserInfo.picture"></q-img>
          </q-avatar>
          <q-avatar v-else class="bg-primary" size="25px">
            <div class="text-white">{{ fetchUserInfo.firstName?.charAt(0) }}</div>
          </q-avatar>
        </div>
      </div>
      <div class="q-loading-spinning-glasses" v-if="courseStore.isGptAnswerFetched">
        <span>
          <q-spinner-hourglass class="on-left" />
          Loading...
        </span>
      </div>
      <div v-if="fetchedAnswer && !courseStore.isGptAnswerFetched" class="answer-part">
        <div class="answer">
          <q-icon name="message" />
          <p>{{ this.fetchedAnswer }}</p>
        </div>
        <div class="regenerate" v-if="fetchedAnswer && !courseStore.isGptAnswerFetched">
          <q-btn icon="refresh" flat dense @click="reSendQuestion()">&nbsp;Regenerate</q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseInput from 'components/shared/BaseInput.vue'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useLoginStore } from 'src/store/pinia/login'
import { computed } from 'vue'

export default {
  name: 'ChatUIPage',
  components: { BaseInput },
  props: {
    courseId: { required: true }
  },
  data() {
    return {
      query: '',
      imageUrl: '/icons/sparkling.png',
      questionInputted: false,
      question: '',
      fetchedAnswer: '',
      isQuestionStarted: false
    }
  },
  methods: {
    async sendQuestion() {
      if (this.courseStore.isGptAnswerFetched || !this.query) {
        return
      }
      if (this.query && this.query.length < 5) {
        return
      }
      this.isQuestionStarted = true
      this.fetchedAnswer = ''
      this.questionInputted = true
      this.question = this.query
      this.query = ''
      await this.courseStore.fetchGptAnswer({ course_id: this.courseId, text: this.question })
      this.fetchedAnswer = this.courseStore.gptAnswer
    },
    async reSendQuestion() {
      if (this.courseStore.isGptAnswerFetched) {
        return
      }
      this.isQuestionStarted = true
      this.fetchedAnswer = ''
      this.questionInputted = true
      this.query = ''
      await this.courseStore.fetchGptAnswer({ course_id: this.courseId, text: this.question })
      this.fetchedAnswer = this.courseStore.gptAnswer
    },
    validateInput(value) {
      if (value && value.length < 5) {
        return 'Input length must be at least 5 characters'
      }
      return true
    }
  },
  setup() {
    const loginStore = useLoginStore()
    const courseStore = useCoursesStore()
    const fetchUserInfo = computed(() => {
      return loginStore.fetchUserInfo
    })
    return {
      fetchUserInfo,
      courseStore
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  white-space: pre-line;
}
.gptUI {
  height: 400px;
  width: 100%;
  :deep(.q-pa-xs:first-child) {
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
}
.gptUI p {
  text-align: center !important;
}
.gptUI img {
  width: 7%;
}
.gptUI p:first-child {
  font-weight: 500;
  font-size: 19px;
  opacity: 0.7;
}
.gptUI p:last-child {
  opacity: 0.5;
}
.question-sample {
  border: 1px solid $grey;
  border-radius: 20px;
  display: inline-block;
  color: $grey;
  margin: 10px;
}
.question-sample .question-item {
  min-height: 30px !important;
  padding: 3px 16px;
}
.sample-questions {
  display: flex;
}
.explore-feature {
  display: flex;
}
.explore-feature div:first-child {
  width: 5%;
}
.explore-feature div:last-child p:first-child {
  font-weight: 700;
  margin-bottom: 0px;
}
.explore-feature div:last-child p:last-child {
  opacity: 0.7;
  font-size: 14px;
}
.explore-feature img {
  width: 100%;
}
.chatUI {
  min-height: 400px;
  position: relative;
  padding-bottom: 70px;
}
.question-input {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.question {
  display: inline-flex;
  min-width: 350px;
  background: #edf1fa;
  float: right;
  max-width: 730px;
  border-radius: 15px;
  justify-content: space-between;
  margin: 20px 0px;
}
.question p {
  margin: 0px;
  padding: 10px 20px;
  max-width: 700px;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.7;
  letter-spacing: 1px;
}
.question .user-info {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.question .user-info .q-avatar {
  margin: 10px 15px;
}
.answer-part {
  min-width: 650px;
  max-width: 680px;
  display: flow-root;
}
.answer {
  display: flex;
  background: #edf1fa;
  border-radius: 15px;
  justify-content: flex-start;
  margin: 20px 0px 5px;
}
.regenerate {
  display: flex;
  align-items: center;
  min-width: 550px;
  justify-content: right;
}
.answer p {
  margin: 0px;
  padding: 10px 20px;
  max-width: 650px;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.7;
  letter-spacing: 1px;
}
.answer i {
  scale: 1.5;
  margin: 15px 0px 0px 20px;
}
.q-loading-spinning-glasses {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  width: 100%;
  height: 50%;
}
</style>
