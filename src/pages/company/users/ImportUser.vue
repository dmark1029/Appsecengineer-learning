<template>
  <div>
    <BaseDialog v-model="model" persistent size="medium" title="Upload Multiple User" @close="model = false">
      <q-card-section v-if="message" class="column justify-center full-height">
        <q-linear-progress color="primary" query size="1rem" v-if="status === 'progress'" class="q-my-md" />
        <!-- <q-spinner-ios color="primary" size="2em" /> -->

        <div class="row self-center q-gutter-x-lg">
          <div class="text-h6 self-center">{{ message }}</div>
          <q-btn color="primary" @click="fetchStatus" v-if="status === 'progress'" icon="refresh" flat dense></q-btn>
        </div>
        <BaseTable
          :columns="columns"
          :rows="completedData"
          :rows-per-page-options="[0]"
          virtual-scroll
          style="max-height: calc(300px)"
          hide-pagination
          customClasses="sticky-head q-my-md"
          row-key="name"
          :filter="filter"
          v-if="completedData?.length"
        >
          <template v-slot:top-left>
            <BaseInput dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </BaseInput>
          </template>
        </BaseTable>
        <div class="row q-gutter-lg self-end items-end" v-if="['completed', 'failed'].includes(status)">
          <BaseBtn color="red" @click="model = false">Cancel</BaseBtn>
          <BaseBtn color="green-12" @click="acknowledgeStatus" :loading="importStore.acknowledgeLoading">Acknowledge</BaseBtn>
        </div>
      </q-card-section>
      <div v-else>
        <q-form @submit.prevent="confirmUpload">
          <q-card-section>
            <BaseFile accept=".csv,.json,.xlsx" label="Choose File" v-model="file" @rejected="onRejected" :rules="[...required]" />
            <p class="q-mb-none text-grey-7">
              Supported formats :
              <a href="/sample/sample-csv-data.csv" download="sample-csv-data.csv">CSV</a>
              or
              <a href="/sample/sample-json-data.json" download="sample-json-data.json">JSON</a>
              or
              <a href="/sample/sample-xlsx-data.xlsx" download="sample-xlsx-data.xlsx">XLSX</a>
            </p>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <div class="padding_7">
              <BaseBtn color="primary" label="Submit" type="submit" />
            </div>
          </q-card-actions>
        </q-form>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'
import BaseFile from 'components/shared/BaseFile.vue'
import { useImportStore } from 'src/store/pinia/import/user'
import { BaseDialog } from 'src/components/wrappers/BaseDialog'
import { Notify, useQuasar } from 'quasar'
import { required } from 'src/utils/rules'
import axios from 'axios'
export default defineComponent({
  components: {
    BaseFile,
    BaseDialog
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const importStore = useImportStore()
    const show = ref(false)
    // const file = ref('')
    const file = ref(null)
    const fields = ref([])
    const message = ref('')
    const status = ref(undefined)
    const completedData = ref([])
    const url = ref('')
    const $q = useQuasar()
    const columns = [
      {
        name: 'name',
        field: 'key',
        label: 'Email',
        align: 'left',
        format: (val) => `${val}`
      },
      {
        name: 'operation',
        field: 'value',
        label: '',
        align: 'left'
      }
    ]
    function resetValue() {
      file.value = ''
      fields.value = []
      message.value = ''
      status.value = undefined
      completedData.value = []
    }

    fetchStatus()

    async function fetchStatus() {
      $q.loading.show({
        message: 'Loading Status...'
      })
      const data = await importStore.getStatus()
      switch (data?.message) {
        case 'In Progress': {
          message.value = 'Task is in Progress'
          status.value = 'progress'
          break
        }
        case 'Completed': {
          message.value = 'Task is Completed'
          status.value = 'completed'
          setCompletedData(data?.data)
          break
        }
        case 'Failed':
        case 'Failed - Please check the file.': {
          message.value = data?.error_msg ? 'Failed - Please check the file' : 'Task is Failed'
          status.value = 'failed'
          setCompletedData(data?.data)
          break
        }
        default: {
          await getPresignedUrl()
        }
      }

      $q.loading.hide()

      return data
    }

    async function setCompletedData(data = {}) {
      Object.entries(data).forEach((ele) => {
        completedData.value.push({
          key: ele[0],
          value: ele[1]
        })
      })
    }

    async function getPresignedUrl() {
      const { data } = await importStore.getPresignedUrl()
      fields.value = data?.fields ?? []
      url.value = data?.url
    }

    const model = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', false)
      }
    })

    watch(model, async () => {
      if (model.value) {
        resetValue()
        await fetchStatus()
      }
    })

    async function confirmUpload() {
      try {
        const formData = new FormData()

        // Iterate through the key-value pairs in fields.value and append them to formData
        for (const [key, value] of Object.entries(fields.value)) {
          formData.append(key, value)
        }

        formData.append('file', file.value)

        // Send the formData in the POST request using Axios
        const response = await axios.post(`${url.value}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data' // Set the content type to 'multipart/form-data'
          }
        })
        model.value = false
        Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Your import file is being processed!' })
      } catch (error) {
        console.warn(error?.message)
        // const parser = new DOMParser()
        // const xmlDoc = parser.parseFromString(data, 'text/xml')
        // console.log(xmlDoc)
        // console.log(parser)
        // Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Your import has been proccessed successfully' })
      }
    }

    function onRejected(error) {
      Notify.create({ type: 'negative', position: 'top', progress: true, message: 'Only supported files are csv, json & xlsx' })
      console.warn(error)
    }

    async function acknowledgeStatus() {
      await importStore.acknowledgeStatus()
      model.value = false
    }
    return {
      filter: ref(''),
      show,
      file,
      model,
      confirmUpload,
      getPresignedUrl,
      message,
      fetchStatus,
      status,
      completedData,
      importStore,
      acknowledgeStatus,
      onRejected,
      columns,
      required
    }
  }
})
</script>

<style lang="scss" scoped></style>
