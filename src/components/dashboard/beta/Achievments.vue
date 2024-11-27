<template>
  <div
    class="achievment-card relative-position basic-shadow row full-width justify-start full-height q-pt-sm q-pb-md overflow-hidden"
    :class="{ 'bg-dark-1 dark-border': isDark }"
  >
    <q-img src="/curveline.png" class="absolute-full" />
    <div class="row items-center full-width justify-between no-wrap q-pr-md" style="height: min-content; z-index: 2">
      <h6 class="avenir-bold q-my-sm q-ml-sm text-white">My Achievements</h6>
      <q-btn class="seeAllBtn relative-position q-px-none" flat>
        <h6 class="q-my-none avenir-bold" @click="$router.push({ path: '/portal/profile/achievements' })">SEE ALL</h6>
        <q-icon name="arrow_forward_ios" size=".9rem" class="q-ml-sm showIcon" />
      </q-btn>
    </div>
    <div class="row q-mt-lg q-px-md justify-between full-width" style="gap: 0.5rem; z-index: 2">
      <template v-if="dashboardStore.dashboardStatisticsLoading">
        <template v-for="item in Array(6)" :key="item">
          <StatsItemSkeleton />
        </template>
      </template>
      <template v-else v-for="(statsItem, index) in statistics" :key="index">
        <div class="col-12 col-sm-6 ach-sections row items-center q-px-sm q-py-sm no-wrap" :class="{ 'bg-night-blue': isDark }">
          <div
            class="ach-badge row items-center justify-center font-paytone q-mr-sm"
            :class="{ 'bg-indigo-gradiant': isDark }"
            :style="{
              fontSize: getFontSize(statsItem.value)
            }"
          >
            <span :class="[isDark ? 'text-white' : 'text-electric-indigo']">{{ statsItem.value }}</span>
          </div>
          <p class="text-capitalize q-mb-none" style="font-size: 1rem">{{ statsItem.label }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useDashboardStore } from 'src/store/pinia/dashboard'
import { useQuasar } from 'quasar'
import { computed, onBeforeMount } from 'vue'

import StatsItemSkeleton from 'components/skeleton/StatsItemSkeleton.vue'

const $q = useQuasar()

const isDark = computed(() => $q.dark.isActive)

const dashboardStore = useDashboardStore()

onBeforeMount(async () => {
  if (Object.keys(dashboardStore.dashboardStatistics).length) return
  await dashboardStore.fetchDashboardStatistics({})
})

function getTotalTime(times) {
  if(!times) return 0
  if(times <60) return times

  const timeInHr = Math.ceil(times / 60)
  return timeInHr

}

const statistics = computed(() => {
  return [
    {
      label: 'Badges',
      value: dashboardStore.dashboardStatistics?.badges || 0
    },
    {
      label: 'Enrolled Courses',
      value: dashboardStore.dashboardStatistics?.total_enrolled || 0
    },
    {
      label: 'Completed Challenges',
      value: dashboardStore.dashboardStatistics?.challenges_completed || 0
    },
    {
      label: `Total ${dashboardStore.dashboardStatistics?.total_course_minutes <= 60 ? 'Minutes' : 'hours'} Spent`,
      value: getTotalTime(dashboardStore.dashboardStatistics?.total_course_minutes) || 0
    },
    {
      label: 'Completed Labs',
      value: dashboardStore.dashboardStatistics?.labs_completed || 0
    },
    {
      label: 'Completed Videos',
      value: dashboardStore.dashboardStatistics?.videos_completed || 0
    }
  ]
})

function getFontSize(value) {
  const length = String(value ?? '').length
  if (length === 2) return '1.6rem'
  if (length === 3) return '1.4rem'
  if (length === 4) return '1rem'
  return '2rem'
}
</script>

<style lang="scss" scoped>
.achievment-card {
  background-color: $night-blue;
  border-radius: 0.8rem;
  height: 20rem !important;
  @media (min-width: 1600px) {
    max-width: 60rem;
  }
}

.ach-sections {
  background: #ffffffb2;
  border-radius: 1rem;
  max-width: 48%;
  .ach-badge {
    background: #ffffff;
    font-size: 2rem;
    min-height: 3rem;
    min-width: 3rem;
    clip-path: circle();
  }
}

@media (max-width: 1434px) {
  .achievment-card {
    margin-top: 2rem;
  }
}
@media (max-width: 620px) {
  .ach-sections {
    max-width: 100%;
  }
}
</style>
<style lang="scss">
.seeAllBtn {
  h6 {
    font-size: 1rem !important;
    color: $aqua-green;
  }
  .showIcon {
    color: $aqua-green;
  }
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: $aqua-green;
    bottom: 0;
  }
}
</style>
