<template>
  <div>
    <q-card class="my-card">
      <q-card-section>
        <h1 class="text-h4">Contents</h1>
      </q-card-section>
      <div v-for="contentInfo in coursesStore.courseOutlineData" :key="contentInfo.subject_id">
        <q-toolbar class="shadow-2">
          <q-toolbar-title>{{ contentInfo.subject_name }}</q-toolbar-title>
        </q-toolbar>

        <q-list bordered>
          <q-item v-for="content in contentInfo.items" :key="content.id" class="q-my-sm" clickable v-ripple>
            <q-item-section @click="showContentInfo(contentInfo.subject_id, content.id, content.type)">
              <q-item-label>{{ content.name }}</q-item-label>
              <q-item-label caption lines="1">10.20</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { useCoursesStore } from 'src/store/pinia/courses'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

defineComponent({
  name: 'CourseContent'
})

const props = defineProps({
  eventId: {
    required: false
  }
})

const coursesStore = useCoursesStore()

const router = useRouter()

function showContentInfo(subjectId, id, type) {
  if (type === 'lab') {
    router.push(
      `/portal/course-info/lab/${urlSafeBase64Encode(props.eventId)}/${urlSafeBase64Encode(subjectId)}/${urlSafeBase64Encode(id)}`
    )
  } else if (type === 'vid') {
    router.push(
      `/portal/course-info/video/${urlSafeBase64Encode(props.eventId)}/${urlSafeBase64Encode(subjectId)}/${urlSafeBase64Encode(id)}`
    )
  } else if (type === 'quiz') {
    router.push(
      `/portal/course-info/quiz/${urlSafeBase64Encode(props.eventId)}/${urlSafeBase64Encode(subjectId)}/${urlSafeBase64Encode(id)}`
    )
  } else if (type === 'media') {
    router.push(
      `/portal/course-info/media/${urlSafeBase64Encode(props.eventId)}/${urlSafeBase64Encode(subjectId)}/${urlSafeBase64Encode(id)}`
    )
  } else if (type === 'download') {
    router.push(
      `/portal/course-info/download/${urlSafeBase64Encode(props.eventId)}/${urlSafeBase64Encode(subjectId)}/${urlSafeBase64Encode(id)}`
    )
  }
}
</script>
