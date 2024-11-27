<template>
  <div>
    <BaseTabs v-model="tab">
      <q-tab name="Overview" label="Overview" />
    </BaseTabs>
    <q-separator />
    <q-tab-panels v-model="tab">
      <q-tab-panel name="Overview">
        <ContentInfoSectionPage :contentObject="contentInfoArray" />
      </q-tab-panel>
      <q-tab-panel name="Review">
        <RatingInfo :ratingObject="ratingInfoArray" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script setup>
import { defineComponent, shallowRef } from 'vue'

import ContentInfoSectionPage from 'components/TabsInfo/ContentUI.vue'
import RatingInfo from 'components/TabsInfo/RatingInfo.vue'

defineComponent({
  name: 'MediaDesign'
})

defineProps({
  ratingInfoArray: {},
  contentInfoArray: {},
  title: {
    required: false
  },
  fontSize: {
    type: String,
    required: false,
    default: '14px'
  },
  paddingSize: {
    type: String,
    required: false,
    default: '12px'
  },
  alignItem: {
    type: String,
    required: false,
    default: 'left'
  },
  boldNumber: {
    required: false,
    default: 550
  },
  lineHeight: {
    required: false,
    default: 1.2
  },
  color: {
    type: String,
    required: false,
    default: '#6B6B6B'
  },
  indicatorColor: {
    type: String,
    required: false,
    default: '#F1592A'
  },
  bottomMargin: {
    type: String,
    required: false,
    default: '7px'
  },
  fontFamily: {
    type: String,
    required: false,
    default: 'Roboto'
  }
})

const tab = shallowRef('Overview')
</script>
