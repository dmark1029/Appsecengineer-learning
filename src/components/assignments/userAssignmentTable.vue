<template>
  <div style="width: ">
    <BaseTable
      no-data-label="Not assigned any assignments"
      :table-header-style="{ backgroundColor: '#fff', color: '#11142D' }"
      :rows="assignmentStore.assignmentUserList"
      :columns="columns"
      class="q-table th.sortable sticky-header-table"
      row-key="index"
      :rows-per-page-options="[0]"
      virtual-scroll
      style="max-height: 70vh"
    >
      <template v-slot:body-cell-Name="props">
        <q-td :props="props" @click="actionItemAssignment(props.row)">
          <q-item>
            <q-item-section @click="actionItemAssignment(props.row)">
              <q-item-label class="">
                <div>{{ props.row.name }}</div>
                <q-tooltip>{{ props.row.name }}</q-tooltip>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-td>
      </template>
      <template v-slot:body-cell-start_date="props">
        <q-td :props="props">
          <q-chip square color="primary" size="sm" text-color="white" icon="event">
            {{ statusDateFormatterCalender(props.row.start_date) }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-end_date="props">
        <q-td :props="props">
          <q-chip square size="sm" color="orange" text-color="white" icon="event">
            {{ statusDateFormatterCalender(props.row.end_date) }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-assignment="props">
        <q-td :props="props" align="right">
          <q-chip text-color="white" color="green" v-if="statusDateFormatter(props.row.end_date) !== 'EXPIRED'" size="sm">
            {{ statusDateFormatter(props.row.end_date) === 'EXPIRED' ? `EXPIRED` : `ACTIVE` }}
          </q-chip>
          <q-chip text-color="white" color="red" v-else size="sm">
            {{ statusDateFormatter(props.row.end_date) === 'EXPIRED' ? `EXPIRED` : `ACTIVE` }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:no-data-label>
        <q-item>
          <q-item-section class="text-grey">
            <p class="text-h4 text-center text-weight-bold ase-roboto ase-black-light line-height-normal padding_12">No data</p>
          </q-item-section>
        </q-item>
      </template>
    </BaseTable>
    <div align="left" v-if="Object.keys(assignmentStore.paginatedUserAssignment).length > 0">
      <q-btn
        class="ase-roboto ase-md"
        label="Load More"
        color="primary"
        @click="loadMoreAssignments(assignmentStore.paginatedUserAssignment)"
      />
    </div>
  </div>
</template>

<script>
import { dateFormatReadable, differenceDates, urlSafeBase64Encode } from 'src/utils/reuseFunctions'

import { useAssignmentStore } from 'src/store/pinia/assignment'
import { storeToRefs } from 'pinia'

export default {
  name: 'userAssignmentTable',
  setup() {
    const assignmentStore = useAssignmentStore()
    return {
      assignmentStore
    }
  },
  data() {
    return {
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 8
      },
      columns: [
        { name: 'index', label: '#', field: 'index' },
        { name: 'Name', label: 'Name', field: 'name', sortable: true, align: 'left' },
        { name: 'start_date', label: 'Start date', field: 'start_date', sortable: true, align: 'center' },
        { name: 'end_date', label: 'End date', field: 'end_date', sortable: true, align: 'center' },
        { name: 'assignment', label: 'Status', field: 'end_date', sortable: true, align: 'center' }
      ]
    }
  },
  methods: {
    async actionItemAssignment(value) {
      await this.$router.push(`/portal/individual-user-assignment-details/${urlSafeBase64Encode(value.id)}}/`)
    },
    statusDateFormatterCalender(date) {
      return dateFormatReadable(date)
    },
    statusDateFormatter(date) {
      const d = new Date()
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      const year = d.getFullYear()

      if (month.length < 2) {
        month = '0' + month
      }
      if (day.length < 2) {
        day = '0' + day
      }
      const finalDate = [year, month, day].join('-')
      return differenceDates('', date, finalDate)
    },
    loadMoreAssignments(pagination) {
      //this.loadingStatus(true)
      const data = Object.keys(pagination).length === 0 ? {} : { LastEvaluatedKey: pagination }
      this.assignmentStore.fetchCompanyAssignmentUserListPaginated(data)
    }
  }
}
</script>

<style lang="sass">
.sticky-header-table

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th,
  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
</style>
