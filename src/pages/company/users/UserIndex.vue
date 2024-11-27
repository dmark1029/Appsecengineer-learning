<template>
  <BaseCard class="br-4 column q-py-sm q-px-lg">
    <div class="column" v-if="!isCreate && !isDelete && !isCustom">
      <div class="col-12 q-my-lg">
        <div class="row justify-between">
          <titleSearch
            showSearch
            v-model="search"
            @clearSearchData="companyUsers.clearSearch()"
            @searchData="setSearch(search)"
            @showCreate="enableCreateUser($event)"
            @showPopWindow="showPopWindow"
          />
          <div>
            <BaseBtn
              color="primary"
              label="Secret Generate"
              padding="8px 10px"
              align="left"
              style="margin: 0px 15px"
              @click="generateSecret()"
            />
            <BaseBtn
              color="primary"
              icon="settings"
              label="Custom Fields"
              padding="8px 10px"
              align="right"
              :to="{ name: 'company.user_settings' }"
            />
          </div>
        </div>
      </div>
      <div class="row col-12 q-col-gutter-lg q-my-sm">
        <div class="col-9">
          <usersList @updateCustomFields="updateCustomFields($event)" @showCreateUser="enableCreateUser($event)" />
        </div>
        <div class="col-3">
          <div class="text-subtitle1">Statistics</div>
          <StatisticCard :stats="statistics" />
        </div>
      </div>
    </div>

    <template v-if="isCreate && !isDelete && !isCustom">
      <create-company-user :dynamicFields="dataCustom" :id="updateId" @onCacel="cancelCreateUser($event)">
        <div class="text-subtitle1">
          {{ title }}
        </div>
      </create-company-user>
    </template>
    <template>
      <BaseDialog v-model="isCustom" title="Update User" @close="cancelCustomFields">
        <q-card-section class="q-pa-sm">
          <q-form @submit="onSubmitCustomFields()" class="q-gutter-md">
            <q-list class="row">
              <div v-for="companyField in dataCustomIndividualUser" class="q-pa-xs col-6" :key="companyField.key">
                <BaseSelect
                  v-if="companyField.keydropdown === 'Dropdown'"
                  :label="companyField.key + ' *'"
                  :options="companyField.values_list"
                  v-model="companyField.value"
                />
                <BaseInput
                  v-if="companyField.keydropdown === 'Text'"
                  :disabled="companyField.key === 'email'"
                  :label="companyField.key + ' *'"
                  :maxLength="50"
                  v-model="companyField.value"
                />
                <p
                  v-if="companyUsersStore.errorCompanyUserCustomFields[companyField.key] && !companyField.value"
                  class="text-caption text-negative"
                >
                  {{ companyUsersStore.errorCompanyUserCustomFields[companyField.key + '_msg'] }}
                </p>
              </div>
            </q-list>
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <BaseBtn @click="onSubmitCustomFields()">Save</BaseBtn>
        </q-card-actions>
      </BaseDialog>
    </template>

    <template v-if="show">
      <ImportUser v-model="show" />
    </template>

    <template>
      <BaseDialog v-model="isSecretGenerated" title="Secret" @close="isSecretGenerated = false">
        <q-card-section class="q-pa-sm">
          <q-card-section style="display: flex" v-if="this.secret">
            <div class="text-subtitle1" style="width: 30%; word-wrap: break-word">Generated Secret :</div>
            <div class="text-subtitle1" style="width: 60%">
              **********************************************
              <q-icon
                name="fas fa-copy"
                class="text-grey"
                style="cursor: pointer; float: right; scale: 1.4"
                @click="copySecret(this.secret)"
              />
            </div>
          </q-card-section>
          <q-card-section v-else>
            <div class="text-subtitle1" style="width: 100%; display: flex; justify-content: center">No secret</div>
          </q-card-section>
        </q-card-section>
        <q-card-actions align="center">
          <BaseBtn @click="closeModal()">OK</BaseBtn>
        </q-card-actions>
      </BaseDialog>
    </template>
  </BaseCard>
</template>

<script>
import CreateCompanyUser from 'components/company/CreateCompanyUser.vue'
import titleSearch from 'components/company/companyInfo/titleSearch.vue'
import usersList from 'components/company/companyInfo/usersList.vue'
import StatisticCard from 'src/components/common/StatisticCard.vue'
import BaseInput from 'src/components/shared/BaseInput.vue'
import BaseSelect from 'src/components/shared/BaseSelect.vue'

