<template>
  <div>
    <BaseTable
      :columns="columns"
      row-key="email"
      :rows="companyUsers.companyUsers"
      :rows-per-page-options="[0]"
      virtual-scroll
      style="max-height: calc(100vh - 300px)"
      hide-pagination
      :loading="companyUsers.loading"
      @virtual-scroll="loadMore"
      customClasses="sticky-head"
    >
      <template #body-cell-fullName="props">
        <q-td @click="getUserInfo(props.row.email, props.value)" class="cursor-pointer">
          {{ props.value }}
        </q-td>
      </template>
      <template #body-cell-email="props">
        <q-td @click="getUserInfo(props.value, props.row.fullName)" class="cursor-pointer">
          {{ props.value }}
        </q-td>
      </template>
      <template #body-cell-serial_number="props">
        <q-td>
          {{ props.pageIndex + 1 }}
        </q-td>
      </template>
      <template #body-cell-active="props">
        <q-td>
          <q-toggle
            label=""
            v-model="companyUsers.companyUsers[props.pageIndex].is_active"
            @update:modelValue="toggleStatus(props.row.email, !companyUsers.companyUsers[props.pageIndex].is_active, props.pageIndex)"
            :loading="true"
          />
          <q-inner-loading :showing="true" v-if="props.pageIndex === pageIndex" />
        </q-td>
      </template>
    </BaseTable>
  </div>
</template>

<script>
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'

import { useCompanyUsers } from 'src/store/pinia/company/user.js'
import { ref } from 'vue'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'
export default {
  name: 'usersList',
  methods: {
    async toggleStatus(email, status, index) {
      this.pageIndex = index
      const data = {
        email: email
      }
      const response = status ? await this.companyUsersStore.disableCompanyUser(data) : await this.companyUsersStore.enableCompanyUser(data)
      this.pageIndex = undefined
      if (!response) {
        this.companyUsers.companyUsers[index].is_active = false
      }
    },
    async getUserInfo(email, username) {
      await this.$router.push(`/portal/company/profile-info/${urlSafeBase64Encode(email)}/${urlSafeBase64Encode(username)}`)
    }
  },
  computed: {
    columns() {
      return [
        {
          name: 'serial_number',
          align: 'left',
          label: '#',
          field: 'serial_number'
        },
        {
          name: 'fullName',
          align: 'left',
          label: 'Full Name',
          field: 'full_name'
        },
        {
          name: 'email',
          align: 'left',
          label: 'Email',
          field: 'email'
        },
        {
          name: 'active',
          align: 'left',
          label: 'Active',
          field: 'is_active'
        }
      ]
    }
  },
  setup() {
    const companyUsers = useCompanyUsers()
    const companyUsersStore = useCompanyConsumerStore()

    async function fetchCompanyUser() {
      companyUsers.clearSearch()
    }
    const pageIndex = ref(undefined)

    function bootUsers() {
      if (companyUsers.companyUsers?.length) return
      fetchCompanyUser()
    }

    bootUsers()

    async function loadMore(details) {
      if (details.index === companyUsers.companyUsers.length - 1 && companyUsers.payload.LastEvaluatedKey && !companyUsers.loading) {
        if (companyUsers.payload.name) {
          companyUsers.searchUsers()
        } else {
          companyUsers.fetchCompanyUser()
        }
      }
    }

    return {
      companyUsers,
      loadMore,
      pageIndex,
      companyUsersStore
    }
  }
}
</script>
