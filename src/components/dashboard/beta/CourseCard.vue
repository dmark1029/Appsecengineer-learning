<template>
  <div class="full-height card-wrapper q-mx-xs">
    <div
      class="course-card full-height basic-shadow column items-start justify-start full-width q-pa-md relative-position"
      :class="[isDark ? 'bg-dark-1 dark-border' : 'bg-white', smallerText ? 'smaller' : '']"
    >
      <div v-if="data?.is_new_launched" class="new-icon absolute bg-night-blue avenir-bold row items-center justify-start q-pl-sm">NEW</div>
      <WishlistAction :event="data" v-bind="$attrs" />
      <div class="row items-start justify-start q-mb-md" :style="{ flexGrow: 1 }">
        <h6 class="avenir-bold q-ma-none">{{ data.event_name }}</h6>
      </div>
      <ChipTab :items="challengeMode ? dummyChallengeChips : chips" smallerText />
      <q-img class="banner-img q-my-md" v-if="data.logo" :src="data.logo" height="auto" fit="fill" />
      <div
        v-if="!challengeMode"
        class="ideal-chip full-width column items-center justify-center"
        :class="{ 'bg-dark-3 dark-border': isDark }"
      >
        <p class="q-mb-none q-px-sm" style="font-size: 0.7rem">
          <span
            v-if="!challengeMode"
            class="avenir-bold q-mr-sm"
            color="aqua-green"
            :class="[isDark ? 'text-aqua-green' : 'text-electric-indigo']"
          >
            Ideal for:
          </span>
          {{ idealFor }}
        </p>
      </div>

      <div class="row no-wrap items-center full-width justify-center q-my-sm q-px-sm">
        <q-linear-progress
          size="sm"
          track-color="#cdcdda33"
          rounded
          :value="data.progress / 100"
          animation-speed
          aria-label="Course progress"
          class="course-progress"
        />
        <span class="text-caption q-ml-md">{{ data.progress }}%</span>
      </div>

      <q-btn
        :loading="loading"
        :disable="loading"
        @click="moveToCourseInfo(data)"
        flat
        class="btn-bittersweet text-capitalize full-width"
        :class="{ 'btn-disabled': disabled }"
      >
        {{ data.is_enrolled ? 'Continue Learning' : 'Start' }}
      </q-btn>
    </div>
    <CourseTooltip :data="data" v-if="data && data.instructors" />
  </div>
</template>

<script setup>
import CourseTooltip from 'src/components/course/common/CourseTooltip.vue'
import WishlistAction from 'src/components/course/WishlistAction.vue'
import { computed, ref } from 'vue'
import ChipTab from 'src/components/common/ChipTab.vue'
import { useQuasar } from 'quasar'
import { formatTime, getRoundedHour } from 'src/utils/module/course'

const emit = defineEmits(['moveToCourseInfo'])

const $q = useQuasar()

const isDark = computed(() => $q.dark.isActive)

async function moveToCourseInfo(data) {
  emit('moveToCourseInfo', { info: data })
}

const props = defineProps({
  data: { required: true, type: Object },
  loading: {
    type: Boolean,
    default: false
  },
  challengeMode: {
    type: Boolean,
    default: () => false
  },
  smallerText: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const chips = computed(() => {
  let alarmTime = `${getRoundedHour(props.data?.total_ttl)} Hours`
  if (props.data?.total_ttl < 3600) {
    alarmTime = formatTime(props.data?.total_ttl)
  }
  return [
    {
      img: 'Alarm',
      label: alarmTime
    },
    {
      img: 'Books',
      label: `${props.data?.total_lessons ?? 0} Lessons`
    },
    {
      img: 'RunningLabs',
      label: `${props.data?.labs_count ?? 0} Labs`
    }
  ]
})

const dummyChallengeChips = ref([
  {
    img: 'Questions',
    label: '1 Questions'
  }
])

const idealFor = computed(() => {
  const value = props.data?.event?.roles?.slice(0, 2)?.join(' / ')
  if (value?.length) return value
  return '--'
})
</script>

<style lang="scss" scoped>
.card-wrapper {
  min-height: min-content !important;

  .course-card {
    border-radius: 1rem;
    .banner-img {
      border-bottom-left-radius: 1.1rem !important;
      border-bottom-right-radius: 1.1rem;
    }
    .new-icon {
      width: 51px;
      height: 30px;
      left: -3px;
      border-top-right-radius: 100px;
      border-bottom-right-radius: 100px;
      top: 46%;
      z-index: 1;
      color: #ffffff;
    }
    &.smaller {
      h6 {
        font-size: 1rem;
      }
      .ideal-chip {
        p {
          font-size: 11px !important;
          span {
            font-size: 9px;
          }
        }
      }
    }
  }
}

.ideal-chip {
  background-color: $light-gray;
  border-radius: 1rem;
  height: 2rem;
}
</style>

<style lang="scss">
.course-progress {
  height: 6px;
  border-radius: 6px;
  .q-linear-progress__model {
    background-color: #00da9f;
  }
}
</style>
