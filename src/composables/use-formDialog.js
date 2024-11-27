import { computed } from 'vue'
import { cloneDeep, isBoolean } from 'lodash'
export default function useFormDialog() {
  const isFormOpen = ref(false)
  const editData = ref(undefined)
  const loadingForm = ref(false)

  const isDialogOpen = computed({
    get() {
      return isFormOpen.value || !!editData.value
    },
    set(value) {
      isFormOpen.value = !!value
      editData.value = isBoolean(value) ? undefined : value
    }
  })

  function openDialog() {
    isFormOpen.value = true
  }

  function closeDialog() {
    isDialogOpen.value = false
  }

  function setEditData(newData) {
    isDialogOpen.value = cloneDeep(newData)
  }

  return {
    loadingForm,
    isDialogOpen,
    openDialog,
    closeDialog,
    setEditData
  }
}
