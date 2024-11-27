<template>
  <!-- {{ videoStore.videoData.url }} -->
  <!-- <q-video v-if="videoStore.videoData.is_live" :ratio="16 / 9" :src="videoStore.videoData.url" /> -->
  <iframe
    width="853"
    height="480"
    frameborder="0"
    allowfullscreen
    v-if="videoStore.videoData.is_live"
    :ratio="16 / 9"
    :src="videoStore.videoData.url"
  ></iframe>
  <vueVimeoPlayer
    class="fit"
    ref="player"
    :options="{ autoplay: true, pip: true, responsive: true, speed: true }"
    :videoId="videoStore.videoData.vidId"
    :video-url="videoStore.videoData.url"
    @ended="$emit('handleVideoEnd')"
    @pause="pause"
    @ready="onReady"
    @timeupdate="videoProgress"
    v-else-if="videoStore.videoData.vidId"
  />
</template>

<script setup>
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { vueVimeoPlayer } from 'vue-vimeo-player'
import { useVideoStore } from 'src/store/pinia/video'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useMacroMetaStore } from 'src/store/pinia/macroMeta'
import { defineComponent, onBeforeMount, shallowRef, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

defineComponent({ name: 'VideoPageContent' })

const emit = defineEmits(['handleVideoEnd'])

const route = useRoute()

const videoStore = useVideoStore()
const coursesStore = useCoursesStore()
const macroMetaStore = useMacroMetaStore()

const lastSecondWatched = shallowRef(0)
const player = ref(null)

onBeforeMount(() => {
  if (Object.entries(videoStore.trackVideo).length > 0) {
    macroMetaStore.publishVideoStats(videoStore.trackVideo)
    videoStore.setTrackVideo({})
  }
})

watch(
  () => coursesStore.feedBackStatus,
  () => {
    coursesStore.feedBackStatus && pause()
  }
)

function onReady() {
  player.value?.player?.setCurrentTime(videoStore.getVideoProgress(videoStore.videoData.vidId)?.seconds || 0)
}

function videoProgress(event) {
  const elapsedVideo = Math.floor(event?.seconds)
  if (elapsedVideo !== 0 && lastSecondWatched.value !== elapsedVideo) {
    lastSecondWatched.value = elapsedVideo
    videoStore.setTrackVideo({
      video_id: videoStore.videoData.id,
      watch_time: lastSecondWatched,
      subject: urlSafeBase64Decode(route.params.subjectId),
      course: urlSafeBase64Decode(route.params.courseId)
    })
    if (lastSecondWatched.value % 10 === 0) {
      videoStore.saveVideoProgress({
        video_id: videoStore.videoData.vidId,
        seconds: lastSecondWatched
      })
    }
  }
}

function pause() {
  player.value?.pause()
}
</script>

<style scoped>
.play .rounded-box .state-paused {
  color: orange;
}
</style>
