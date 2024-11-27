<template>
  <div v-if="downloadContentStore.downloadData.name" class="full-width">
    <div class="row bg-grey-12">
      <div class="q-pa-xs col-12" style="padding: 2%">
        <div class="text-h2 text-center">
          <p class="text-subtitle1 text-weight-bold ase-roboto ase-black-shade none-spacing">
            {{ downloadContentStore.downloadData.name }}
          </p>
        </div>
        <div class="text-center">
          <BaseBtn
            :icon-right="!isDownloading ? 'file_download' : false"
            :label="isDownloading ? 'Loading...' : 'DOWNLOAD'"
            @click="downloadContentFile(downloadContentStore.downloadData.url)"
          >
            <template v-if="isDownloading">
              <q-spinner-hourglass class="on-right" />
            </template>
          </BaseBtn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { useDownloadContentStore } from 'src/store/pinia/downloadContent'
import { defineComponent, shallowRef } from 'vue'

defineComponent({ name: 'DownloadPageContent' })

const downloadContentStore = useDownloadContentStore()

const isDownloading = shallowRef(false)

function downloadContentFile(url) {
  isDownloading.value = true
  setTimeout(() => {
    isDownloading.value = false
    window.open(urlSafeBase64Decode(url), '_blank')
  }, 1000)
}
</script>
