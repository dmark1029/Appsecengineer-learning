<template>
  <BaseCard class="viewPages">
    <div class="content-card">
      <div class="column q-gutter-sm no-wrap">
        <div class="chat" ref="chatRef">
          <div class="text-h6 none-spacing">AppSecGPT 🤖 for AppSecEngineer</div>
          <div class="text-h6">A conversational AI assistant for the AppSecEngineer platform.</div>
          <div>
            <div class="text-subtitle1">Great Use-cases for this include</div>
            <ol class="informations">
              <li class="text-muted">Asking questions about courses in AppSecEngineer</li>
              <li class="text-muted">Figuring out what to learn next on AppSecEngineer.</li>
              <li class="text-muted">
                Get recommendations from the AI. Asking questions about AppSecEngineer Labs and which courses might have them
              </li>
            </ol>
          </div>
          <ChatBot :chatMessages="chatMessages" />
          <q-chat-message name="AseGpt" v-if="loading" class="secondary">
            <template v-slot:avatar>
              <q-icon name="img:/icons/robot_light.svg" size="3em" />
            </template>
            <q-spinner-dots size="2rem" />
          </q-chat-message>
        </div>
        <q-form class="input-form" ref="chatForm" greedy>
          <BaseInput v-model="textSearch" fill placeholder="Search course" rounded :rules="[...minLength(5)]" :disable="loading">
            <template #append>
              <BaseBtn color="primary" icon="send" flat type="submit" :loading="loading" :disable="!textSearch" @click.prevent="submit" />
            </template>
          </BaseInput>
        </q-form>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import ChatBot from 'src/components/chat/ChatBot.vue'
import { BaseInput } from 'src/components/wrappers/BaseInput'
import { nextTick, ref, computed } from 'vue'
import { useChatStore } from 'src/store/pinia/chats/chats'
import { minLength } from 'src/utils/rules'
import { useLoginStore } from 'src/store/pinia/login'
const textSearch = ref('')
const loading = ref(false)
const chatRef = ref(null)

const chatStore = useChatStore()
const loginStore = useLoginStore()

const chatMessages = ref([])

const chatForm = ref(null)

const dummyText = `Smash your goals and become an AppSec pro
Start a new chapter in your career with AppSecEngineer. Learn, improve, and take control of your journey today.
No one else does security learning like this.`

const user = computed(() => {
  return loginStore.user
})

async function submit() {
  const validate = await chatForm.value.validate()
  if (!validate) return
  loading.value = true

  chatMessages.value.push({
    sender: user.value.firstName,
    content: textSearch.value,
    timestamp: new Date(),
    avatar: user.value.picture,
    sent: true
  })
  scrollChatToBottom()
  const data = await chatStore.submitQuestions({
    question: textSearch.value
  })
  if (data.success) {
    chatMessages.value.push({
      sender: 'AseGPT',
      content: data.data,
      timestamp: new Date(),
      icon: 'img:/icons/robot_light.svg',
      sent: false
    })
  }
  textSearch.value = ''
  scrollChatToBottom()
  loading.value = false
  chatForm.value.reset()
}

function scrollChatToBottom() {
  nextTick(() => {
    const chatContainer = chatRef.value
    chatContainer.scrollTop = chatContainer.scrollHeight
  })
}
</script>
<style lang="scss" scoped>
.viewPages {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: calc(100vh - 200px);
}

.content-card {
  gap: 5px;
  max-width: 800px;
  max-height: 100%;
  // height: 100vh;
  width: 100%;
  // background-color: #f1f1f1; /* Replace with desired background color */
  padding: 20px; /* Add padding to the content within the card */
  .informations {
    font-size: 16px;
    font-weight: 400;
    font-style: roboto;
    padding-inline-start: 15px;
  }
  .chat {
    height: calc(100vh - 300px);
    overflow-y: auto;
  }
  .input-form {
    position: absolute;
    bottom: 10px;
    width: 100%;
    max-width: 750px;
    width: calc(100% - 50px);
  }
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px; /* Add border radius */
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
