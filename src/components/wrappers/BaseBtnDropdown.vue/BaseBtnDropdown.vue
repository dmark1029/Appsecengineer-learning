<template>
  <q-btn-dropdown v-bind="$attrs" :flat="flat" class="base-btn-dropdown" bordered :text-color="textActiveColorLabel">
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
  </q-btn-dropdown>
</template>
<script>
import { useQuasar } from 'quasar'
import { useSlots } from 'src/composables/use-slots'
import { computed } from 'vue'
export default {
  name: 'BaseBtnDropdown',
  inheritAttrs: false,

  props: {
    flat: {
      type: Boolean,
      default: true
    },
    activeDropdownColor: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { slots }) {
    const $q = useQuasar()

    const textActiveColorLabel = computed(() => {
      if (!props.activeDropdownColor) return undefined
      return $q.dark.isActive ? 'primary' : 'indigo'
    })

    return {
      slots: useSlots(slots),
      textActiveColorLabel
    }
  }
}
</script>
<style lang="scss">
.base-btn {
  &.bg-dark {
    border: 1px solid $green-10;
  }
}
</style>
