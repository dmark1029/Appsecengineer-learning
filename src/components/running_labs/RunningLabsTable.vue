<template>
  <div>
    <div class="row q-col-gutter-md">
      <div v-for="(course, index) in labStore.runningLabs" class="col-md-3 col-xs-12 col-sm-6" :key="index">
        <SlideView :data="course" :key="course.id" :showWishlist="false">
          <template #footer="props">
            <q-card-section class="row justify-between no-wrap q-px-md q-py-sm">
              <div class="col-7">{{ props?.name ?? props.event_name }}</div>
              <div class="q-gutter-x-sm">
                <BaseBtn color="green" @click.stop="accessLab(props.event_id, props.subject_id, props.id)" text-color="white" padding="4px">
                  Go to
                </BaseBtn>
                <BaseBtn
                  @click.stop="stopLab(props.running_instance_id, props.instance_id, props.name, props)"
                  :label="'End Lab'"
                  padding="4px"
                ></BaseBtn>
              </div>
            </q-card-section>
          </template>
        </SlideView>
      </div>
    </div>

    <div class="noDataView" v-if="!labStore.runningLabs?.length">
      <div class="absolute-full flex flex-center">
        <div>
          <q-icon style="font-size: 102px; color: #9b9b9b" name="warning" />
          <div class="text-h6 text-weight-bold">No Running Labs Found!</div>
        </div>
      </div>
    </div>
    <Delete
      v-if="isDelete"
      :show="isDelete"
      :header="`you want to ${runningLabName}`"
      @confirmDelete="labConfirmDeletion($event)"
      @confirmDeleteCancel="labConfirmDeleteCancel($event)"
      title="End Lab"
    />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import Delete from 'components/shared/Delete.vue'
import { QSpinnerFacebook, copyToClipboard } from 'quasar'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'

import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import SlideView from 'components/dashboard/SlideView.vue'
import { useLabStore } from 'src/store/pinia/lab'
import { useNewProvisionStore } from 'src/store/pinia/newProvision'

export default {
  name: 'CompanyAdminOpsTable',
  components: { Delete, SlideView },
  setup() {
    const $q = useQuasar()
    const labStore = useLabStore()
    const newProvisionStore = useNewProvisionStore()

    const newLabInfo = ref({})
    const search = ref('')
    const labUsername = 'appsecengineer'
    const labPassword = '******'
    const currentPage = ref(1)
    const pagination = ref({ sortBy: 'desc', descending: false, page: 1, rowsPerPage: 8 })
    const isDelete = ref(false)
    const typeDelete = ref('')
    const running_instance_id = ref('')
    const instance_id = ref('')
    const runningLabName = ref('')
    const loadingLabName = ref('')
    const labTempName = ref('')
    const markingStatusInfo = ref({})
    const router = useRouter()

    const columns = [
      { name: 'Name', label: 'Name', field: 'name', sortable: true, align: 'left' },
      { name: 'Action', label: '', field: 'Action', sortable: false, align: 'center' }
    ]

    const deleteLabServer = async (data) => {
      await newProvisionStore.deleteLabServer(data)
    }

    const markTopicCompletedLab = async (info) => {
      await newProvisionStore.markTopicCompletedLab(info)
    }

    const viewLabInfo = async (row) => {
      if (row.event_id && row.subject_id && row.id) {
        await router.push(
          `/portal/course-info/lab/${urlSafeBase64Encode(row.event_id)}/${urlSafeBase64Encode(row.subject_id)}/${urlSafeBase64Encode(
            row.id
          )}`
        )
      }
    }

    const stopLab = (running_instance, instance, labName, labInfo) => {
      newLabInfo.value = labInfo
      labTempName.value = labName
      runningLabName.value = 'quit ' + '"' + labName + '" '
      isDelete.value = true
      running_instance_id.value = running_instance
      instance_id.value = instance
      markingStatusInfo.value = {
        event_id: labInfo.event_id,
        item_id: labInfo.id
      }
    }

    const labConfirmDeletion = async (event) => {
      loadingLabName.value = labTempName.value
      if (event.show) {
        const data = {
          server_id: running_instance_id.value,
          server_instance_id: instance_id.value
        }
        await deleteLabServer(data)
        isDelete.value = false
        if (newProvisionStore.markLab && (newLabInfo.value ? !newLabInfo.value.challenge_id : true)) {
          await markTopicCompletedLab(markingStatusInfo.value)
        }
        router.go()
      }
    }

    const labConfirmDeleteCancel = (event) => {
      if (event.show) {
        isDelete.value = false
      }
    }

    const accessLab = (event_id, subject_id, lab_id) => {
      const url = `/portal/course-info/lab/${urlSafeBase64Encode(event_id)}/${urlSafeBase64Encode(subject_id)}/${urlSafeBase64Encode(
        lab_id
      )}`
      setTimeout(() => {
        window.location.replace(url)
      })
    }

    watch(
      () => newProvisionStore.isServerDeleted,
      (value) => {
        if (value) {
          showLoadingSpinner()
        } else {
          hideLoadingSpinner()
        }
      }
    )

    const showLoadingSpinner = () => {
      // Show loading spinner
      $q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: 'white',
        spinnerSize: 140,
        message: 'Hang on...',
        messageColor: 'white'
      })
    }

    const hideLoadingSpinner = () => {
      // Hide loading spinner
      $q.loading.hide()
    }

    return {
      newLabInfo,
      search,
      labUsername,
      labPassword,
      currentPage,
      pagination,
      columns,
      isDelete,
      typeDelete,
      running_instance_id,
      instance_id,
      runningLabName,
      loadingLabName,
      labTempName,
      markingStatusInfo,
      // serverDelete,
      //getMarkLabStatus,
      deleteLabServer,
      markTopicCompletedLab,
      viewLabInfo,
      stopLab,
      labConfirmDeletion,
      labConfirmDeleteCancel,
      accessLab,
      router,
      labStore,
      newProvisionStore
    }
  }
}
</script>

<style scoped>
.noDataView {
  width: 100%;
  height: 50vh;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
</style>
