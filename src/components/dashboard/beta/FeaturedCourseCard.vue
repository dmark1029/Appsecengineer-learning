<template>
  <div class="featured-card full-height basic-shadow row no-wrap q-pa-md bg-white" :class="{ 'bg-dark-1 dark-border': isDark }">
    <div class="image-wrapper">
      <q-img :src="course?.logo" loading="eager" class="feature-banner" />
    </div>
    <div class="q-ml-md q-pr-md details">
      <div class="full-height column items-start justify-start">
        <q-chip clickable :class="[isDark ? 'feature-badge-dark' : 'feature-badge']">
          <span class="avenir-bold" :class="[isDark ? '' : 'text-electric-indigo']">FEATURED COURSE</span>
        </q-chip>
        <h6 class="avenir-bold q-my-sm q-ml-sm">{{ course?.event_name }}</h6>
        <div class="row items-center full-width justify-between wrap q-mb-md q-mt-sm q-ml-sm" style="gap: 0.6rem">
          <div style="min-width: min-content; flex-grow: 1">
            <ChipTab :items="chips" />
          </div>
          <div class="ideal-chip column items-center justify-center" :class="{ 'dark-border  bg-dark-2': isDark }" style="flex-grow: 1">
            <p class="q-mb-none q-px-sm" style="font-size: 0.7rem">
              <span class="avenir-bold q-mr-sm" :class="[isDark ? 'aqua-green-text' : 'text-electric-indigo']">Ideal for:</span>
              {{ idealFor }}
            </p>
          </div>
        </div>
        <p class="text-capitalize q-mt-sm q-ml-sm feature-desc q-mb-auto">
          {{ course?.description }}
        </p>
        <div class="full-width row justify-end items-center">
          <q-btn flat @click="exploreRedirect" class="btn-bittersweet text-capitalize q-mt-md">Explore 1000+ Labs</q-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import ChipTab from 'src/components/common/ChipTab.vue'

import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { getRoundedHour, formatTime } from 'src/utils/module/course'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const $q = useQuasar()
const router = useRouter()

const chips = computed(() => {
  let alarmTime = `${getRoundedHour(props.course?.total_ttl)} Hours`
  if (props.data?.total_ttl < 3600) {
    alarmTime = formatTime(props.course?.total_ttl)
  }
  return [
    {
      img: 'Alarm',
      label: alarmTime
    },
    {
      img: 'Books',
      label: `${props.course?.total_lessons ?? 0} Lessons`
    },
    {
      img: 'RunningLabs',
      label: `${props.course?.labs_count ?? 0} Labs`
    }
  ]
})

const isDark = computed(() => $q.dark.isActive)

const idealFor = computed(() => {
  const value = props.course?.event?.roles?.slice(0, 2)?.join(' / ')
  if (value?.length) return value
  return '--'
})

function exploreRedirect() {
  router.push({ name: 'courses' })
}
</script>
<style lang="scss" scoped>
.featured-card {
  border-radius: 0.8rem;
  min-height: 20rem !important;
  width: 97%;
  .details {
    width: 100%;
  }
  .image-wrapper {
    min-width: 18rem;
    height: 15rem;
    align-self: center;
  }
  @media (min-width: 1600px) {
    max-height: 50rem;
    max-width: 70rem;
  }
  @media (max-width: 1024px) {
    .image-wrapper {
      align-self: unset;
      height: 20rem;
    }
  }
}

.ideal-chip {
  background-color: $light-gray;
  border-radius: 1rem;
  height: 2rem;
}

.feature-desc {
  font-size: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 1434px) {
  .featured-card {
    width: 100% !important;
  }
}
@media (max-width: 1024px) {
  .featured-card {
    flex-direction: column;

    height: min-content !important;
    .details {
      margin-left: 0 !important;
      margin-top: 1rem !important;
    }
  }
}
</style>
<style lang="scss">
.feature-badge {
  background: linear-gradient(90deg, rgba(102, 0, 255, 0.1) 34.33%, rgba(84, 81, 225, 0.1) 87.19%);
}
.feature-badge-dark {
  color: $aqua-green;
  background: #07e6aa1a;
}
.feature-banner {
  height: 100%;
  width: 100%;
  border-radius: 0.6rem;
  @media (max-width: 1024px) {
    max-height: 30rem;
  }
}
</style>
