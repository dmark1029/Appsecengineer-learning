<template>
  <div class="q-my-md">
    <BaseTable
      :columns="columns"
      :rows="dataInfo"
      :rows-per-page-options="[0]"
      virtual-scroll
      style="max-height: calc(400px)"
      hide-pagination
      customClasses="sticky-head"
    >
      <template #body-cell-event_name="props">
        <q-td>
          {{ props.row.event_name }}
          <q-linear-progress :value="props.row.progress / 100" color="green" class="q-mt-sm" />
        </q-td>
      </template>
      <template #body-cell-serial_number="props">
        <q-td>
          {{ props.pageIndex + 1 }}
        </q-td>
      </template>
      <template #body-cell-action="props">
        <q-td class="row justify-end q-ml-4">
          <q-circular-progress
            show-value
            font-size="12px"
            :value="props.row.progress"
            size="40px"
            :thickness="0.3"
            color="black"
            track-color="green-12"
            class="q-mr-lg"
          >
            {{ props.row.progress + '%' }}
          </q-circular-progress>
        </q-td>
      </template>
      <!-- <template #body-cell-serial_number="props"></template> -->
    </BaseTable>
  </div>
</template>

<script>
export default {
  name: 'CreateTableUser',
  props: ['title', 'dataInfo'],
  data() {
    return {
      showData: [],
      columns: [
        {
          name: 'serial_number',
          align: 'left',
          label: '#',
          field: 'serial_number'
        },
        {
          name: 'event_name',
          required: true,
          label: 'Courses',
          align: 'left',
          field: (row) => row.event_name,
          format: (val) => `${val}`,
          sortable: true
        },
        {
          name: 'action',
          align: 'right',
          label: '',
          field: 'serial_number',
          sortable: true
        }
      ]
    }
  }
}
</script>
