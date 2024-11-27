<template>
  <RunningLabsTable @showDeleteLab="stopLab" />
</template>

<script>
import RunningLabsTable from 'components/running_labs/RunningLabsTable.vue'
import { QSpinnerFacebook, LocalStorage, useQuasar } from 'quasar'
import { todayDate, todayDateValue } from 'src/utils/reuseFunctions'
import { onMounted, watch, computed } from 'vue'
import { useProfileStore } from 'src/store/pinia/profile'
import { useLabStore } from 'src/store/pinia/lab'
import { storeToRefs } from 'pinia'

export default {
  name: 'RunningLabsIndex',
  components: { RunningLabsTable },
  setup () {
    const $q = useQuasar()
    const profileStore = useProfileStore()
    const labStore = useLabStore()

    const { isLoading: isLoadingLabs } = storeToRefs(labStore)

    const stopLab = (running_instance_id, instance_id) => {
      isDelete.value = true
      running_instance_id.value = ''
      running_instance_id.value = running_instance_id
      instance_id.value = ''
      instance_id.value = instance_id
    }

    const labConfirmDeletion = async (event) => {
      if (event.show) {
        const data = {
          server_id: running_instance_id.value,
          server_instance_id: instance_id.value
        }
        await labStore.deleteLabServer(data)
        isDelete.value = false
      }
    }

    const labConfirmDeleteCancel = (event) => {
      if (event.show) {
        isDelete.value = false
      }
    }

    // Fetch data on component creation
    onMounted(async () => {
      await labStore.fetchRunningLabs()
      if (!LocalStorage.getItem('EXPIRED_TIME') || LocalStorage.getItem('currentDate') !== todayDateValue().toString()) {
        todayDate()
        profileStore.fetchProfileDetailedInformation()
      }
    })
    // Show loading spinner when labStore.isLoading is true
    watch(isLoadingLabs, (value) => {

      if (value) {
        $q.loading.show({
          spinner: QSpinnerFacebook,
          spinnerColor: 'white',
          spinnerSize: 140,
          message: 'Hang on...',
          messageColor: 'white'
        })
      } else {
        $q.loading.hide()
      }
    })



    // Fetch profile detailed information

    return {
      stopLab,
      labConfirmDeletion,
      labConfirmDeleteCancel,
      profileStore,
      labStore
    }
  }
}
</script>
