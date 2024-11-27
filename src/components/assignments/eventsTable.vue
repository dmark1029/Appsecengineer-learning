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
      @row-click="actionItemAssignment"
    >
      <template #body-cell-serial_number="props">
        <q-td>
          {{ props.pageIndex + 1 }}
        </q-td>
      </template>
    </BaseTable>
  </div>
</template>

<script>
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { computed } from 'vue'
export default {
  name: 'CreateEventTable',
  components: {},
  props: ['title', 'dataInfo'],
  data() {
    return {
      showData: []
    }
  },
  methods: {
    async actionItemAssignment(_, value) {
      await this.$router.push(`/portal/course-info/intro/${urlSafeBase64Encode(value.sk)}}/`)
    }
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
          name: 'event_name',
          align: 'left',
          label: 'Courses',
          field: 'event_name'
        }
      ]
    })
    return { columns }
  }
}
</script>
