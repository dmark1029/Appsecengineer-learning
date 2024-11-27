<template>
  <div>
    <p v-if="courseInfo.upgrade" style="color: #40c25f; font-size: 14px; font-weight: 600">
      <q-avatar icon="star_rate" color="amber" text-color="white" size="xs" />
      Upgrade to unlock all the courses
    </p>
    <div>
      <q-btn
        v-if="!courseInfo.is_enrolled && !courseInfo.upgrade"
        :loading="isLoading"
        class="bg-secondary radius-8 text-bold text-white"
        flat
        @click="showEnrollCourse()"
      >
        GET STARTED
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left text-body1" />
          Loading...
        </template>
      </q-btn>
      <q-btn
        v-else-if="!courseInfo.is_enrolled && courseInfo.upgrade"
        :loading="isLoading"
        color="positive"
        class="bg-positive radius-8 text-bold text-white"
        flat
        @click="upgradePlan()"
      >
        Upgrade
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left text-body1" />
          Loading...
        </template>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue'

defineComponent({
  name: 'CoursePreviewCardUpgrade'
})

defineProps(['courseInfo', 'isLoading'])

const emit = defineEmits(['enrollCourse', 'upgradeCourse'])

function showEnrollCourse() {
  emit('enrollCourse')
}
function upgradePlan() {
  emit('upgradeCourse')
}
</script>
