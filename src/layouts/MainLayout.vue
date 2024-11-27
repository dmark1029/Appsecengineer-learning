<template>
  <q-layout view="lHh Lpr lff" class="relative-position" :class="{ blur_data: confirm }">
    <q-linear-progress
      v-if="loader.isLoading"
      :indeterminate="loader.isLoading"
      trackColor="white"
      color="primary"
      class="absolute full-width"
      style="z-index: 9999"
    />
    <q-header elevated class="text-black">
      <div class="row justify-between flex-center">
        <MainNavbar />
        <div class="q-mini-drawer-hide absolute nav-arrow">
          <q-btn
            class="text-black shadow-deep"
            :class="[$q.dark.isActive ? 'bg-dark-4' : 'bg-white']"
            color="#9291a9"
            dense
            :icon="showMainSidebar ? 'chevron_left' : 'chevron_right'"
            rounded
            unelevated
            @click="toggleMiniMode"
            aria-label="Sidebar mini mode controller"
          />
        </div>
      </div>
    </q-header>
    <LayoutSidebar :showMainSidebar="showMainSidebar" />
    <q-page-container>
      <q-page style="height: max-content">
        <BreadCrumbIndex class="q-mb-lg" />
        <router-view />
      </q-page>
    </q-page-container>
    <q-footer class="row justify-between q-px-lg footer q-my-md bg-transparent" :class="$q.dark.mode ? 'text-white' : 'text-black'">
      <div class="text-subtitle1">
        AppSecEngineer
        <span>&#169;</span>
        {{ getCurentYear() }}
      </div>
      <a
        :class="$q.dark.mode ? 'text-white' : 'text-black'"
        href="https://www.appsecengineer.com/privacy-policy"
        style="text-decoration: none"
        target="_blank"
      >
        Privacy Policy
      </a>
    </q-footer>
  </q-layout>
</template>

<script setup>
import BreadCrumbIndex from 'components/breadcrumb/BreadCrumbIndex.vue'
import { LocalStorage, useQuasar } from 'quasar'
import { getCurentYear } from 'src/utils/helpers'
import { ref } from 'vue'
import LayoutSidebar from './LayoutSidebar.vue'
import MainNavbar from './MainNavbar.vue'
import { useCourseWishlist } from 'src/store/pinia/course/wishlist'
import { useAssessmentStore } from 'src/store/pinia/assessments/assessments'
import { useGlobalLoaderStore } from 'src/store/pinia/loader'

const courseWishList = useCourseWishlist()
const assessmentStore = useAssessmentStore()
const loader = useGlobalLoaderStore()

assessmentStore.fetchAssessments()
courseWishList.fetchWishlist()

const $q = useQuasar()
const showMainSidebar = ref(true)
const confirm = ref(LocalStorage.getItem('verify') === 'FORCE')

function toggleMiniMode() {
  showMainSidebar.value = !showMainSidebar.value
}
</script>

<style lang="scss" scoped>
.blur_data {
  filter: saturate(10%);
  color: rgb(158, 157, 157) !important;
}
</style>
