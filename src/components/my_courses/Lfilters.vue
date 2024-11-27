<template>
  <BaseCard class="row q-pa-md rectangle justify-between">
    <div class="row q-gutter-lg">
      <slot name="search"></slot>
      <FilterDropDown
        :modelValue="filteredLP"
        label="Learning Path"
        :textColor="areLearningPathsFiltered"
        :options="learningPath.learningPathOptions"
        @update:modelValue="(items) => (filteredLP = items)"
      />
      <FilterDropDown
        :modelValue="progress"
        label="Proficiency"
        :textColor="areProficienciesFiltered"
        :options="PROFICIENCY_OPTIONS"
        @update:modelValue="(items) => (progress = items)"
      />
      <FilterDropDown
        :modelValue="progress"
        label="Progress"
        :textColor="areCourseOptionsFiltered"
        :options="courseOptions"
        @update:modelValue="(items) => (progress = items)"
      />
      <FilterDropDown
        :modelValue="rolesData"
        label="Career"
        :textColor="areRolesFiltered"
        :options="ROLE_OPTIONS"
        @update:modelValue="(items) => (rolesData = items)"
      />
    </div>
    <div class="row q-gutter-lg">
      <BaseBtn no-caps @click="applyFilter()" :loading="isLoading">Apply</BaseBtn>
      <BaseBtn no-caps @click="clearData()">Clear</BaseBtn>
    </div>
  </BaseCard>
</template>

<script setup>
import { debounce } from 'quasar'
import { ref, shallowRef, computed, onMounted, defineComponent } from 'vue'
import { getLabelNewCourseOptions, resetFilters, COURSE_OPTIONS, ROLE_OPTIONS, PROFICIENCY_OPTIONS } from 'src/utils/module/course'

import { useRoute } from 'vue-router'
import { useLearningPathStore } from 'src/store/pinia/learningPath'
import { useCoursesStore } from 'src/store/pinia/courses'
import { getTypeBasedOnRoute } from 'src/utils/module/course'

import FilterDropDown from './FilterDropDown.vue'

defineComponent({
  name: 'LFilters'
})

const props = defineProps({
  id: {
    required: false
  },
  stateSelected: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['filterItems', 'hide-dropdown'])

const visible = shallowRef(false)
const filteredLP = ref([])
const rolesData = ref([])
const progress = ref([])
const isLoading = shallowRef(false)

const route = useRoute()
const learningPath = useLearningPathStore()
const coursesStore = useCoursesStore()

onMounted(async () => {
  const { filters, learning_paths, roles } = props.stateSelected
  progress.value = filters || learning_paths || roles
  if (learning_paths?.length) {
    filteredLP.value = learning_paths
  }
  if (roles?.length) {
    rolesData.value = roles
  }
  if (learningPath.learningPathOptions.length === 0) {
    visible.value = true
    await learningPath.fetchLearningPath({})
    visible.value = false
  }
})

const clearData = () => {
  progress.value = [resetFilters(route.name)]
  filteredLP.value = []
  rolesData.value = []

  emit('filterItems', {
    data: {
      filters: [resetFilters(route.name)],
      learning_paths: [],
      roles: []
    }
  })
  emit('hide-dropdown')
}

const applyFilter = debounce(function () {
  isLoading.value = true
  const data = {
    filters: progress.value,
    learning_paths: filteredLP.value,
    roles: rolesData.value
  }
  coursesStore.setFiltersState({
    data: data,
    type: getTypeBasedOnRoute(route.name)
  })
  emit('filterItems', { data: data }, () => {
    isLoading.value = false
  })
  emit('hide-dropdown')
}, 500)

const areLearningPathsFiltered = computed(() => {
  const isActive = learningPath.learningPathOptions.some((item) => filteredLP.value.includes(item.value))
  return getDropDownColor(isActive)
})

const areProficienciesFiltered = computed(() => {
  const isActive = PROFICIENCY_OPTIONS.some((item) => progress.value.includes(item.value))
  return getDropDownColor(isActive)
})

const areCourseOptionsFiltered = computed(() => {
  const isActive = courseOptions.value.some((item) => progress.value.includes(item.value))
  console.log('is active', isActive)
  return getDropDownColor(isActive)
})

const areRolesFiltered = computed(() => {
  const isActive = ROLE_OPTIONS.some((item) => rolesData.value.includes(item.value))
  return getDropDownColor(isActive)
})

function getDropDownColor(active) {
  return active ? '#ff0000' : 'portalColor'
}

const courseOptions = computed(() => [
  {
    label: getLabelNewCourseOptions(route.name),
    value: 'new_courses',
    logo: 'newCourses.png'
  },
  ...COURSE_OPTIONS
])
</script>

<style scoped>
.text-active {
  color: #a09c9c;
}
.blur-logo {
  opacity: 0.5;
}
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
</style>
