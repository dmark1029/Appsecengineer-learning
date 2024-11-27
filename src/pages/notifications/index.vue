<template>
  <section class="viewPages q-my-lg column q-gutter-y-md ase-roboto">
    <div class="header row justify-between">
      <q-btn-group push>
        <q-btn
          push
          label="Inbox"
          @click="setStatus(undefined)"
          :color="notificationStore.query.filter_status !== 'unread' ? 'primary' : undefined"
        />
        <q-btn
          push
          label="UNREAD"
          @click="setStatus('unread')"
          :color="notificationStore.query.filter_status === 'unread' ? 'primary' : undefined"
        />
      </q-btn-group>
      <q-btn
        label="MARK ALL READ"
        color="secondary"
        @click="
          statusUpdate({
            readall: true
          })
        "
        flat
        icon="done_all"
        :loading="notificationStore.statusLoading"
      />
    </div>
    <BaseTable
      flat
      bordered
      :rows="notificationStore.notifications"
      :columns="columns"
      :rows-per-page-options="[0]"
      style="max-height: calc(100vh - 100px)"
      @row-click="redirectTo"
      hide-header
      hide-bottom
      selection="multiple"
      row-key="notificationContent.id"
      v-model:selected="selected"
    >
      <template v-slot:body-selection="scope">
        <q-icon name="adjust" color="red" size="25px" v-if="scope.row.status === 'unread'" />
        <div v-else>
          <q-icon
            name="mark_as_unread"
            size="25px"
            @click.stop="
              statusUpdate({
                row: scope.row,
                status: 'unread'
              })
            "
          />

          <q-tooltip size="large">Mark as Unread</q-tooltip>
        </div>
      </template>
      <template #body-cell-name="props">
        <q-td class="text-body-1">
          <div class="text-link">{{ props.value?.title }}</div>
          {{ props.value?.content }}
        </q-td>
      </template>
    </BaseTable>
    <div v-if="!notificationStore.notifications.length" class="row justify-center text-subtitle1 text-red">No notifications available</div>
    <div class="row justify-end">
      <q-btn v-if="notificationStore.query?.page_number" color="primary" @click="fetchNotifications">Load More</q-btn>
    </div>
  </section>
</template>

<script>
import { ref, onUnmounted } from 'vue'
import { useNotificationStore } from 'src/store/pinia/notifications'
import { date, useQuasar } from 'quasar'
import { since } from 'src/utils/dateHelper'

const selectNotification = ref(false)
const columns = [
  {
    name: 'name',
    required: true,
    label: '',
    align: 'left',
    field: 'notificationContent'
  },
  {
    name: 'name',
    required: true,
    label: '',
    align: 'left',
    field: (row) => row.name
  },
  {
    name: 'author',
    required: true,
    label: '',
    align: 'left',
    field: (row) => row?.category
  },
  {
    name: 'createdAt',
    required: true,
    label: '',
    align: 'left',
    field: (row) => {
      return since(row?.createdDate)
    }
  }
]

export default {
  setup() {
    const notificationStore = useNotificationStore()
    const selectedButton = ref('all')
    const $q = useQuasar()
    notificationStore.query.page_number = 1
    fetchNotifications()

    notificationStore.unreadCountNotifications = 0
    async function fetchNotifications() {
      $q.loading.show({
        message: 'Loading'
      })
      const payload = {
        email: notificationStore.user.email
      }
      await notificationStore.fetchNotifications({ payload })
      $q.loading.hide()
    }
    // readNotifications()
    async function setStatus(status = undefined) {
      notificationStore.notifications = []
      notificationStore.query.filter_status = status
      notificationStore.query.page_number = 1
      await fetchNotifications()
    }

    async function statusUpdate({ row = undefined, readall = undefined, status = 'read' }) {
      notificationStore.unreadCountNotifications = 0
      const payload = {
        id: row?._KEY ?? undefined,
        status,
        readall: readall ?? undefined,
        email: readall ? notificationStore.user.email : undefined
      }
      const data = await notificationStore.changeSingleStatus({ payload })
      if (data.success) {
        row.status = status
      }
    }

    async function redirectTo(evt, row) {
      if (row.status !== 'read') {
        await statusUpdate({ row })
        row.status = 'read'
      }
      if (row.notificationContent?.link) {
        // Open the link in a new tab
        window.open(row.notificationContent?.link, '_blank')
      }
    }

    async function markAllRead() {}
    onUnmounted(() => {
      notificationStore.notifications = []
    })
    return {
      selected: ref([]),
      columns,
      notificationStore,
      fetchNotifications,
      selectNotification,
      statusUpdate,
      selectedButton,
      redirectTo,
      markAllRead,
      setStatus
    }
  }
}
</script>

<style lang="scss" scoped></style>
