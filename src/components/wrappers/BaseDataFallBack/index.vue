<template>
  <div v-if="show" class="col-12 column items-center justify-center q-pa-xs q-pb-md">
    <slot name="image"><q-img contain :src="noDataImage" width="30vw" /></slot>
    <div class="text-center text-subtitle1" :class="[{ 'text-black': dark, 'text-white': !dark }]">{{ title }}</div>
  </div>
</template>

<script setup>
import noDataImage from 'assets/nData.png'
const props = defineProps({
  title: {
    type: String,
    default: 'Sorry, No Data Found'
  },
  show: {
    type: Boolean,
    default: true
  },
  dark: {
    type: Boolean,
    default: true
  }
})
</script>
