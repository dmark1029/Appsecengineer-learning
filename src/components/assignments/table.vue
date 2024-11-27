<template>
  <div>
    <div
      v-if="
        assignmentStore.assignmentList.filter((data) => (filterData === 'All' ? data : data.status_assignment === filterData)).length > 0
      "
      class="row"
    >
      <div
        v-for="listData in assignmentStore.assignmentList.filter((data) =>
          filterData === 'All' ? data : data.status_assignment === filterData
        )"
        class="q-pa-xs col-xs-12 col-sm-4 col-md-4 col-xl-3 q-pa-md ase-roboto"
        :key="listData.index"
      >
        <q-card class="transparent radius-12 highlight-and-fad cursor-pointer" @click="actionItemAssignment(listData)">
          <q-card-section class="q-py-sm bg-grey-2">
            <div class="text-subtitle1 ellipsis text-capitalize text-link">
              {{ listData.name }}
              <q-tooltip>{{ listData.name }}</q-tooltip>
            </div>
          </q-card-section>
          <q-separator
            :color="listData.status_assignment === 'Valid' ? 'green' : listData.status_assignment === 'Expired' ? 'red' : 'green'"
          />
          <q-card-section>
            <p class="light-caption">
              Status :
              <q-badge :color="listData.status_assignment === 'Valid' ? 'green' : 'red'">
                {{ listData.status_assignment === 'Valid' ? 'Active' : 'Expired' }}
              </q-badge>
            </p>
            <p class="light-caption">Start date : {{ listData.start_date }}</p>
            <p class="light-caption">End date : {{ listData.end_date }}</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-else class="row flex flex-center absolute-center">
      <q-icon name="receipt_long" size="80px" style="color: #9b9b9b" />
      <p class="text-h5 ase-roboto ase-black-light">No Assignments</p>
    </div>
  </div>
</template>

<script>
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'

import { useAssignmentStore } from 'src/store/pinia/assignment'
export default {
  props: ['filterData'],
  setup() {
    const assignmentStore = useAssignmentStore()
    return {
      assignmentStore
    }
  },
  data() {
    return {
      columns: [
        { name: 'Name', label: 'Name', field: 'name', sortable: true, align: 'left' },
        { name: 'start_date', label: 'Start date', field: 'start_date', sortable: true, align: 'center' },
        { name: 'end_date', label: 'End date', field: 'end_date', sortable: true, align: 'center' },
        { name: 'status_assignment', label: 'Status', field: 'status_assignment', sortable: true, align: 'center' }
      ]
    }
  },
  methods: {
    async actionItemAssignment(value) {
      await this.$router.push(`/portal/company/assignments/${urlSafeBase64Encode(value.id)}}`)
    }
  }
}
</script>

<style lang="sass">
.noDataView
  width: 100%
  height: 50vh
  display: table-cell
  vertical-align: middle
  text-align: center
.capitalize-info
  text-transform: uppercase
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
