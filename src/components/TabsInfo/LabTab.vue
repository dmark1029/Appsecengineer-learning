<template>
  <BaseTabs v-model="tab">
    <q-tab name="Overview" label="Overview" />
    <q-tab name="Instructions" label="Instructions" />
  </BaseTabs>

  <q-separator />
  <q-tab-panels v-model="tab">
    <q-tab-panel class="q-px-none" name="Overview">
      <ContentInfoSectionPage :contentObject="contentInfoArray" />
    </q-tab-panel>
    <q-tab-panel class="q-px-none" name="Review">
      <RatingInfo :ratingObject="ratingInfoArray" />
    </q-tab-panel>
    <q-tab-panel class="q-pa-none" name="Instructions">
      <div class="row">
        <div class="col">
          <template v-if="labStore.fetchLabInstructionInfo">
            <BaseMarkdown
              v-if="labStore.fetchLabInstructionInfo"
              :content="labStore.fetchLabInstructionInfo"
              class="text-subtitle1 q-pa-md"
            />
          </template>
          <q-inner-loading :showing="labStore.isLabInstruction">
            <q-spinner-hourglass size="50px" color="primary" />
          </q-inner-loading>
        </div>
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { useLabStore } from 'src/store/pinia/lab'
import { defineComponent, shallowRef } from 'vue'

import ContentInfoSectionPage from 'components/TabsInfo/ContentUI.vue'
import RatingInfo from 'components/TabsInfo/RatingInfo.vue'
import BaseMarkdown from 'components/shared/BaseMarkdown.vue'

defineComponent({
  name: 'LabTab'
})

defineProps({
  alignItem: { type: String, required: false, default: 'justify' },
  boldNumber: { required: false, default: 550 },
  bottomMargin: { type: String, required: false, default: '7px' },
  color: { type: String, required: false, default: '#6B6B6B' },
  contentInfoArray: {},
  fontFamily: { type: String, required: false, default: 'Roboto' },
  fontSize: { type: String, required: false, default: '14px' },
  indicatorColor: { type: String, required: false, default: '#F1592A' },
  lineHeight: { required: false, default: 1.8 },
  paddingSize: { type: String, required: false, default: '12px' },
  ratingInfoArray: {},
  title: { required: false }
})

const labStore = useLabStore()

const tab = shallowRef('Instructions')
</script>
