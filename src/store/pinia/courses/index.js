import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api, apiAnalytics, apiAsegpt } from 'src/boot/axios'
import { getResultValue, setCourseItem, setInstructors } from 'src/utils/module/course'
import { LocalStorage, Notify, useQuasar } from 'quasar'
import { urlSafeBase64Decode, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { useRouter } from 'vue-router'
import { CacheService } from 'src/service/CacheService'
import { loader } from 'src/utils/helpers'

export const useCoursesStore = defineStore('coursesStore', () => {
  const $q = useQuasar()

  const analyticsInfo = ref({ userUsedMinutes: 0 }) //
  const coursesData = ref([])
  const courseHeaderData = ref({})
  const courseInfo = ref({})
  const courseOutlineData = ref([])
  const dashboardAnalytics = ref({}) //
  const dashboardCoursesData = ref([])
  const feedBackStatus = ref(false)
  const feedBackItemDetails = ref({})
  const filtersState = ref({
    //
    course: {
      filters: ['Course'],
      search: undefined
    },
    playground: {
      filters: ['PlayGround'],
      search: undefined
    },
    challenge: {
      filters: ['Challenge'],
      search: undefined
    },
    'live-course': {
      filters: ['live_course'],
      search: undefined
    }
  })
  const instructorInfo = ref([])
  const isLoading = ref(false)
  const progressData = ref([])
  const ratingInfo = ref({})
  const statusOfMarkingApi = ref(false)
  const statusOfEnroll = ref(false)
  const totalCourseMinutes = ref(0)
  const totalLabs = ref(0)
  const gptAnswer = ref('')
  const isGptAnswerFetched = ref(false)
  const courseAbortController = ref(null)
  const loadedFilters = ref([])
  const isMarking = ref(false)

  const router = useRouter()

  async function manageLoading(callback, loading = true) {
    try {
      loading && (isLoading.value = true)
      await callback()
    } catch (error) {
      console.log(error)
    } finally {
      loading && (isLoading.value = false)
    }
  }
  function getFiltersState(payload) {
    return filtersState.value[payload] || {}
  }
  function setFiltersState({ type, data }) {
    filtersState.value[type] = data
  }
  function fetchDashboardCourses() {
    return manageLoading(async () => {
      const res = await api.get('user/dashboard')
      const courseData =
        res?.data?.data?.items?.map(setCourseItem)?.sort((a, b) => {
          return a?.event_name?.localeCompare(b?.event_name)
        }) ?? []
      dashboardCoursesData.value = courseData.map((item) => {
        return {
          ...item,
          disabled: !res?.data?.data?.subs?.includes(item.id)
        }
      })
    })
  }
  function fetchDashboardAnalyticsInfo(payload) {
    return manageLoading(async () => {
      const res = await apiAnalytics.post('company/user/stats-key', payload)
      if (res.data.success) {
        analyticsInfo.value = {
          userUsedMinutes: res.data.data.course_minutes | 0
        }
      }
    })
  }
  function fetchCourses() {
    return manageLoading(async () => {
      const res = await api.get('course/list-courses')
      coursesData.value = res?.data?.data?.items?.map(setCourseItem)?.sort((a, b) => a?.event_name?.localeCompare(b?.event_name)) ?? []
    })
  }
  async function filterCourses(payload, apiCall = false, search = false) {
    if (courseAbortController.value && !search) {
      await courseAbortController.value?.abort()
    }

    try {
      coursesData.value = []
      isLoading.value = true

      const cache = new CacheService('filter-courses')
      await cache.open()
      const res = await cache.getIfExist(payload?.filters[0]?.toLowerCase())

      const isCached = loadedFilters.value.includes(payload?.filters[0]?.toLowerCase())

      if (!res || !isCached || apiCall) {
        if (!search) {
          await cache.deleteIfExist(payload?.filters[0]?.toLowerCase())
        }

        courseAbortController.value = new AbortController()
        const signal = courseAbortController.value?.signal

        const res = await api.post('course/filter-learning-path-progress', payload, {
          signal,
          noLoading: true
        })

        const courseData = res?.data?.data?.items?.map(setCourseItem)?.sort((a, b) => a?.event_name?.localeCompare(b?.event_name)) ?? []

        coursesData.value = courseData.map((item) => {
          return {
            ...item,
            disabled: !res?.data?.data?.subs?.includes(item.id)
          }
        })
        courseAbortController.value = null

        //reason:return don't need to mark filters or cached data when search
        if (search) return

        await cache.add(coursesData.value, payload?.filters[0]?.toLowerCase())
        loadedFilters.value.push(payload?.filters[0]?.toLowerCase())
        return
      }

      coursesData.value = res
    } catch (error) {
      if (error.code === 'ERR_CANCELED' && !coursesData.value.length) setTimeout(() => (isLoading.value = true))
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCourse(payload, loading = true) {
    let cancelPrev = false
    try {
      loading && (isLoading.value = true)
      if (courseAbortController.value) {
        courseAbortController.value?.abort()
      }

      courseAbortController.value = new AbortController()
      const signal = courseAbortController.value?.signal

      const res = await api.post('user/get-course-info', payload, { signal })

      if (res.data.success) {
        const { progress, event } = res.data.data
        const totalProgress = []
        if (event) {
          const instructors = setInstructors(event.instructor_id)
          const instruction_id = instructors.map((e) => e?.id ?? '')
          courseInfo.value = {
            ...event,
            name: event.event_name,
            instructor_id: instruction_id,
            id: event.sk,
            instructors: instructors,
            learningPaths: event.learning_path_id,
            achievementType: event.achievement_type,
            upgrade: res.data.data.upgrade,
            order: res.data.data.item_order,
            progress_percent: res.data.data.progress_percent,
            ...(res.data.data.event.sk && { url: `/portal/course-info/intro/${urlSafeBase64Encode(res.data.data.event.sk)}` })
          }
          ratingInfo.value = res.data.data.rating || {}
        }
        // endof course info detailed
        progress.forEach((progval) => {
          totalProgress.push(progval.split('#')[2])
        })
        courseHeaderData.value = {
          name: event.event_name,
          id: event.sk,
          description: event.description,
          logo: event.logo,
          is_active: event.is_active,
          is_enrolled: res.data.data.is_enrolled,
          achievementType: event.achievement_type
        }

        const { totalTime, allContents } = getResultValue({
          items: res.data.data.items,
          progressData: totalProgress,
          payload
        })

        courseOutlineData.value = allContents ?? []
        progressData.value = totalProgress
        totalCourseMinutes.value = totalTime

        const items = res.data.data.items
        let labNum = 0
        for (let i = 0; i < items.length; i++) {
          const subItems = items[i].items
          for (let j = 0; j < subItems.length; j++) {
            if (subItems[j].type === 'lab') {
              labNum++
            }
          }
        }
        totalLabs.value = labNum
      }
    } catch (err) {
      if (err.code === 'ERR_CANCELED') {
        if (!coursesData.value.length) {
          loading && setTimeout(() => (isLoading.value = true))
        }
        cancelPrev = true
      }
    } finally {
      loading && (isLoading.value = false)
      return cancelPrev
    }
  }
  function enrollUserCourse(payload) {
    return manageLoading(async () => {
      if (courseAbortController.value) {
        courseAbortController.value?.abort()
      }
      statusOfEnroll.value = false
      const showError = (message) => {
        let msg = 'Not able to enroll you into this course please contact administrator'
        if (message === 'User Subscription Expired' || LocalStorage.getItem('type') === 'FT') msg = message
        Notify.create({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: msg
        })
      }
      try {
        $q.loading.show(loader({}))
        const res = await api.post('enroll/course', payload)
        if (res.data.success) {
          Notify.create({
            type: 'positive',
            position: 'top',
            progress: true,
            message: res.data.message
          })
          const index = coursesData.value.findIndex((item) => item.sk === payload.event_id)
          if (index > -1) {
            coursesData.value[index].is_enrolled = true
          }
          statusOfEnroll.value = true
        } else {
          showError(res.data.message)
        }
      } catch (error) {
        statusOfEnroll.value = false
        showError(error.response.data.message)
      } finally {
        $q.loading.hide()
      }
    })
  }
  function fetchInstructorInfo(payload) {
    return manageLoading(async () => {
      for (const idInst of payload) {
        const res = await api.post('instructor/info', { instructor_id: idInst })

        if (res?.data?.success && res.data.data) {
          instructorInfo.value.push({
            name: res.data.data.instructor_name,
            about: urlSafeBase64Decode(res.data.data.about),
            instruction_link: res.data.data.instruction_link,
            id: res.data.data.sk,
            logo: res.data.data.photo
          })
        }
      }
    })
  }
  function markTopicCompleted(payload) {
    isMarking.value = true
    return manageLoading(async () => {
      statusOfMarkingApi.value = false
      sessionStorage.setItem('feedback', false)
      feedBackStatus.value = false
      feedBackItemDetails.value = {}
      let manual = true
      payload.manual ? delete payload.manual : (manual = false)
      const res = await api.post('item/mark', payload)
      if (res.data.success) {
        statusOfMarkingApi.value = true
        feedBackItemDetails.value = { ...payload, manual }
        if (Object.entries(res.data.data).length > 0) {
          if (res.data.data.feedback && res.data.data.completed) {
            feedBackItemDetails.value = { ...payload, feedback_completed: true }
            feedBackStatus.value = true
          } else if (res.data.data.feedback && res.data.data.badge) {
            feedBackItemDetails.value = {
              ...payload,
              feedback_badge: true,
              redirect_badge_id: res.data.data.badge
            }
            feedBackStatus.value = true
          } else if (res.data.data.feedback || false) {
            feedBackStatus.value = true
          } else if (res.data.data.completed || false) {
            router.push(`/portal/course-info/completed/${urlSafeBase64Encode(payload.event_id)}/`)
          } else {
            router.push(
              `/portal/course-info/completed/${urlSafeBase64Encode(payload.event_id)}/${urlSafeBase64Encode(res.data.data.badge)}`
            )
          }
        } else {
          fetchCourse({
            event_id: payload.event_id
          })
        }
      }
    }).finally(() => (isMarking.value = false))
  }
  function clearStoragePopup(payload) {
    feedBackStatus.value = payload
    sessionStorage.setItem('feedback', payload)
  }
  async function gotoNextCourse(payload) {
    const searchIndex = courseOutlineData.value?.map((e, index) =>
      e.items.map((dataItem) => {
        const isEqual = dataItem.id === payload.filterId
        return {
          order: dataItem.item_order,
          name: e.subject_name,
          itemName: dataItem.name,
          index,
          id: e.subject_id,
          vid: dataItem.id,
          found: isEqual,
          current: isEqual ? dataItem.url : '',
          next: !isEqual ? dataItem.url : ''
        }
      })
    )

    const internalFilter = searchIndex.map((data) => data.filter((info) => info.found === true))
    const filteredData = internalFilter.filter((e) => e.length > 0)

    let testNewData = filteredData[0][0]

    let nextOrderItem = searchIndex
      .map((e) => e.filter((itemIndex) => itemIndex.index === testNewData.index))
      .filter((e) => e.length > 0)[0]

    let finalNextOrderElement = nextOrderItem.filter((e) => e.order > testNewData.order)

    if (finalNextOrderElement.length > 0 && finalNextOrderElement !== undefined) {
      finalNextOrderElement = finalNextOrderElement.filter((e) => e.order === testNewData.order + 1)
      if(finalNextOrderElement?.length && finalNextOrderElement[0]?.next){
        router.push({
          path: finalNextOrderElement[0]?.next
        })
      }
    } else if (finalNextOrderElement.length === 0 && finalNextOrderElement !== undefined) {
      let nextIndexItem = searchIndex
        .map((e) => e.filter((itemIndex) => itemIndex.index > testNewData.index))
        .filter((e) => e.length > 0)[0]

      let finalNextIndexElement = nextIndexItem.filter((e) => e.index > testNewData.index).filter((e) => e.index === testNewData.index + 1)

      if (finalNextIndexElement.length > 0 && finalNextIndexElement[0].next && nextIndexItem !== undefined && finalNextIndexElement !== undefined) {
        router.push({
          path: finalNextIndexElement[0]?.next
        })
      } else {
        router.go()
      }
    } else {
      router.go()
    }
  }
  function fetchGptAnswer(payload) {
    return manageLoading(
      async () => {
        isGptAnswerFetched.value = true
        const res = await apiAsegpt.post('asegpt/query', payload)
        if (res.data.success) {
          gptAnswer.value = res.data.data
          isGptAnswerFetched.value = false
        }
      },
      (err) => {
        gptAnswer.value = err.message
        isGptAnswerFetched.value = false
      }
    )
  }
  return {
    isLoading,
    coursesData,
    courseHeaderData,
    courseInfo,
    instructorInfo,
    dashboardAnalytics,
    courseOutlineData,
    progressData,
    analyticsInfo,
    statusOfMarkingApi,
    statusOfEnroll,
    feedBackStatus,
    feedBackItemDetails,
    totalCourseMinutes,
    ratingInfo,
    dashboardCoursesData,
    totalLabs,
    getFiltersState,
    setFiltersState,
    fetchDashboardCourses,
    fetchDashboardAnalyticsInfo,
    fetchCourses,
    filterCourses,
    fetchCourse,
    enrollUserCourse,
    fetchInstructorInfo,
    markTopicCompleted,
    clearStoragePopup,
    gotoNextCourse,
    fetchGptAnswer,
    gptAnswer,
    isGptAnswerFetched,
    isMarking
  }
})
