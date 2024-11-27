<template>
  <q-toolbar
    class="bg-white q-pa-md q-pl-lg navbar"
    :class="{ 'dark-border': isDark, 'no-pointer-events': userActivity.isActivityDisabled }"
    :style="{ opacity: userActivity.isActivityDisabled ? '.7' : '1' }"
  >
    <!-- <q-input
      v-show="true"
      dense
      placeholder="Search to find a course"
      lazy-rules
      outlined
      class="nav-search q-mx-lg"
      :class="[isDark ? 'bg-dark-1' : 'bg-grey-12']"
    >
      <template #prepend>
        <q-icon name="search" class="q-mt-sm" color="grey" />
      </template>
    </q-input> -->

    <q-space />

    <div class="row no-wrap q-mr-md q-ml-xl" style="gap: 0.2rem">
      <BaseBtn
        :color="isDark ? 'white' : 'primary'"
        dense
        flat
        icon="light_mode"
        square
        @click="toggleDarkMode"
        aria-label="Change Theme"
      />
      <BaseBtn
        clickable
        :color="isDark ? 'white' : 'primary'"
        dense
        flat
        icon="groups"
        square
        aria-label="Community"
        href="https://discord.gg/WMFskdAgM7"
        target="_blank"
        class="q-mx-xs"
      >
        <q-tooltip>Community</q-tooltip>
      </BaseBtn>
      <BaseBtn
        clickable
        :color="isDark ? 'white' : 'primary'"
        dense
        flat
        square
        :to="{ name: 'favorite' }"
        size="12px"
        aria-label="Favorite courses"
      >
        <q-tooltip>Favorite</q-tooltip>
        <q-img src="/newIcons/wishlist_filled.png" width="26px" />
      </BaseBtn>
      <BaseBtn
        clickable
        :color="isDark ? 'white' : 'primary'"
        dense
        flat
        square
        :to="{ name: 'notifications' }"
        aria-label="All notifications"
      >
        <q-img :src="`/newIcons/${unreadNotification ? 'notification_pending' : 'notification'}.png`" width="26px" />
      </BaseBtn>
    </div>
    <q-separator vertical color="iron" />
    <UserDropdown class="q-ml-sm" />
  </q-toolbar>
</template>

<script setup>
import { responseFromCommunity } from 'app/functions/response'
import jwt_decode from 'jwt-decode'
import { LocalStorage, useQuasar } from 'quasar'

import { computed } from 'vue'

import { useAssessmentStore } from 'src/store/pinia/assessments/assessments'
import { useCourseWishlist } from 'src/store/pinia/course/wishlist'
import { useLoginStore } from 'src/store/pinia/login'
import { useNotificationStore } from 'src/store/pinia/notifications'
import { useUserActivity } from 'src/store/pinia/userActivity'

import UserDropdown from './UserDropdown.vue'

const $q = useQuasar()

const loginStore = useLoginStore()
const notificationStore = useNotificationStore()
const wishlistStore = useCourseWishlist()
const userActivity = useUserActivity()

const fetchUserInfo = computed(() => loginStore.fetchUserInfo)

const unreadNotification = computed(() => notificationStore.unreadCountNotifications)

if (LocalStorage.getItem('darkMode')) {
  $q.dark.set(true)
}

async function communityLink() {
  if (fetchUserInfo.value.email) {
    const token = LocalStorage.getItem('token')
    const decodedData = jwt_decode(token)
    const tempPayload = {
      email: fetchUserInfo.value.email,
      name: fetchUserInfo.value.firstName,
      last_name: fetchUserInfo.value.lastName,
      id: decodedData.sub
    }
    await responseFromCommunity(tempPayload)
  }
}

function toggleDarkMode() {
  $q.dark.toggle()
  LocalStorage.set('darkMode', $q.dark.mode)
}

const isDark = computed(() => $q.dark.isActive)
</script>

<style lang="scss">
.navbar {
  height: 80px;
  max-height: 80px;
  border-bottom: 1px solid $iron;
  .nav-search {
    width: 100% !important;
    border-radius: 10px;
    .q-field__control {
      overflow: hidden;
      border-radius: 10px !important;
      height: 3rem !important;
      &::before {
        border: 1px solid $iron;
      }
    }
  }
  &.dark-border {
    .nav-search {
      .q-field__control {
        &::before {
          border: 1px solid #cdcdda33 !important;
        }
      }
    }
  }
}
.q-layout__section--marginal {
  background: transparent;
}
</style>
