<template>
  <BaseDialog v-model="includeGroup" @escape-key="onCancel()" title="Add Users" @close="onCancel()">
    <q-form greedy @submit="onSubmit()">
      <q-card-section class="q-pa-sm">
        <q-list>
          <q-item>
            <q-item-section>
              <BaseSelect label="Include users *" :loading="companyUsersStore.isLoading" multiple :options="usersOptions" v-model="users" />
              <div v-if="companyUserTeamsStore.errorCompanyIncludeUsers.users" class="text-caption text-negative">
                {{ companyUserTeamsStore.errorCompanyIncludeUsers.users_msg }}
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn class="text-capitalize bg-primary text-white ase-roboto ase-md" type="submit">Save</q-btn>
      </q-card-actions>
    </q-form>
  </BaseDialog>
</template>

<script>
import BaseSelect from 'components/shared/BaseSelect.vue'

import { useReportStore } from 'src/store/pinia/report'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'
export default {
  name: 'IncludeUsersIntoGroupInfo',
  components: { BaseSelect },
  props: {
    isIncludeGroup: { required: false, default: false },
    id: { required: false }
  },
  setup() {
    const reportStore = useReportStore()
    const companyUserTeamsStore = useCompanyUserTeamsStore()
    const companyUsersStore = useCompanyConsumerStore()
    return {
      reportStore,
      companyUserTeamsStore,
      companyUsersStore
    }
  },
  data() {
    return {
      includeGroup: this.isIncludeGroup,
      users: null,
      usersOptions: []
    }
  },
  created() {
    this.usersOptions = this.companyUserTeamsStore.totalFilteredUsersList.map((user) => ({ label: user.email, value: user.email }))
  },
  watch: {
    users: {
      handler() {
        if (this.users?.length < 0) {
          this.companyUserTeamsStore.errorMsgResetIncludeUsers({ users: true, users_msg: 'Ensure this to select minimum one user to team' })
        } else {
          this.companyUserTeamsStore.errorMsgResetIncludeUsers({ users: false, users_msg: '' })
        }
      }
    }
  },
  methods: {
    async onSubmit() {
      const usersList = this.users.map((email) => ({ email: email.value }))
      const data = {
        users: usersList,
        team_id: this.id
      }
      //await this.isStatus(true)
      await this.companyUserTeamsStore.includeUserIntoTeam(data)
      await this.reportStore.fetchTeamsUsersStats({ team_id: this.id, select: 'overall' })
      const userPayload = this.companyUserTeamsStore.totalFilteredUsersList.filter((ele) => {
        return this.users?.some((user) => user.value === ele.email)
      })
      if (userPayload.length) {
        await this.companyUserTeamsStore.resetListWithAddingOrRemoval(userPayload)
      }
      this.users = null
      if (this.companyUserTeamsStore.errorCompanyIncludeUsers.users) {
        this.$emit('onCacel', { show: false })
      } else {
        this.$emit('onCacel', { show: true })
      }
      if (Object.keys(this.companyUserTeamsStore.user_attach_error_msg).length > 0) {
        this.$emit('showPopup', { show: true })
      } else {
        this.$emit('showPopup', { show: false })
      }
    },
    onCancel() {
      this.companyUserTeamsStore.errorMsgResetIncludeUsers({ users: false, users_msg: '' })
      this.$emit('onCacel', { show: true })
    },
    async paginatedDataInfo() {
      if (this.companyUsersStore.allUserPagination) {
        await this.companyUsersStore.fetchPaginatedCompanyAllUsers({ LastEvaluatedKey: this.companyUsersStore.allUserPagination })
      }
    }
  }
}
</script>

<style scoped></style>
