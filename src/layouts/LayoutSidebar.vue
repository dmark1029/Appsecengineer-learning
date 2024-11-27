<template>
  <q-drawer show-if-above :mini="!showMainSidebar" :width="290" :miniWidth="90" :breakpoint="500">
    <template v-slot:mini>
      <q-scroll-area
        class="fit mini-slot sidebar_wrapper full-width"
        :class="{ 'dark-mode': $q.dark.isActive, 'no-pointer-events': userActivity.isActivityDisabled }"
        :style="{
          opacity: userActivity.isActivityDisabled ? '.6' : '1'
        }"
      >
        <div class="column items-center justify-start" role="menu" aria-label="Sidebar mini menu">
          <div class="bg-transparent full-width logo_wrapper flex items-center justify-center q-mb-lg">
            <q-avatar size="46px">
              <q-img :src="$q.dark.isActive ? '/favicon_dark.svg' : '/favicon.svg'" />
            </q-avatar>
          </div>
          <SidebarMiniItem v-for="(item, index) in miniSidebarItems" :key="index" :item="item">
            <template #template-sidebar-mini-user_name>
              <q-avatar size="40px" class="text-weight-bold ase-roboto" color="white" text-color="black">
                {{ fetchUserInfo.firstName[0] }}
              </q-avatar>
            </template>
          </SidebarMiniItem>
        </div>
      </q-scroll-area>
    </template>
    <q-scroll-area
      class="fit sidebar_wrapper"
      :class="{ 'dark-mode': $q.dark.isActive, 'no-pointer-events': userActivity.isActivityDisabled }"
      :style="{
        opacity: userActivity.isActivityDisabled ? '.6' : '1'
      }"
    >
      <div class="q-pt-sm q-pl-lg logo_wrapper flex align-center justify-start">
        <q-img :src="$q.dark.isActive ? '/appsec_logo_dark.svg' : '/appsec_logo_light.svg'" width="138px" fit="fill" class="logo" />
      </div>
      <q-list class="s-list q-py-md q-my-md" role="menu" aria-label="Sidebar menu">
        <SidebarItem v-for="(item, index) in fullViewSidebarItems" :key="index" :item="item">
          <template #template-sidebar-admin>
            <q-separator style="margin: 1rem 0rem" />
            <AdminItem :adminItems="adminItems" />
          </template>
        </SidebarItem>
      </q-list>
      <div
        v-if="!isCompanyAdmin && isUserType === 'FT'"
        class="cursor-pointer q-pa-md"
        style="background: linear-gradient(-90deg, #42c7b9 0%, #4997c9 100%)"
      >
        <q-img src="~assets/upgradeLatest.png" @click="$router.push('/portal/upgrade')" />
      </div>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import AdminItem from './AdminItem.vue'
import SidebarItem from './SidebarItem.vue'
import SidebarMiniItem from './SidebarMiniItem.vue'

import { useProfileStore } from 'src/store/pinia/profile'
import { useConfirmUser } from 'src/store/pinia/confirmUser'
import { useUserActivity } from 'src/store/pinia/userActivity'
import { useLoginStore } from 'src/store/pinia/login'

import { computed, onBeforeMount, shallowRef, ref, watch } from 'vue'

import { useRoute } from 'vue-router'
import { LocalStorage, QSpinnerFacebook, useQuasar } from 'quasar'

const sidebarItems = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    icon: 'app:dashboard',
    route: 'dashboard',
    img: 'Dashboard'
  },
  {
    name: 'courses',
    label: 'Courses',
    icon: 'app:course',
    route: 'courses',
    img: 'Courses'
  },
  {
    name: 'live-courses',
    label: 'Live Events',
    icon: 'app:live-event',
    route: 'live-courses',
    img: 'LiveEvents'
  },
  {
    name: 'challenges',
    label: 'Challenges',
    icon: 'app:challenge',
    route: 'challenges',
    img: 'Challenges'
  },
  {
    name: 'assessments',
    label: 'My Assignments',
    icon: 'book',
    route: 'assignments',
    img: 'MyAssignments'
  },
  {
    name: 'journeys',
    label: 'Journeys',
    icon: 'book',
    route: 'journeys',
    img: 'Journeys'
  },
  {
    name: 'playgrounds',
    label: 'Playgrounds',
    icon: 'app:playground',
    route: 'playgrounds',
    img: 'Playgrounds'
  },
  {
    name: 'running_labs',
    label: 'Running Labs',
    icon: 'app:running-lab',
    route: 'runninglabs',
    img: 'RunningLabs'
  }
]

