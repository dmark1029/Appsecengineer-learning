<template>
  <div class="q-gutter-y-md">
    <slot>
      <BaseBtn color="green-12" label="Add users" @click="enableIncludeUser({ show: true })"></BaseBtn>
      <BaseTable
        :columns="columns"
        row-key="email"
        :rows="companyUserTeamsStore.usersListByTeam"
        :rows-per-page-options="[0]"
        virtual-scroll
        style="max-height: calc(100vh - 300px)"
        hide-pagination
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
            <BaseBtn
              color="primary"
              icon="delete"
              @click="deleteUserFromTeam(props.row.email, props.row.teamId, props.row)"
              rounded
              size="sm"
            />
          </q-td>
        </template>
      </BaseTable>
    </slot>
    <Delete
      v-if="isDelete"
      :header="`to remove ${fullNameUser} from the team`"
      :show="isDelete"
      @confirmDelete="teamUserConfirmDeletion($event)"
      @confirmDeleteCancel="teamUserConfirmDeleteCancel($event)"
    />
    <IncludeUsersIntoGroup v-if="isIncludeGroup" :isIncludeGroup="isIncludeGroup" :id="teamIdVal" @onCacel="cancleIncludeUser($event)" />
  </div>
</template>

<script>
import IncludeUsersIntoGroup from 'components/company/IncludeUsersIntoGroup.vue'
import Delete from 'components/shared/Delete.vue'
import { urlSafeBase64Decode, urlSafeBase64Encode } from 'src/utils/reuseFunctions'

import { useReportStore } from 'src/store/pinia/report'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'

export default {
  name: 'CompanyIndividualTeamContent',
  components: { Delete, IncludeUsersIntoGroup },
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
      teamIdVal: urlSafeBase64Decode(this.$route.params.id),
      fullNameUser: '',
      isDelete: false,
      isIncludeGroup: false,
      teamUserId: '',
      userObject: [],
      isActive: []
    }
  },
  methods: {
    enableIncludeUser(event) {
      this.isIncludeGroup = false
      if (event.show) {
        this.isIncludeGroup = true
      }
    },
    cancleIncludeUser(event) {
      if (event.show) {
        this.isIncludeGroup = false
      }
    },
    async getUserInfo(email, username) {
      await this.$router.push(`/portal/company/profile-info/${urlSafeBase64Encode(email)}/${urlSafeBase64Encode(username)}`)
    },
    deleteUserFromTeam(email, teamId, obj) {
      this.fullNameUser = obj.fullName
      this.userObject = [obj]
      this.isDelete = true
      this.teamUserId = {
        user_id: email,
        team_id: urlSafeBase64Decode(this.$route.params.id)
      }
    },
    async teamUserConfirmDeletion(event) {
      if (event.show) {
        //this.isStatus(true)
        await this.companyUserTeamsStore.deleteUserFromCompanyTeam(this.teamUserId)
        await this.companyUserTeamsStore.resetListWithRemoval(this.userObject)
        this.isDelete = false
        await this.reportStore.fetchTeamsUsersStats({ team_id: this.teamUserId.team_id, select: 'overall' })
      }
    },
    teamUserConfirmDeleteCancel(event) {
      if (event.show) {
        this.isDelete = false
        this.teamUserId = {}
      }
    },
    loadMoreUsers() {
      const data = {
        LastEvaluatedKey: this.companyUserTeamsStore.paginatedTeamUsers,
        team_id: this.companyUserTeamsStore.usersListByTeam[0].teamId
      }
      //this.isStatus(true)
      this.companyUserTeamsStore.paginatedUsersByTeam(data)
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
          field: 'fullName'
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
          field: 'isActive'
        }
      ]
    }
  }
}
</script>
