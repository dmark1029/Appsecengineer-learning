<template>
  <div class="viewPages">
    <div class="row full-height">
      <div class="col-12" style="position: sticky; top: 120px; z-index: 10">
        <Lfilters :stateSelected="stateSelected" @hide-dropdown="hideDropdown" @filter-items="searchItems" :key="$route.fullPath">
          <template v-slot:search>
            <BaseInput dense outlined v-model="stateSelected.search" label="Search">
              <template v-slot:append>
                <q-separator color="grey-10" vertical class="q-ma-sm" />
                <q-icon name="search" />
              </template>
            </BaseInput>
          </template>
        </Lfilters>
      </div>

      <div class="q-pa-xs col-12 none-spacing q-py-lg">
        <div class="row">
          <template v-if="coursesStore.isLoading">
            <template v-for="item in Array(12)" :key="item">
              <div class="col-lg-4 col-md-6 col-12 q-mb-md course-card-wrapper">
                <SlideViewSkeleton />
              </div>
            </template>
          </template>

          <template v-else>
            <BaseDataFallBack v-if="courses.length === 0" :title="'Sorry, No Data Found'" />
            <div v-else v-for="(course, index) in courses" class="col-lg-4 col-md-6 col-12 q-mb-md course-card-wrapper" :key="index">
              <CourseCard
                :data="course"
                @moveToCourseInfo="moveToCourseInfo"
                :loading="courseLoading === course.sk"
                :challengeMode="isChallenge"
                :disabled="course.disabled"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { computed, defineComponent, shallowRef, watch, onBeforeMount } from 'vue'

import { getTypeBasedOnRoute } from 'src/utils/module/course'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useMacroMetaStore } from 'src/store/pinia/macroMeta'

import Lfilters from 'components/my_courses/Lfilters.vue'
import CourseCard from 'components/dashboard/beta/CourseCard.vue'
import BaseDataFallBack from 'app/src/components/wrappers/BaseDataFallBack/index.vue'
import SlideViewSkeleton from 'components/skeleton/SlideViewSkeleton.vue'

defineComponent({
  name: 'MyCourses',
  meta: {
    title: 'Courses',
    meta: {
      description: {
        name: 'description',
        content: 'Browse through the extensive course library of AppSecEngineer'
      }
    }
  }
})

const coursesStore = useCoursesStore()
const macroMetaStore = useMacroMetaStore()

const route = useRoute()
const router = useRouter()

const dropDownSelect = shallowRef(false)
const isLoading = shallowRef(false)
const courseLoading = shallowRef(false)
const movingToCourse = shallowRef(false)
const isChallenge = shallowRef(false)

const stateSelected = computed(() => coursesStore.getFiltersState(getTypeBasedOnRoute(route.name)))
const courses = computed(() => {
  if (!stateSelected.value.search) return coursesStore.coursesData
  return coursesStore.coursesData.filter((creature) => creature.name.toLowerCase().includes(stateSelected.value.search.toLowerCase()))
})

function hideDropdown() {
  dropDownSelect.value = false
}

onBeforeMount(() => {
  const temp = coursesStore.getFiltersState(getTypeBasedOnRoute(route.name))
  const data = {
    filters: temp.filters,
    learning_paths: temp.learning_paths,
    roles: temp.roles
  }
  stateSelected.value = data
  searchItems({ data: data })
})


async function searchItems(payload, callback = undefined) {
  coursesStore.setFiltersState({
    data: payload.data,
    type: getTypeBasedOnRoute(route.name)
  })
  isLoading.value = true
  await coursesStore.filterCourses(
    {
      ...stateSelected.value,
      search: undefined
    },
    true,
    true
  )
  isLoading.value = false
  callback && callback()
}

async function bootingCourse() {
  isLoading.value = true
  isChallenge.value = route.name === 'challenges'

  await coursesStore.filterCourses({
    ...stateSelected.value,
    search: undefined
  })
  isLoading.value = false
}

async function moveToCourseInfo(event) {
  movingToCourse.value = true
  const data = event.info
  courseLoading.value = event.info.sk
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

async function redirectionToCoursePage(data, enroll = false) {
  //res is true/false (based on request cancel)
  const res = await coursesStore.fetchCourse(
    {
      event_id: data.id
    },
    false
  )

  if (enroll) {
    await addAnalytics(data.id, coursesStore.courseInfo.learningPaths)
  }

  const { courseHeaderData, courseOutlineData } = coursesStore
  const { id, is_enrolled, is_active } = courseHeaderData

  if (id === data.id && is_enrolled && is_active) {
    let statusBreak = false
    let index = 0

    for (const item of courseOutlineData) {
      if (statusBreak) break
      let subItemsIndex = 0
      if (item.items ? item.items.length > 0 : false) {
        for (const subItems of item.items) {
          if (subItems?.url) {
            if (!subItems.isCompleted || (courseOutlineData.length === index + 1 && subItemsIndex + 1 === item.items.length)) {
              statusBreak = true
              await router.push(subItems.url)
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

async function addAnalytics(eventId, learningPaths) {
  await macroMetaStore.publishCourseStats({
    course: eventId,
    learning_path: learningPaths
  })
}

bootingCourse()

watch(
  () => route,
  () => {
    bootingCourse()
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.stickyView {
  position: -webkit-sticky;
  position: sticky;
  top: 70px;
  right: 0;
  z-index: auto;
}

.disabled {
  filter: grayscale(1);
}

.course-card-wrapper {
  @media (min-width: 1650px) {
    width: 25%;
    max-width: 24rem;
  }
}
</style>
