<template>
  <div>
    <BaseTabs v-model="tab">
      <q-tab name="Overview" label="Overview" />
      <q-tab name="Instructors" label="Instructors" />
      <q-tab name="ASEGPT" label="ASEGPT" class="flex-row" icon="message" size="xl" v-if="asegptStatus === 'Succeeded'" />
    </BaseTabs>
    <q-tab-panels v-model="tab" class="bordered" bordered>
      <q-tab-panel name="Overview">
        <ContentUI :contentObject="contentInfoArray" />
      </q-tab-panel>
      <q-tab-panel name="Instructors" class="flex justify-around q-gutter-x-md">
        <div v-for="(instructor, index) in instructors" class="text-center" :key="index">
          <q-avatar size="5rem">
            <q-img :src="instructor.logo" />
          </q-avatar>
          <p class="q-mt-xs">{{ instructor.name }}</p>
        </div>
      </q-tab-panel>
      <q-tab-panel name="ASEGPT" v-if="asegptStatus === 'Succeeded'">
        <ChatUIPage :courseId="courseId" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import ContentUI from 'components/TabsInfo/ContentUI.vue'
import ChatUIPage from 'components/TabsInfo/ChatUI.vue'
import { shallowRef } from 'vue'

defineProps({
  contentInfoArray: {},
  instructors: {
    type: Array,
    required: true,
    default: () => []
  },
  courseId: { required: true },
  asegptStatus: { required: true }
})

const tab = shallowRef('Overview')
</script>
<style lang="scss" scoped>
.flex-row {
  :deep(.q-tab__content) {
    flex-direction: row !important;
  }
}
.flex-row {
  :deep(.q-tab__content) {
    i {
      margin-right: 10px;
    }
  }
}
</style>
