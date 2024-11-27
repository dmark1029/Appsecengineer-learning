<template>
  <q-file v-bind="$attrs" ref="file">
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
  </q-file>
</template>
<script>
import { useSlots } from 'src/composables/use-slots'
export default {
  name: 'BaseFile',
  inheritAttrs: true,
  setup(_, { slots }) {
    return {
      slots: useSlots(slots)
    }
  }
}
</script>
<style></style>
