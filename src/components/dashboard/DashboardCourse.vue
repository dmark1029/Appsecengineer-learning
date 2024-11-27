<template>
  <div class="q-px-sm q-py-lg course-section-wrapper">
    <h5 class="font-paytone q-mb-md" style="font-size: 26px">You should also try some of these courses</h5>
    <div class="row courses-wrapper">
      <template v-if="dashboardStore.suggestiveCoursesLoading">
        <template v-for="item in Array(4)" :key="item">
          <div class="col-lg-4 col-md-6 col-12 q-mb-md course-card-wrapper">
            <SlideViewSkeleton />
          </div>
        </template>
      </template>
      <template v-else v-for="(course, index) in suggestiveCourses" :key="index">
        <div class="col-lg-4 col-md-6 col-12 q-mb-md course-card-wrapper">
          <CourseCard
            :data="course"
            :key="course.id"
            @moveToCourseInfo="moveToCourseInfo"
            :loading="courseLoading === course.sk"
            :disabled="course.disabled"
          />
        </div>
      </template>
      <BaseDataFallBack
        :show="suggestiveCourses.length === 0 && !dashboardStore.suggestiveCoursesLoading"
        :title="'Sorry, no suggestive courses available'"
      />
    </div>
  </div>

  <div
    class="bg-night-blue course-section-wrapper q-px-lg q-mx-md full-width"
    :class="{ 'dark-border': $q.dark.isActive, 'full-width': dashboardStore.suggestiveChallengeCoursesLoading }"
  >
    <h5 class="font-paytone q-mb-md text-white q-py-md q-mt-none" style="font-size: 26px">
      Test how good you are by trying some of our challenges
    </h5>
    <div class="row courses-wrapper">
      <template v-if="dashboardStore.suggestiveChallengeCoursesLoading">
        <template v-for="item in Array(4)" :key="item">
          <div class="col-lg-4 col-md-6 col-12 q-mb-md course-card-wrapper">
            <SlideViewSkeleton />
          </div>
        </template>
      </template>
      <template v-else v-for="(course, index) in suggestiveChallengeCourses" :key="index">
        <div
          class="col-lg-4 col-md-6 col-12 q-mb-md course-card-wrapper"
          :class="{
            disabled: course.disabled
          }"
        >
          <CourseCard
            :data="course"
            :key="course.id"
            challengeMode
            @moveToCourseInfo="moveToCourseInfo"
            :loading="courseLoading === course.sk"
          />
        </div>
      </template>
      <BaseDataFallBack
        :show="suggestiveChallengeCourses.length === 0 && !dashboardStore.suggestiveChallengeCoursesLoading"
        :title="'Sorry, no challenges available'"
        :dark="false"
      />
    </div>
  </div>
</template>

<script setup>
import SlideViewSkeleton from 'src/components/skeleton/SlideViewSkeleton.vue'
import CourseCard from 'src/components/dashboard/beta/CourseCard.vue'
import BaseDataFallBack from 'src/components/wrappers/BaseDataFallBack/index.vue'

import { useRouter } from 'vue-router'
import { useDashboardStore } from 'src/store/pinia/dashboard'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useMacroMetaStore } from 'src/store/pinia/macroMeta'
import { onBeforeMount, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { randomIndexes } from 'src/utils/helpers'

const router = useRouter()
const $q = useQuasar()

const coursesStore = useCoursesStore()
const macroMetaStore = useMacroMetaStore()
const dashboardStore = useDashboardStore()

const courseLoading = ref(false)

const suggestiveCourses = computed(() => {
  const indexes = randomIndexes(4, dashboardStore.suggestiveCourses.length)
  return indexes.map((randomIndex) => {
    return dashboardStore.suggestiveCourses[randomIndex]
  })
})

const suggestiveChallengeCourses = computed(() => {
  const indexes = randomIndexes(4, dashboardStore.suggestiveChallengeCourses.length)
  return indexes.map((randomIndex) => {
    return dashboardStore.suggestiveChallengeCourses[randomIndex]
  })
})

onBeforeMount(() => {
  if (!dashboardStore.suggestiveCourses.length) {
    dashboardStore.fetchDashboardSuggestiveCourses()
  }
  if (!dashboardStore.suggestiveChallengeCourses.length) {
    dashboardStore.fetchDashboardSuggestiveCourses(true)
  }
})

const moveToCourseInfo = async (event) => {
  courseLoading.value = event.info.sk
  const data = event.info
  if (data.disabled) {
    courseLoading.value = false
    return
  }

  let cancelPrev = false

  if (data.upgrade) {
    await router.push(`/portal/course-info/info/${urlSafeBase64Encode(data.id)}`)
  } else if (data.is_enrolled) {
    cancelPrev = await redirectionToCoursePage(data, false)
  } else if (!data.is_enrolled) {
    await coursesStore.enrollUserCourse({ event_id: data.id })

    if (coursesStore.statusOfEnroll) {
      cancelPrev = await redirectionToCoursePage(data, true)
    }
  }

  !cancelPrev && (courseLoading.value = false)
}

const redirectionToCoursePage = async (data, enroll = false) => {
  const payload = {
    event_id: data.id
  }
  //res is true/false (based on request cancel)
  const res = await coursesStore.fetchCourse(payload)
  if (enroll) {
    await addAnalytics(data.id, coursesStore.courseInfo.learningPaths)
  }
  if (
    coursesStore.courseHeaderData.id === data.id &&
    coursesStore.courseHeaderData.is_enrolled &&
    coursesStore.courseHeaderData.is_active
  ) {
    let statusBreak = false
    let index = 0
    for (const item of coursesStore.courseOutlineData) {
      if (statusBreak) {
        break
      }
      let subItemsIndex = 0
      if (item.items ? item.items.length > 0 : false) {
        for (const subItems of item.items) {
          if (subItems.url) {
            if (!subItems.isCompleted || (coursesStore.courseOutlineData.length === index + 1 && subItemsIndex + 1 === item.items.length)) {
              statusBreak = true
              router.push(subItems.url)
              break
            }
          }
          subItemsIndex++
        }
      }
      index++
    }
  }
  return res
}

const addAnalytics = async (eventId, learningPaths) => {
  await macroMetaStore.publishCourseStats({
    course: eventId,
    learning_path: learningPaths
  })
}
</script>

<style lang="scss" scoped>
.course-section-wrapper {
  border-radius: 1rem;
}

.course-card-wrapper {
  @media (min-width: 1650px) {
    width: 25%;
    max-width: 24rem;
  }
}
</style>
