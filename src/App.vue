<template>
  <router-view />
</template>

<script setup>
import { watch, onMounted, onUpdated } from 'vue'
import { useRoute } from 'vue-router'
import config from './config'
import useAppIcons from 'src/composables/use-appIcons.js'
import { useSocket } from 'src/composables/use-socket.js'
useAppIcons()

const route = useRoute()
useSocket()

watch(route, (to, _from) => {
  if (to.meta.title !== 'Course Intro') {
    window.document.title = to.meta.title || 'AppSecEngineer'
  }
})

onMounted(() => {
  config.chargebee
})

onUpdated(() => {
  config.chargebee
})
</script>
