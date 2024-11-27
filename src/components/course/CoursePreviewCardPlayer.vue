<template>
  <vueVimeoPlayer
    v-if="data.vidId"
    :options="{ responsive: true, speed: true, pip: true }"
    ref="player"
    :videoId="data.vidId"
    :video-url="data.url"
  />
</template>

<script setup>
import { defineComponent, watch, ref } from 'vue'
import { vueVimeoPlayer } from 'vue-vimeo-player'

defineComponent({
  name: 'CoursePreviewCardPlayer'
})

const emit = defineEmits(['StopVideoPlayer'])

const player = ref(null)

const props = defineProps({
  data: { required: false },
  id: { required: false },
  autoPlayStyle: { required: false, default: false }
})

watch(
  () => props.autoPlayStyle,
  () => {
    play()
  }
)

function play() {
  if (props.autoPlayStyle) {
    player.value.play()
    emit('StopVideoPlayer')
  }
}
</script>

<style>
iframe {
  border-radius: 6px;
}
</style>
