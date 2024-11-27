<template>
  <div>
    <BaseTable
      no-data-label="No challenges attached."
      :rows="testsStore.tests"
      :columns="columns"
      :table-header-class="'radius-8 ase-roboto text-subtitle1 text-weight-bold'"
      :rows-per-page-options="[0]"
      row-key="index"
      virtual-scroll
      style="max-height: 70vh"
      :loading="testsStore.isLoading"
    >
      <template v-slot:body-cell-Name="props">
        <q-td :props="props">
          <div class="text-subtitle2 ase-roboto cursor_pointer" @click="actionItemAssignment(props.row)">
            {{ props.row.challenge_name }}
            <q-tooltip>{{ props.row.challenge_name }}</q-tooltip>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-score="props">
        <q-td :props="props">
          <div class="text-subtitle2 ase-roboto cursor_pointer" @click="actionItemAssignment(props.row)">
            {{ props.row.score }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-created_at="props">
        <q-td :props="props">
          <div class="text-subtitle2 ase-roboto cursor_pointer">
            <q-icon name="event" />
            {{ updateDateFormatter(props.row.created_at) }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <q-btn
            round
            icon="delete"
            size="sm"
            :disable="new Date().toISOString() > currentTest?.start_date"
            :color="new Date().toISOString() > currentTest?.start_date ? 'grey-7' : 'red-4'"
            @click="deletePage(props.row)"
          >
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </BaseTable>
    <div align="left">
      <q-btn
        v-if="testsStore.testsKey"
        class="ase-roboto ase-md"
        color="secondary"
        :loading="testsStore.isLoading"
        push
        size="14px"
        @click="loadMoreUsers()"
      >
        Load more
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
          Loading...
        </template>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { dateFormatReadable, urlSafeBase64Decode } from 'src/utils/reuseFunctions'

import { useTestsStore } from 'src/store/pinia/tests'
import { defineComponent, onBeforeMount, ref, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

defineComponent({
  name: 'TestsTable'
})

const props = defineProps(['search'])
const emit = defineEmits(['clearTableData', 'deletePage'])

const testsStore = useTestsStore()

const route = useRoute()

const columns = ref([
  { name: 'Name', label: 'Name', field: 'challenge_name', sortable: true, align: 'left' },
  { name: 'score', label: 'Score', field: 'score', sortable: true, align: 'left' },
  { name: 'created_at', label: 'Created on', field: 'created_at', sortable: true, align: 'left' },
  { name: 'Action', label: 'Action', field: 'Action', sortable: false, align: 'right' }
])
const currentTest = shallowRef(undefined)

onBeforeMount(() => {
  emit('clearTableData')
  currentTest.value = urlSafeBase64Decode(route.params.startDate)
})

function updateDateFormatter(date) {
  return dateFormatReadable(date)
}

async function loadMoreUsers() {
  if (!props.search) {
    testsStore.fetchTestsPaginated({
      test: urlSafeBase64Decode(route.params.testId)
    })
  } else {
    const data = {
      search_term: props.search,
      test: urlSafeBase64Decode(route.params.testId)
    }
    await testsStore.fetchTestsPaginated(data)
  }
}

function deletePage(data) {
  emit('deletePage', { show: true, data: data })
}
</script>

<style scoped lang="sass">
thead tr th
  font-size: 14px
  font-weight: 600
thead tr th
  font-size: 14px
  font-weight: 600
</style>
