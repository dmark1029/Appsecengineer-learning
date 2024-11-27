<template>
  <div>
    <BaseTable
      :columns="columns"
      row-key="team_name"
      :rows="dataInfo"
      :rows-per-page-options="[0]"
      virtual-scroll
      style="max-height: calc(400px)"
      hide-pagination
      customClasses="sticky-head"
    >
      <template #body-cell-serial_number="props">
        <q-td>
          {{ props.pageIndex + 1 }}
        </q-td>
      </template>
      <template #body-cell-email="props">
        <q-td>
          {{ props.row }}
        </q-td>
      </template>
    </BaseTable>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'userCTFTable',
  props: ['title', 'dataInfo', 'cmpId'],
  data() {
    return {
      showData: []
    }
  },
  methods: {
    async actionItemAssignment(value) {}
  },
  setup() {
    const columns = computed(() => {
      return [
        {
          name: 'serial_number',
          align: 'left',
          label: '#',
          field: 'serial_number'
        },
        {
          name: 'email',
          align: 'left',
          label: 'Users',
          field: 'email'
        }
      ]
    })
    return { columns }
  }
}
</script>