const adminItems = [
  {
    name: 'company_usersops',
    label: 'Users',
    route: 'company.users_ops',
    icon: 'app:users',
    img: 'Users'
  },
  {
    name: 'company_teams',
    label: 'Teams',
    route: 'company.teamsops',
    icon: 'app:teams',
    img: 'Teams'
  },
  {
    name: 'custom-challenge',
    label: 'Build your challenge',
    icon: 'img:/icons/sidebar_aiquiz.svg',
    route: 'custom-challenge',
    img: 'OwnChallenge'
  },
  {
    name: 'company_reports',
    label: 'Reports',
    route: 'company.report',
    icon: 'app:reports',
    img: 'Reports'
  },
  {
    name: 'company.assignments.tests',
    label: 'Assessments',
    route: 'company.assignments.tests',
    icon: 'app:tests',
    img: 'Interviews'
  },
  {
    name: 'company.course_assignments.course',
    label: 'Course Assignments',
    route: 'company.course_assignments.course',
    icon: 'app:assignments',
    img: 'CourseAssignments'
  },
  {
    name: 'administrator',
    label: 'Administrators',
    route: 'company.admins',
    icon: 'app:administrators',
    img: 'Administrators'
  },
  {
    name: 'company-settings',
    label: 'About',
    route: 'company.settings',
    icon: 'app:about',
    img: 'About'
  }
]

defineProps({
  showMainSidebar: {
    type: Boolean,
    required: true
  }
})

const route = useRoute()
const $q = useQuasar()

const code = shallowRef('')
const confirm = shallowRef(LocalStorage.getItem('verify') === 'FORCE')
const showBannerLabel = shallowRef(true)
const showSidebar = shallowRef(false)
const pathName = shallowRef('')

const loginStore = useLoginStore()
const profileStore = useProfileStore()
const confirmUser = useConfirmUser()
const userActivity = useUserActivity()

onBeforeMount(async () => {
  pathName.value = location.pathname

  showSidebar.value = Boolean(route.path.startsWith('/portal/company/'))

  if (!LocalStorage.getItem('EXPIRED_TIME')) {
    await profileStore.fetchProfileDetailedInformation()
  }
})

watch(
  () => route.path,
  (newValue) => {
    const url = newValue
    pathName.value = location.pathname
    if (url.startsWith('/portal/company/') || url.startsWith('portal/courses/table')) {
      showSidebar.value = true
    } else {
      showSidebar.value = false
    }
  }
)

const fetchUserInfo = computed(() => loginStore.fetchUserInfo)
const isCompanyAdmin = computed(() => loginStore.isCompanyAdmin)
const isUserType = computed(() => loginStore.isUserType)
const verifyUserType = computed(() => loginStore.verifyUserType)

const fullViewSidebarItems = computed(() => {
  const items = sidebarItems
  return !isCompanyAdmin.value ? items : [...items, { name: 'admin' }]
})

const miniSidebarItems = computed(() => {
  return !isCompanyAdmin.value ? sidebarItems : [...sidebarItems, ...adminItems]
})

watch(verifyUserType, () => {
  if (verifyUserType.value === 'FORCE') {
    confirm.value = true
  } else if (verifyUserType.value === 'OPTIONAL') {
    showBannerLabel.value = true
  }
})

watch(code, () => {
  const err_msgs = {}
  err_msgs.code = false
  err_msgs.code_msg = ''
  confirmUser.errorMsgResetVerificationFixed(err_msgs)
})
</script>

<style lang="sass">
.bg-custom-orange
  background: #F1592A

.color-custom-orange
  color: #F1592A

.radius-style
  border-radius: 0px 5px 5px 0px

.radius-style-full
  border-radius: 5px 5px 5px 5px

.padding-percentage
  padding: 2%

.my-menu-link
  color: #2B2D7D
  background: #FFFFFF

.blur_data
  filter: saturate(10%)
  color: rgb(158, 157, 157)!important

.sidebar_wrapper
  border-right: 1px solid $iron
  .logo_wrapper
    height: 80px
    border-bottom: 1px solid $iron
  &.dark-mode
    border-right: 1px solid #cdcdda33
    .logo_wrapper
      border-bottom: 1px solid #cdcdda33
</style>
