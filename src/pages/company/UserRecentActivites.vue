<template>
  <q-timeline>
    <q-virtual-scroll style="max-height: 300px" v-if="recentActivities.length" :items="recentActivities" separator v-slot="{ item, index }">
      <q-timeline-entry :color="item.action === 'completed' ? 'primary' : 'secondary'" :icon="getIcon(item)" :key="index" class="q-ma-lg">
        <template v-slot:title>
          <div class="text-subtitle1">{{ getEntryTitle(item) }}</div>
        </template>
        <template v-slot:subtitle>
          <div class="">{{ item.date }}</div>
        </template>
        <div>
          <q-icon :name="item.icon" v-if="item.icon" color="primary" class="q-mr-sm" />
          <span v-if="item.url" @click="routerUrlPath(item.url)" class="cursor-pointer">
            {{ item.name }}
          </span>
          <span v-else class="ase-md ase-roboto">{{ item.name }}</span>
        </div>
      </q-timeline-entry>
    </q-virtual-scroll>
  </q-timeline>
</template>

<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({
  recentActivities: {
    type: Array,
    required: true,
    default: () => []
  }
})

const router = useRouter()

const getIcon = (item) => {
  return item.icon || (item.action === 'completed' ? 'fas fa-user-graduate' : 'fas fa-user-tag')
}

const getEntryTitle = (item) => {
  switch (item.action) {
    case 'completed':
      return `Completed ${item.type}`
    case 'enrolled':
      return `Enrolled ${item.type}`
    default:
      return ''
  }
}
function routerUrlPath(path) {
  router.push(path)
}
</script>
