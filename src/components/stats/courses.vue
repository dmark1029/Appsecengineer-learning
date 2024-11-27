<template>
  <div>
    <BaseTable
      no-data-label="No data available"
      :table-header-style="{}"
      :rows="data || []"
      :columns="columns"
      class="q-table th.sortable sticky-header-table"
      row-key="index"
      :rows-per-page-options="[0]"
      virtual-scroll
      style="max-height: 70vh"
      color="#fff"
    >
      <template v-slot:body-cell-course_name="props">
        <q-td :props="props">
          <q-item>
            <q-item-section @click="actionRedirect(props.row.course)">
              <q-item-label class="ase-roboto portal_color cursor_pointer">
                <p
                  style="line-height: 0.7; margin: 0px"
                  class="text-subtitle2 ase-roboto text-link cursor_pointer text-weight-regular border_underline"
                >
                  {{ props.row.course_name }}
                </p>
                <label class="text-caption">{{ timeSince(props.row.timestamp) }}</label>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-td>
      </template>
    </BaseTable>
  </div>
</template>
<script>
import { urlSafeBase64Encode, timeSinceFromEpoch } from 'src/utils/reuseFunctions'
export default {
  name: 'coursesListView',
  props: ['data'],
  data() {
    return {
      columns: [
        {
          name: 'course_name',
          required: true,
          label: 'Name',
          align: 'left',
          field: (row) => row.course_name,
          format: (val) => `${val}`,
          sortable: true
        }
      ]
    }
  },
  methods: {
    async actionRedirect(id) {
      await this.$router.push(`/portal/course-info/intro/${urlSafeBase64Encode(id)}}/`)
    },
    timeSince(time) {
      return timeSinceFromEpoch(time)
    }
  }
}
</script>
