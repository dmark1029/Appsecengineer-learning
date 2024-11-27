<template>
  <BaseCard class="br-8 fileupload">
    <div class="row q-pa-md justify-center items-center">
      <div class="row items-center flex flex-center justify-center q-gutter-x-md" style="width: 30%">
        <p class="row items-center justify-center">{{ !fileUploadStore.isLoading ? 'File Upload' : 'Uploading' }}</p>
        <div class="col-12 q-mb-md" v-if="!fileUploadStore.isLoading">
          <div class="row items-center full-width justify-center no-wrap light-gray upload-part" style="height: 200px; z-index: 2">
            <div style="text-align: center">
              <q-avatar class="image" size="80px" @click="openFile">
                <div class="full-width flex flex-center icon">
                  <q-icon color="black-shade" name="cloud_upload" size="50px" />
                </div>
                <q-file
                  accept="jpg, jpeg, png"
                  borderless
                  class="absolute-bottom"
                  ref="uploadFile"
                  v-model="newPhoto"
                  @update:model-value="updatePicture"
                  @click.stop
                  @rejected="onRejected"
                >
                  <template v-slot:file>
                    <q-chip class="hidden" />
                  </template>
                </q-file>
              </q-avatar>
              <p class="q-my-sm q-ml-sm text-gray upload-field">Click here to upload image file *</p>
            </div>
          </div>
          <div
            v-if="!cancelUpload"
            class="row items-center full-width justify-between no-wrap light-gray upload-part q-mt-md q-pr-md q-pl-md"
            style="height: 70px; z-index: 2"
          >
            <div class="q-mr-md" style="text-align: center">
              <div v-if="imageData" class="flex q-mx-auto">
                <q-img :src="imageData" :ratio="1" width="50px" />
              </div>
            </div>
            <div class="q-mr-md" style="text-align: center">
              <p class="q-mb-none">{{ uploadedFileName }}</p>
            </div>
            <div class="q-mr-md" style="text-align: center">
              <p class="q-mb-none">{{ uploadedFileSize }}MB</p>
            </div>
          </div>
          <div class="full-height column items-start justify-start">
            <div class="full-width row justify-center items-center">
              <q-btn
                flat
                @click="getURL"
                class="full-width text-capitalize q-mt-md submit"
                :class="[cancelUpload ? 'disable-btn' : 'btn-bittersweet']"
                :disable="cancelUpload"
              >
                Submit
              </q-btn>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-center justify-center" style="height: 300px">
          <transition name="fade">
            <q-spinner fade="none" :thickness="3" class="upload-spinner" color="primary" size="6em" />
          </transition>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { Notify } from 'quasar'
import { useFileUploadStore } from 'src/store/pinia/fileUpload'
import { ref, onMounted } from 'vue'

const fileUploadStore = useFileUploadStore()
const status = ref({})
const b64logo = ref('')
const imageData = ref('')
const uploadedFile = ref({})
const uploadedFileSize = ref('')
const uploadedFileName = ref('')
const newPhoto = ref([])
const cancelUpload = ref(false)

onMounted(() => {
  cancelUpload.value = true
})

async function getURL() {
  if (!uploadedFile.value.name || Object.keys(uploadedFile.value).length === 0) {
    Notify.create({
      color: 'negative',
      icon: 'report_problem',
      message: 'Please upload image file first and submit !',
      position: 'top',
      timeout: 1100,
      progress: true
    })
    return
  }
  const status_payload = {
    filename: uploadedFile.value.name
  }
  status.value = await fileUploadStore.getUrl(status_payload)
  const form = {}
  Object.entries(status.value.data.fields).forEach(([field, value]) => {
    form[field] = value
  })
  form.file = uploadedFile.value
  const signedUrl = status.value.data.url
  await fileUploadStore.fileUpload({ signedUrl, form })
}
function openFile() {
  this.$refs.uploadFile.pickFiles()
}
function onRejected() {
  Notify.create({ type: 'negative', position: 'top', progress: true, timeout: 1100, message: 'Only supported files are jpg, png & jpeg' })
}

async function updatePicture(event) {
  const size = (event.size / (1024 * 1024)).toFixed(3)
  if (size >= 50) {
    Notify.create({
      color: 'negative',
      message: 'Image file size should be smaller than 50MB',
      position: 'top',
      progress: true,
      timeout: 1100
    })
    uploadedFile.value = {}
    uploadedFileSize.value = ''
    cancelUpload.value = true
    return
  }
  cancelUpload.value = false
  uploadedFileSize.value = (event.size / (1024 * 1024)).toFixed(3)
  uploadedFile.value = event
  uploadedFileName.value = event.name
  if (event) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imageData.value = e.target.result
      const imageSplit = e.target.result.split(';')
      const getOnlyB64Val = imageSplit[1].split(',')
      b64logo.value = getOnlyB64Val[1]
    }
    reader.readAsDataURL(event)
  }
}
</script>

<style lang="scss" scoped>
.upload-spinner {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.upload-part {
  border-radius: 10px;
  border: 1px solid #9e9e9e;
  background-color: $light-gray;
}
.disable-btn {
  background: #9e9e9e;
}
.submit {
  border-radius: 20px;
}
.upload-field {
  font-size: 16px;
  color: #9e9e9e;
}
</style>
