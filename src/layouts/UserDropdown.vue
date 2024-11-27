<template>
  <q-btn-dropdown
    no-caps
    class="shadow-0 q-mr-sm"
    flat
    dropdown-icon="keyboard_arrow_down"
    :color="$q.dark.isActive ? 'white' : 'night-blue'"
  >
    <template #label>
      <div v-if="fetchUserInfo" class="q-gutter-x-lg text-center">
        <q-avatar v-if="fetchUserInfo.picture" class="image" :class="!fetchUserInfo.picture ? 'bg-primary' : ''" size="25px">
          <img :src="fetchUserInfo.picture" style="object-fit: cover; height: 100%; width: 100%" alt="x" />
        </q-avatar>
        <q-avatar v-else class="bg-primary" size="25px">
          <div class="text-white">{{ fetchUserInfo.firstName?.charAt(0) }}</div>
        </q-avatar>
        &nbsp;My Account
      </div>
    </template>
    <div class="q-pa-none my-account-dropdown">
      <div v-if="fetchUserInfo" class="flex q-pa-sm">
        <q-avatar size="4rem" :class="!fetchUserInfo?.picture ? 'bg-primary' : ''">
          <img v-if="fetchUserInfo.picture" :src="fetchUserInfo.picture" style="object-fit: cover" />
          <div v-else class="text-white">{{ fetchUserInfo.firstName?.charAt(0) }}</div>
        </q-avatar>

        <div class="q-pa-sm">
          <div class="text-h6">{{ fetchUserInfo.firstName }}</div>
          <div>{{ fetchUserInfo.email }}</div>
        </div>
      </div>

      <q-separator color="black" />

      <div class="column">
        <q-list style="min-width: 100px" class="user-dropdown" size="sm">
          <q-item clickable :to="{ name: 'profile' }">
            <q-item-section side>
              <q-icon size="xs" name="perm_identity" />
            </q-item-section>
            <q-item-section>My Profile</q-item-section>
          </q-item>
          <q-item clickable @click="subscriptionPage()">
            <q-item-section side>
              <q-icon size="xs" name="subscriptions" />
            </q-item-section>
            <q-item-section>My Subscription</q-item-section>
          </q-item>

          <q-item v-if="parentUser || !isCompanyAdmin || isUserType === 'FT' || isUserType === 'IND'" clickable :to="{ name: 'upgrade' }">
            <q-item-section side>
              <q-icon size="xs" name="upgrade" />
            </q-item-section>
            <q-item-section>Upgrade</q-item-section>
          </q-item>

          <q-item clickable @click="logout()">
            <q-item-section side>
              <q-icon size="xs" name="logout" />
            </q-item-section>
            <q-item-section @click="logout()">Logout</q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-btn-dropdown>
</template>

<script setup>
import { LocalStorage } from 'quasar'
import { useLoginStore } from 'src/store/pinia/login'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useProfileStore } from 'src/store/pinia/profile'

const loginStore = useLoginStore()
const router = useRouter()

const profileStore = useProfileStore()

const fetchUserInfo = computed(() => loginStore.fetchUserInfo)
const isCompanyAdmin = computed(() => loginStore.isCompanyAdmin)
const isUserType = computed(() => loginStore.isUserType)
const parentUser = computed(() => loginStore.parentUser)

function logout() {
  localStorage.clear()
  LocalStorage.remove('startTime')
  LocalStorage.remove('expTime')
  LocalStorage.remove('isOwasp')
  LocalStorage.remove('token')
  LocalStorage.remove('rtoken')
  LocalStorage.remove('user')
  LocalStorage.remove('provisionInfo')
  LocalStorage.remove('is_admin')
  LocalStorage.remove('trial')
  LocalStorage.remove('EXPIRED_TIME')
  LocalStorage.remove('userId')
  LocalStorage.remove('sub_')
  router.push('/')
}

async function subscriptionPage() {
  await profileStore.fetchUserBillingInfo()

  if (Object.keys(profileStore.paymentSubscriptionInfo).length > 0) {
    const url = profileStore.paymentSubscriptionInfo.profile_url
    window.open(url, '_blank')
  }
}
</script>
<style lang="scss" scoped>
.user-dropdown {
  :deep(.q-item) {
    min-height: 0;
  }
}
.my-account-dropdown {
  min-height: auto;
}
</style>
