<template>
  <q-carousel v-bind="$attrs">
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
  </q-carousel>
</template>
<script>
import { useSlots } from 'src/composables/use-slots'
export default {
  name: 'BaseCarousel',
  inheritAttrs: false,
  setup(props, { slots }) {
    return {
      slots: useSlots(slots)
    }
  }
}
</script>
<style></style>
