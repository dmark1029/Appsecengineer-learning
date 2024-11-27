<template>
  <q-page class="full-width">
    <div class="row" v-if="mediaStore.mediaData.url">
      <div class="q-pa-xs col-12">
        <div style="margin: 0px; padding: 0px; overflow: hidden">
          <iframe :src="mediaStore.mediaData.url" height="100%" width="100%" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useMediaStore } from 'src/store/pinia/media'

const mediaStore = useMediaStore()
</script>

<style scoped>
iframe {
  border: none;
  bottom: 0px;
  height: 100%;
  left: 0px;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: hidden;
  position: absolute;
  right: 0px;
  top: 0px;
  width: 100%;
}
</style>
