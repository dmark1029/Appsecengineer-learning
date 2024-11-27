import { api } from 'src/boot/axios'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { LocalStorage } from 'quasar'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useVideoStore = defineStore('video', () => {
  const isLoading = ref(false)
  const isError = ref('')
  const videoData = ref({})
  const videoProgress = ref(LocalStorage.getItem('videoProgress') || [])
  const trackVideo = ref({})

  async function manageLoading(callback) {
    try {
      isLoading.value = true
      await callback()
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  function extractVideoId(url) {
    const regex = /(?:\/(?:videos?|event)\/|vimeo\.com\/)([0-9]+)/i
    const match = url.match(regex)
    return match ? match[1] : null
  }

  function setVideoDataWithResp(res) {
    const vidURL = urlSafeBase64Decode(res.data.data.vid_url)
    const vidId = extractVideoId(vidURL ?? '')
    const videoInfo = {
      name: res.data.data.vid_name,
      vidId: vidId,
      id: res.data.data.sk,
      is_live: res.data.data.is_live || false
    }
    if (res.data.data.is_live) {
      videoInfo.url = vidURL
    } else {
      videoInfo.url = `https://player.vimeo.com/video/${vidId}?loop=false&amp;byline=false&amp;portrait=false&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media`
    }
    videoData.value = videoInfo
  }

  function getVideoData(payload) {
    return manageLoading(async () => {
      videoData.value = {}
      const res = await api.post('item/get-by-id', payload)
      if (res.data.success) {
        setVideoDataWithResp(res)
      }
    })
  }

  function getVideoReset() {
    videoData.value = {}
  }

  function saveVideoProgress(payload) {
    const video = videoProgress.value.find((item) => item.video_id === payload.video_id)
    if (video) {
      video.seconds = payload.seconds
    } else {
      videoProgress.value.push(payload)
    }
    LocalStorage.set('videoProgress', videoProgress.value)
  }
  function setTrackVideo(payload) {
    trackVideo.value = payload
  }
  function removeVideoProgress(payload) {
    const video = videoProgress.value.find((item) => item.video_id === payload.video_id)
    if (!video) return
    videoProgress.value.splice(videoProgress.value.indexOf(video), 1)
    LocalStorage.set('videoProgress', videoProgress.value)
  }
  const getVideoProgress = computed(() => (id) => videoProgress.value.find((item) => item.video_id === id))

  return {
    isLoading,
    isError,
    trackVideo,
    videoProgress,
    videoData,
    getVideoData,
    getVideoReset,
    extractVideoId,
    saveVideoProgress,
    setTrackVideo,
    removeVideoProgress,
    getVideoProgress
  }
})
