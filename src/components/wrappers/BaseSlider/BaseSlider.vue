<template>
  <q-slider v-bind="$attrs">
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
  </q-slider>
</template>
<script>
import { useSlots } from 'src/composables/use-slots'
export default {
  name: 'BaseSlider',
  inheritAttrs: false,
  setup(props, { slots }) {
    return {
      slots: useSlots(slots)
    }
  }
}
</script>
<style></style>
