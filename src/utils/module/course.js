import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'

const ROLE_OPTIONS = [
  { value: 'Cloud Engineer', label: 'Cloud Engineer', logo: 'cloudEngineer.png' },
  { value: 'Developer', label: 'Developer', logo: 'developer.png' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer', logo: 'devops.png' },
  { value: 'Security Engineer', label: 'Security Engineer', logo: 'securityEngineer.png' },
  { value: 'Security Champion', label: 'Security Champion', logo: 'securityChampion.png' },
  { value: 'Security Architect', label: 'Security Architect', logo: 'securityArchitect.png' },
  { value: 'Pentester', label: 'Pentester', logo: 'pentester.png' }
]
const COURSE_OPTIONS = [
  {
    label: 'In Progress',
    value: 'in_progress',
    logo: 'inProgress.png'
  },
  {
    label: 'Not Started',
    value: 'not_started',
    logo: 'notStarted.png'
  },
  {
    label: 'Completed',
    value: 'is_completed',
    logo: 'completed.png'
  }
]
const PROFICIENCY_OPTIONS = [
  {
    label: 'Beginner',
    value: 'Beginner',
    logo: 'beginner.png'
  },
  {
    label: 'Intermediate',
    value: 'Intermediate',
    logo: 'intermediate.png'
  },
  {
    label: 'Advanced',
    value: 'Advanced',
    logo: 'advanced.png'
  }
]

function setInstructors(intructorIds) {
  if (!intructorIds?.length) return []
  return intructorIds.map((instructor) => {
    const intructors = instructor.split('#')
    return {
      id: intructors?.[0] ?? '',
      name: intructors?.[1] ?? '',
      logo: intructors?.[2] ?? ''
    }
  })
}

function setCourseItem(item) {
  return {
    ...item.event,
    ...item,
    id: item.event.sk,
    name: item.event.event_name,
    progress: parseInt(item?.progress?.toFixed()) ?? 0,
    instructors: setInstructors(item.event.instructor_id),
    feedback: item?.feedback ?? '',
    url: `/portal/course-info/intro/${urlSafeBase64Encode(item.event.sk)}`,
    estimated_hours: getRoundedHour(item?.total_ttl),
    is_new_launched: isNewCourse(item?.event?.created_on)
  }
}

function division(dividend, divisor) {
  return {
    quotient: Math.floor(dividend / divisor),
    remainder: Math.floor(dividend % divisor)
  }
}
function formatTime(totalSeconds, hasHour, autoIncrease = true) {
  if (!totalSeconds) return `0 mins`
  if (totalSeconds < 60) return `1 mins`

  let { quotient: minutes, remainder: seconds } = division(totalSeconds, 60)
  autoIncrease && seconds >= 30 && minutes++

  if (hasHour && minutes >= 60) {
    let { quotient: hours, remainder } = division(minutes, 60)
    minutes = remainder
    return `${hours} hr ${minutes} mins`
  }

  return `${minutes} mins`
}

function getResultValue({ items, progressData = [], payload }) {
  if (!items || !items?.length) return []
  let totalTime = 0
  let allContents = items.map((sub) => {
    let timer_adding = 0
    const subjectItems = sub.items.map((getval) => {
      const { type, item_ttl, id, name } = getval
      const item = {
        id,
        name,
        type,
        subject_name: sub.name
      }

      const defaultRemove = type === 'lab' ? 300 : 0
      const totalSeconds = Number(item_ttl) - defaultRemove

      if (item.type === 'vid') {
        const formattedTime = formatTime(totalSeconds)
        item.itemTtl = formattedTime !== '0 mins' ? formattedTime : undefined
        timer_adding += totalSeconds
      }
      item.item_order = parseInt(getval.item_order)
      item.challenge = getval.challenge || false
      item.isCompleted = progressData.includes(getval.id)

      const types = ['lab', 'vid', 'quiz', 'media', 'download', 'aiquiz']
      if (types.includes(type) && payload.event_id && sub.id && getval.id) {
        const encodedEventId = urlSafeBase64Encode(payload.event_id)
        const encodedSubId = urlSafeBase64Encode(sub.id)
        const encodedItemId = urlSafeBase64Encode(getval.id)
        const mapType = type === 'vid' ? 'video' : type
        item.url = `/portal/course-info/${mapType}/${encodedEventId}/${encodedSubId}/${encodedItemId}`
      }
      return item
    })

    subjectItems.sort((a, b) => a.item_order - b.item_order)
    totalTime += timer_adding

    const formattedTime = formatTime(timer_adding, true)
    return {
      subject_name: sub.name,
      subject_id: sub.id,
      items: subjectItems,
      timerCourse: formattedTime !== '0 mins' ? formattedTime : undefined
    }
  })

  const formattedTime = formatTime(totalTime, true)
  return {
    totalTime: formattedTime !== '0 mins' ? formattedTime : undefined,
    allContents
  }
}

function getTypeBasedOnRoute(routeName) {
  switch (routeName) {
    case 'challenges':
      return 'challenge'
    case 'playgrounds':
      return 'playground'
    case 'live-courses':
      return 'live-course'
  }
  return 'course'
}

function resetFilters(routeName) {
  switch (routeName) {
    case 'challenges':
      return 'Challenge'
    case 'playgrounds':
      return 'PlayGround'
    case 'live-courses':
      return 'live_course'
  }
  return 'Course'
}

function getLabelNewCourseOptions(routeName) {
  switch (routeName) {
    case 'challenges':
      return 'New Challenges'
    case 'playgrounds':
      return 'New playground'
    case 'live-courses':
      return 'New Live Courses'
  }
  return 'New Courses'
}

function getRoundedHour(ttl) {
  if (!ttl) return 0
  return Math.round(ttl / 3600)
}

function isNewCourse(date) {
  if (!date) return false
  const today = new Date()
  today.setDate(today.getDay() - 21)

  const launched_date = new Date(date)

  return launched_date >= today
}

export {
  setInstructors,
  setCourseItem,
  getResultValue,
  getTypeBasedOnRoute,
  resetFilters,
  getLabelNewCourseOptions,
  COURSE_OPTIONS,
  ROLE_OPTIONS,
  PROFICIENCY_OPTIONS,
  formatTime,
  getRoundedHour
}
