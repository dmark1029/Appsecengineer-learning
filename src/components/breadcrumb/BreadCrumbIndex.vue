<template>
  <q-breadcrumbs
    class="text-grey"
    active-color="text-weight-bold"
    v-if="$route.name !== 'dashboard'"
    :class="{ 'no-pointer-events ': userActivity.isActivityDisabled }"
  >
    <template v-slot:separator>
      /
      <!-- <q-icon size="1.2em" name="slash" color="secondary" /> -->
    </template>
    <q-breadcrumbs-el
      :label="item.label"
      v-for="(item, index) in breadCrumbs"
      :key="index"
      @click="onRouteClick(item)"
      class="cursor-pointer"
    />
  </q-breadcrumbs>
</template>

<script>
import { useBreadcrumbsStore } from 'src/store/pinia/breadCrumb'
import { useUserActivity } from 'src/store/pinia/userActivity'
const breadCrumb = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    icon: 'home'
  }
]

export default {
  data() {
    return {
      levelList: '',
      breadCrumbList: [],
      sizeCol: 8,
      pathName: '',
      sizeColSub: 4
    }
  },
  methods: {
    onRouteClick(item) {
      if (this.$route.name === item.name) {
        return
      }
      this.$router.push({ name: item.name })
    }
  },
  computed: {
    breadCrumbs() {
      return [...breadCrumb, ...(this.$route?.meta?.breadCrumbs ?? []), ...this.breadCrumbStore.breadCrumb]
    }
  },
  setup() {
    const breadCrumbStore = useBreadcrumbsStore()
    const userActivity = useUserActivity()

    return {
      breadCrumbStore,
      userActivity
    }
  }
}
</script>
