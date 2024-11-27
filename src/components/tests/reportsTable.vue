<template>
  <div>
    <div>
      <BaseTable
        no-data-label="No tests to display."
        :rows="testsStore.tests"
        :columns="columns"
        table-header-class="sticky-header-table"
        :rows-per-page-options="[0]"
        row-key="index"
        virtual-scroll
        style="max-height: 70vh"
      >
        <template v-slot:body-cell-Name="props">
          <q-td :props="props">
            <q-item style="max-width: 420px">
              <q-item-section>
                <q-item-label class="text-caption ase-roboto ase-black-light cursor_pointer">
                  {{ props.row.challenge_name }}
                  <q-tooltip>{{ props.row.challenge_name }}</q-tooltip>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </template>
        <template v-slot:body-cell-score="props">
          <q-td :props="props">
            <q-item style="max-width: 420px">
              <q-item-section>
                <q-item-label class="text-caption ase-roboto ase-black-light cursor_pointer">
                  {{ props.row.score }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </template>
        <template v-slot:body-cell-created_at="props">
          <q-td :props="props">
            <q-item-label class="text-caption ase-roboto ase-black-light cursor_pointer">
              <q-icon name="event" />
              {{ updateDateFormatter(props.row.created_at) }}
            </q-item-label>
          </q-td>
        </template>
        <template v-slot:body-cell-Action="props">
          <q-td :props="props">
            <q-btn round class="q-mr-sm" icon="edit" size="sm" @click="updatePage(props.row)">
              <q-tooltip>Update</q-tooltip>
            </q-btn>
            <q-btn round icon="delete" size="sm" @click="deletePage(props.row)">
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </BaseTable>
    </div>
    <div align="left">
      <q-btn
        v-if="testsStore.testsKey"
        class="ase-roboto ase-md"
        color="secondary"
        :loading="testsStore.isLoading"
        push
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

<script>
import { QSpinnerFacebook } from 'quasar'
import { dateFormatReadable, urlSafeBase64Decode, urlSafeBase64Encode } from 'src/utils/reuseFunctions'

import { useTestsStore } from 'src/store/pinia/tests'

export default {
  name: 'ReportsTable',
  props: ['search'],
  components: {},
  setup() {
    const testsStore = useTestsStore()
    return {
      testsStore
    }
  },

  data() {
    return {
      columns: [
        {
          name: 'Name',
          label: 'Name',
          field: 'challenge_name',
          sortable: true,
          align: 'left'
        },
        {
          name: 'score',
          label: 'Score',
          field: 'score',
          sortable: true,
          align: 'left'
        },
        {
          name: 'created_at',
          label: 'Created on',
          field: 'created_at',
          sortable: true,
          align: 'left'
        },
        {
          name: 'Action',
          label: 'Action',
          field: 'Action',
          sortable: false,
          align: 'right'
        }
      ]
    }
  },
  watch: {
    // registerStatus: {
    //   handler() {
    //     if (this.registerStatus) {
    //       this.$q.loading.show({
    //         spinner: QSpinnerFacebook,
    //         spinnerColor: 'white',
    //         spinnerSize: 140,
    //         message: 'Hang on...',
    //         messageColor: 'white'
    //       })
    //     } else {
    //       this.$q.loading.hide()
    //     }
    //   }
    // }
    // 'testsStore.isLoading': {
    //   handler() {
    //     if (this.testsStore.isLoading) {
    //       this.$q.loading.show({
    //         spinner: QSpinnerFacebook,
    //         spinnerColor: 'white',
    //         spinnerSize: 140,
    //         message: 'Hang on...',
    //         messageColor: 'white'
    //       })
    //     } else {
    //       this.$q.loading.hide()
    //     }
    //   }
    // }
  },
  created() {},
  methods: {
    async moveToTests(data) {
      await this.$router.push(`/portal/company/contests/${urlSafeBase64Encode(data.sk)}/`)
    },
    updateDateFormatter(date) {
      return dateFormatReadable(date)
    },
    async loadMoreUsers() {
      //this.isStatus(true)
      if (!this.search) {
        //this.isStatus(true)
        this.testsStore.fetchTestsPaginated({
          test: urlSafeBase64Decode(this.$route.params.testId)
        })
      } else {
        const data = {
          search_term: this.search,
          test: urlSafeBase64Decode(this.$route.params.testId)
        }
        await this.testsStore.fetchTestsPaginated(data)
      }
    },
    updatePage(data) {
      this.$emit('updatePage', { show: true, data: data })
    },
    deletePage(data) {
      this.$emit('deletePage', { show: true, data: data })
    }
  }
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