import ImportUser from './ImportUser.vue'
import { useCompanyUsers } from 'src/store/pinia/company/user.js'
import { ref } from 'vue'
import { copyToClipboard } from 'quasar'
import { LocalStorage } from 'quasar'
import jwt_decode from 'jwt-decode'
import { useReportStore } from 'src/store/pinia/report/'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'
export default {
  name: 'CompanyUserOps',
  components: {
    usersList,
    'create-company-user': CreateCompanyUser,
    StatisticCard,
    titleSearch,
    BaseInput,
    BaseSelect,
    ImportUser
  },
  data() {
    return {
      file: null,
      isCreate: false,
      isCustom: false,
      isDelete: false,
      enable: false,
      updateId: '',
      title: 'CREATE USER',
      email: '',
      show: false,
      dataCustom: [],
      dataCustomIndividualUser: [],
      isSecretGenerated: false,
      secret: ''
    }
  },
  created() {
    document.title = 'Company Users'
    this.reportStore.fetchCompanyStatsReport({ select: 'overall' })
    this.reportStore.setUserActionSelectedItem('Overall')
    this.reportStore.fetchUsersStatsCountFun({ select: 'company' })
  },
  methods: {
    async enableCreateUser(event) {
      if (event.show) {
        if (!this.companyUsersStore.companyInfo.id) {
          await this.companyUsersStore.fetchCompanyInfo()
        }
        await this.dynamicAttributesInfo()
      }
    },
    async dynamicAttributesInfo() {
      if (this.companyUsersStore.companyUserCustomFields.c_attrs.length === 0) {
        try {
          await this.companyUsersStore.fetchCompanyUserCustomFieldsData({
            company_id: this.companyUsersStore.companyInfo.id
          })
        } catch (error) {
          console.log(error)
        }
      }
      let newFields = this.companyUsersStore.companyUserCustomFields.c_attrs.map((data) => ({
        keydropdown: typeof this.companyUsersStore.companyUserCustomFields.defaults[data] === 'object' ? 'Dropdown' : 'Text',
        key: data,
        value: '',
        values_list: this.companyUsersStore.companyUserCustomFields.defaults[data]
          ? this.companyUsersStore.companyUserCustomFields.defaults[data]
          : []
      }))
      this.dataCustom = newFields
      this.isCreate = true
    },
    showPopWindow(info) {
      this.show = true
    },

    async updateCustomFields(event) {
      if (!this.companyUsersStore.companyInfo.id) {
        await this.companyUsersStore.fetchCompanyInfo()
      }
      if (this.companyUsersStore.companyUserCustomFields.c_attrs.length === 0) {
        await this.companyUsersStore.fetchCompanyUserCustomFieldsData({
          company_id: this.companyUsersStore.companyInfo.id
        })
      }
      if (event.show) {
        this.companyUsersStore.errorMsgResetCustomFields({ status: false })
        this.isCustom = true
        const customFields = []
        Object.entries(event.payload).forEach(([key, value]) => {
          if (
            key !== 'firstName' &&
            key !== 'lastName' &&
            key !== 'isActive' &&
            key !== 'option' &&
            key !== 'resend' &&
            key !== 'fullName'
          ) {
            customFields.push({
              keydropdown: typeof this.companyUsersStore.companyUserCustomFields.defaults[key] === 'object' ? 'Dropdown' : 'Text',
              key: key,
              value: value,
              values_list: this.companyUsersStore.companyUserCustomFields.defaults[key]
                ? this.companyUsersStore.companyUserCustomFields.defaults[key]
                : []
            })
          }
        })
        this.dataCustomIndividualUser = customFields
      }
    },

    convertToCSV(objArray) {
      const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
      let str = ''

      for (let i = 0; i < array.length; i++) {
        let line = ''
        for (const index in array[i]) {
          if (line !== '') line += ','
          line += array[i][index]
        }
        str += line + '\r\n'
      }
      return str
    },
    exportCSVFile(headers, items, fileTitle) {
      if (headers) {
        items.unshift(headers)
      }

      const jsonObject = JSON.stringify(items)

      const csv = this.convertToCSV(jsonObject)

      const exportedFilenmae = fileTitle + '.csv' || 'export.csv'

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, exportedFilenmae)
      } else {
        const link = document.createElement('a')
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', exportedFilenmae)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    },

    cancelCreateUser(event) {
      if (event.show) {
        this.isCreate = false
      }
    },
    cancelCustomFields() {
      this.isCustom = false
    },
    async onSubmitCustomFields() {
      const trueStatus = true
      const err_msgs = {}
      await this.companyUsersStore.errorMsgResetCustomFields(err_msgs)
      if (trueStatus) {
        const data = {}
        this.dataCustomIndividualUser.map((dataField) => (data[dataField.key] = dataField.value))
        //this.isStatus(true)
        await this.companyUsersStore.updateIndividualCompanyUserCustomFields(data)
        if (!this.companyUsersStore.errorCompanyUserCustomFields.status) {
          this.isCustom = true
        } else {
          this.isCustom = false
        }
      }
    },
    async generateSecret() {
      this.$q.loading.show({
        message: 'Generating secret...'
      })
      this.isSecretGenerated = true
      const token = LocalStorage.getItem('token')
      const decodedData = jwt_decode(token)
      const payload = {
        username: decodedData.sub
      }
      this.secret = await this.companyUsersStore.generateSecretToken(payload)
      this.$q.loading.hide()
    },
    closeModal() {
      this.isSecretGenerated = false
    },
    copySecret(secret) {
      copyToClipboard(secret)
        .then(() => {
          this.$q.notify({
            message: 'Secret has been successfully copied',
            color: 'green',
            position: 'top'
          })
        })
        .catch(() => {
          this.$q.notify({
            message: 'Not able to copy',
            color: 'red',
            position: 'top'
          })
        })
    }
  },
  computed: {
    statistics() {
      return [
        {
          title: 'Total users',
          count: this.reportStore.statsUserCountData?.totalUsersCount || 0
        },
        {
          title: 'Total Badges Earned',
          count: this.reportStore.statsUserCountData?.totalBadgesCount || 0
        },
        {
          title: 'Total Outliers',
          count: this.reportStore.companyUserStats.outliners?.length || 0
        }
      ]
    }
  },
  setup() {
    const companyUsers = useCompanyUsers()
    const reportStore = useReportStore()
    const companyUsersStore = useCompanyConsumerStore()
    const search = ref('')
    if (companyUsers.payload.name) search.value = companyUsers.payload.name

    function setSearch(value) {
      if (!value) return
      companyUsers.payload.name = value
      companyUsers.payload.all = undefined
      companyUsers.payload.LastEvaluatedKey = undefined
      companyUsers.companyUsers = []
      companyUsers.searchUsers()
    }
    return {
      companyUsers,
      setSearch,
      search,
      reportStore,
      companyUsersStore
    }
  }
}
</script>
