<template>
  <div class="row">
    <div class="col-12 q-mr-md q-pa-xs">
      <h6 class="q-my-sm text-bold">{{ coursesStore.courseHeaderData.name }}</h6>
      <span v-if="coursesStore.totalCourseMinutes" class="text-body1">
        <q-icon size="sm" name="timer" />
        {{ coursesStore.totalCourseMinutes }}
      </span>
      <span v-if="coursesStore.courseOutlineData.length > 0" class="text-body1">
        <q-icon size="sm" name="article" />
        {{ coursesStore.courseOutlineData.length }} {{ coursesStore.courseOutlineData.length > 1 ? 'Lessons' : 'Lesson' }}
      </span>
    </div>
    <div class="col-12 flex q-pa-xs">
      <q-img class="q-mr-sm radius-8" fit="contain" :ratio="16 / 9" :src="coursesStore.courseHeaderData.logo" style="width: 45%" />
      <div class="column justify-around" style="width: 45%">
        <div>
          <q-chip v-if="coursesStore.courseInfo.proficiency" class="text-bold" color="green" size="12px" square text-color="white">
            {{ coursesStore.courseInfo.proficiency }}
          </q-chip>
        </div>
        <div class="flex justify-between items-end">
          <div v-if="coursesStore.courseInfo.instructors?.length" class="q-mt-lg">
            <p class="ase-roboto q-mb-xs">{{ coursesStore.courseInfo.instructors.length > 1 ? 'Instructors' : 'Instructor' }}</p>
            <label v-for="(inst, index) in coursesStore.courseInfo.instructors" :key="index" @click="instructorInfo">
              <u class="cursor_pointer text-bold text-secondary">
                {{ inst.name
                }}{{ coursesStore.courseInfo.instructors.length && coursesStore.courseInfo.instructors.length > index + 1 ? ',' : '.' }}
              </u>
            </label>
          </div>
          <q-dialog ref="dialog">
            <q-card class="q-dialog-plugin" style="min-width: 500px">
              <div v-for="(instructor, index) of coursesStore.instructorInfo" :key="index">
                <CourseInstructorInfo v-if="instructor.name" :data="instructor" />
              </div>
            </q-card>
          </q-dialog>
          <CoursePreviewCardUpgrade
            :courseInfo="coursesStore.courseInfo"
            :isLoading="coursesStore.isLoading"
            @enrollCourse="redirectEnrolledCourse"
            @upgradeCourse="upgradeCourse"
          />
        </div>
      </div>
    </div>
    <div class="col-12 q-pa-xs text-justify">
      <p class="text-body2 ase-roboto ase-black-light none-spacing" style="white-space: pre-line">
        {{ coursesStore.courseHeaderData.description }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { LocalStorage } from 'quasar'
import { useCoursesStore } from 'src/store/pinia/courses'
import { defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CourseInstructorInfo from 'src/components/course/CourseInstructorInfo.vue'
import CoursePreviewCardUpgrade from 'src/components/course/CoursePreviewCardUpgrade.vue'

defineComponent({
  name: 'UdemyCourseHeader'
})

const coursesStore = useCoursesStore()

const route = useRoute()
const router = useRouter()

const dialog = ref(null)

function instructorInfo() {
  dialog.value.show()
}

async function redirectEnrolledCourse() {
  const data = { event_id: urlSafeBase64Decode(route.params.courseId) }
  await coursesStore.enrollUserCourse(data)
  if (coursesStore.statusOfEnroll) {
    await coursesStore.fetchCourse(data)
    const firstItemsList = coursesStore.courseOutlineData.map((e) => e.items.map((dataItem) => dataItem.url))
    for (const itemsList of firstItemsList) {
      if (itemsList && itemsList.length > 0) {
        router.push(itemsList[0])
        break
      }
    }
  }
}
function upgradeCourse() {
  if (LocalStorage.getItem('type') === 'Teams') {
    window.open(`${window.location.origin}/subscription-expired`)
    return
  }
  router.push({ name: 'upgrade' })
}
</script>
