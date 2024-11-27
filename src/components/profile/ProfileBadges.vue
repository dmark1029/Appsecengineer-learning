<template>
  <section>
    <h5 class="q-my-sm q-mx-md">Achievements</h5>
    <div class="flex">
      <div class="flex q-pa-sm q-mx-md">
        <q-icon class="bg-grey-12 q-pa-sm" name="menu_book" size="35px" />
        <div>
          <h5 class="q-my-none q-ml-md text-weight-bold">{{ profileDetailedInfo.completed_events || 0 }}</h5>
          <p class="q-ml-md">Courses Completed</p>
        </div>
      </div>
      <div class="flex q-pa-sm q-mx-md">
        <q-icon class="bg-grey-12 q-pa-sm" name="library_books" size="35px" />
        <div>
          <h5 class="q-my-none q-ml-md text-weight-bold">{{ profileDetailedInfo.completed_lessons || 0 }}</h5>
          <p class="q-ml-md">No of lessons</p>
        </div>
      </div>
      <div class="flex q-pa-sm q-mx-md">
        <q-icon class="bg-grey-12 q-pa-sm" name="schedule" size="35px" />
        <div>
          <h5 class="q-my-none q-ml-md text-weight-bold">
            {{ Math.round(dashboardStatistics.month_course_minutes / day) || 'Less than 1 minute' }}
          </h5>
          <p class="q-ml-md">Average Time Spent (minutes)</p>
        </div>
      </div>
    </div>
  </section>
  <q-tabs active-color="bg-grey-12" align="left" class="q-mt-md" indicator-color="bg-grey-12" v-model="tab">
    <q-tab label="Medals" name="medals" />
    <q-tab label="Certificates" name="certificates" />
    <q-tab label="Badges" name="badges" />
  </q-tabs>

  <q-tab-panels animated v-model="tab">
    <q-tab-panel class="no-border" name="medals">
      <p class="q-mb-none text-subtitle1">Here are a list of some of your medals so far!</p>
      <p class="text-subtitle2">Keep learning to earn more medals</p>
      <Medals />
    </q-tab-panel>

    <q-tab-panel class="no-border" name="badges">
      <p class="q-mb-none text-subtitle1">Here are a list of some of your badges so far!</p>
      <p class="text-subtitle2">Keep learning to earn more badges</p>
      <Badges />
    </q-tab-panel>

    <q-tab-panel class="no-border" name="certificates">
      <p class="q-mb-none text-subtitle1">Here are a list of some of your certificates so far!</p>
      <p class="text-subtitle2">Keep learning to earn more certificates</p>
      <Certificates />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import Badges from 'components/profile/achievements/Badges.vue'
import Certificates from 'components/profile/achievements/Certificates.vue'
import Medals from 'components/profile/achievements/Medals.vue'
import { useDashboardStore } from 'src/store/pinia/dashboard'
import { computed, onMounted, ref } from 'vue'

import { useProfileStore } from 'src/store/pinia/profile'

const dashboardStore = useDashboardStore()
const profileStore = useProfileStore()

const tab = ref('medals')

const date = new Date()
const day = date.getDate()

const profileDetailedInfo = computed(() => profileStore.profileDetailedInfo)
const dashboardStatistics = computed(() => dashboardStore.dashboardStatistics)

onMounted(async () => {
  await profileStore.fetchProfileDetailedInformation()
  await dashboardStore.fetchDashboardStatistics({})
})
</script>
