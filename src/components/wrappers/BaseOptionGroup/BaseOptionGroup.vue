<template>
  <q-option-group v-bind="$attrs" class="q-br-4 q-px-lg text-subtitle1 baseoption-group" :class="computedClasses">
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
  </q-option-group>
</template>
<script>
import { useQuasar } from 'quasar'
import { useSlots } from 'src/composables/use-slots'
import { computed } from 'vue'
export default {
  name: 'BaseOptionGroup',
  inheritAttrs: false,
  props: {
    optionClass: {
      type: String,
      default: 'bordered'
    }
  },
  setup(props, { slots }) {
    const $q = useQuasar()
    const computedClasses = computed(() => {
      return [
        {
          'bg-grey-6': !$q.dark.mode
        },
        {
          bordered: props.optionClass
        }
      ]
    })
    return {
      slots: useSlots(slots),
      computedClasses
    }
  }
}
</script>
<style lang="scss">
.baseoption-group {
  .q-checkbox__bg {
    color: white;
    border: 1px solid #6a6a6a;
  }
  .q-checkbox__svg {
    padding: 2px;
    color: $text-color;
  }
}
</style>
