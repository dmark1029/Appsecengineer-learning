<template>
  <div>
    <q-card-section>
      <div>
        <p class="text-subtitle1 text-weight-bold ase-roboto ase-black-shade">
          {{ teamName }}
        </p>
      </div>
    </q-card-section>
    <q-separator />
    <page
      v-model="search"
      @searchData="searchData"
      :title="''"
      :showCreate="false"
      :showSearch="false"
      :newFormat="false"
      :downloadReport="true"
      :newFormatLabel="'Include users'"
      @clearSearchData="clearSearchData"
      @createPage="enableIncludeUser($event)"
      @downloadReportXLS="downloadReportXLS($event)"
      :isTable="true"
    >
      <template v-slot:report></template>
      <slot>
        <BaseTable
          :rows="reportStore.teamUserStats.list"
          :table-header-style="{ backgroundColor: '#ffffff' }"
          :columns="columns"
          class="q-table th.sortable sticky-header-table"
          row-key="index"
          style="max-height: 70vh"
          :rows-per-page-options="[0]"
          virtual-scroll
        ></BaseTable>
      </slot>
    </page>
  </div>
</template>

<script>
import Page from 'components/shared/Page.vue'

import XLSX from 'xlsx'
import { useReportStore } from 'src/store/pinia/report'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
export default {
  name: 'CompanyIndividualTeamContent',
  components: {
    page: Page
  },
  props: {
    id: {},
    teamName: {}
  },
  setup() {
    const reportStore = useReportStore()
    const companyUserTeamsStore = useCompanyUserTeamsStore()
    return {
      reportStore,
      companyUserTeamsStore
    }
  },
  data() {
    return {
      teamIdVal: this.id,
      isIncludeGroup: false,
      nameOfReport: `${
        new Date().getDate().toString() +
        '-' +
        new Date().getMonth().toString() +
        '-' +
        new Date().getFullYear().toString() +
        '-' +
        new Date().getHours().toString() +
        ':' +
        new Date().getMinutes().toString() +
        ':' +
        new Date().getMilliseconds().toString()
      }`,
      search: '',
      isActive: [],
      columns: [
        { name: 'email', label: 'Email', field: 'email', sortable: false, align: 'left' },
        { name: 'First name', label: 'First name', field: 'First name', sortable: false, align: 'left' },
        { name: 'Last name', label: 'Last name', field: 'Last name', sortable: false, align: 'left' },
        { name: 'Course Minutes', label: 'Course Minutes', field: 'Course Minutes', sortable: false, align: 'left' },
        { name: 'Lab minutes', label: 'Lab minutes', field: 'Lab minutes', sortable: false, align: 'left' }
      ]
    }
  },
  created() {},
  watch: {
    getInActiveUsers: {
      handler() {
        if (this.normalUserPagination.pk) {
          this.isActive = ''
          this.isActive = this.getInActiveUsers
        }
      }
    }
  },
  methods: {
    s2ab(s) {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xff
      }
      return buf
    },
    download(url, name) {
      const a = document.createElement('a')
      a.href = url
      a.download = name
      a.click()
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 1000)
    },
    enableIncludeUser(event) {
      if (event.show) {
        this.isIncludeGroup = true
      }
    },
    async downloadReportXLS(event) {
      //this.isStatus(true)
      await this.companyUserTeamsStore.downloadXLSReportAction({ teams: { team_id: this.teamIdVal } })
      if (this.companyUserTeamsStore.errorMsgsReportTeamOverall.status) {
        const filteredData = this.companyUserTeamsStore.downloadXLSReport
        const reportCSV = XLSX.utils.json_to_sheet(filteredData)
        const wb = XLSX.utils.book_new()
        const colsSizes = [
          { width: 30 },
          { width: 25 },
          { width: 25 },
          { width: 50 },
          { width: 15 },
          { width: 15 },
          { width: 15 },
          { width: 15 },
          { width: 15 }
        ]
        const rowsSizes = [{ hpt: 25 }]

        reportCSV['!cols'] = colsSizes
        reportCSV['!rows'] = rowsSizes
        wb['!margins'] = { left: 2.0, right: 2.0, top: 1.0, bottom: 2.0, header: 0.5, footer: 0.5 }

        XLSX.utils.book_append_sheet(wb, reportCSV, 'Consolidated Report')

        const dateName = this.nameOfReport
        const xlsName = `${this.teamName}-Consolidated Report-${dateName}.xlsx`

        const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' })
        const url = window.URL.createObjectURL(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }))
        this.download(url, xlsName)
      }
    },
    async clearSearchData() {
      const data = {}
      await this.companyUserTeamsStore.fetchUsersByTeam(data)
    },
    async searchData() {
      if (!this.search) {
        const data = {}
        await this.companyUserTeamsStore.fetchUsersByTeam(data)
      } else {
        const data = {
          team_id: '',
          name: this.search
        }
        await this.companyUserTeamsStore.searchTeamUser(data)
      }
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
