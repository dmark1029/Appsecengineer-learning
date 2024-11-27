<template>
  <StreakNotification v-if="openStreakNotification" @close="openStreakNotification = false" />
  <h5 class="font-paytone q-my-md" style="font-size: 26px">What will you learn today?</h5>
  <div class="row q-gutter wrap">
    <div class="col-lg-8 col-sm-12">
      <FeaturedCourse />
    </div>
    <div class="col-lg-4 col-sm-12 justify-end row">
      <Achievments />
    </div>
  </div>
  <DashboardCourse />
</template>

<script setup>
import { ref, onMounted, shallowRef, defineComponent } from 'vue'
import { LocalStorage } from 'quasar'
import { currentYearOld, previousDates } from 'src/utils/reuseFunctions'

import { useMacroMetaStore } from 'src/store/pinia/macroMeta'

import DashboardCourse from 'src/components/dashboard/DashboardCourse.vue'
import FeaturedCourse from 'src/components/dashboard/beta/FeatureCourses.vue'
import Achievments from 'src/components/dashboard/beta/Achievments.vue'
import StreakNotification from 'src/components/common/StreakNotification.vue'

defineComponent({
  name: 'DashboardIndex'
})

const openStreakNotification = shallowRef(false)
const dropdownOptions = ref([])
const dropdownValue = ref({})

const macroMetaStore = useMacroMetaStore()

onMounted(async () => {
  previousData()
  if (LocalStorage.getItem('publishLoginAPi') === 'on') {
    macroMetaStore.publishLogin({})
    LocalStorage.remove('publishLoginAPi')
  }
})

const previousData = () => {
  dropdownOptions.value = previousDates()
  dropdownValue.value = currentYearOld()
}

// Fetch initial data
previousData()
</script>

<style scoped>
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 1px grey;
  border-radius: 12px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #ff754c;
  border-radius: 12px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #ff754c;
}

.disabled {
  filter: grayscale(1);
  /* pointer-events: none; */
}
</style>
