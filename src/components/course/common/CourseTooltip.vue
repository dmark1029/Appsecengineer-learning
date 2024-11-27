<template>
  <q-tooltip
    anchor="center end"
    class="q-pa-lg shadow-1 text-primary z-fab"
    :class="isDark ? 'bg-dark' : 'bg-white'"
    max-width="20rem"
    self="center start"
  >
    <h6 class="q-my-none">{{ data.name }}</h6>
    <q-avatar v-for="(instructor, index) in data.instructors" class="inline-block q-mr-sm q-my-sm" :key="index" size="lg">
      <q-img :src="instructor.logo" />
    </q-avatar>
    <q-linear-progress
      v-if="data.is_enrolled"
      class="q-my-sm"
      :color="data.progress >= 100 ? 'green' : 'secondary'"
      rounded
      :value="data.progress / 100"
    />
    <p class="q-mb-none text-caption">
      <span>{{ data.description?.substring(0, 250) }}</span>
      <span v-if="data.description?.length > 250">...</span>
    </p>
  </q-tooltip>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { computed } from 'vue'

defineProps({
  data: {
    type: Object,
    required: true,
    default: () => {}
  }
})

const $q = useQuasar()

const isDark = computed(() => $q.dark.isActive)
</script>
