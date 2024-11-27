<template>
  <AssignmentData :key="$route.fullPath" />
</template>

<script>
import AssignmentData from './assignmentIndex.vue'
import { ref } from 'vue'
export default {
  name: 'courseIndex',
  components: { AssignmentData },

  setup() {
    const drawer = ref(false)
    const routingType = ref('assignment')
    return {
      drawer,
      routingType
    }
  }
}
</script>
