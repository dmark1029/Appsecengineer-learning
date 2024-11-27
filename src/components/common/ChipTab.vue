<template>
  <div
    class="chipTab full-width row items-center justify-evenly full-width row q-px-sm no-wrap"
    :class="{
      'dark-border-1': $q.dark.isActive,
      smaller: smallerText
    }"
  >
    <template v-for="(item, index) in items" :key="index">
      <div class="avenir-bold row no-wrap items-center" :style="{ padding: '2px 0' }">
        <q-img :src="`/newIcons/${item.img}.png`" fit="fill" height="1.5rem" width="1.5rem" />
        <p class="q-ma-none q-ml-sm chip-label" :class="[$q.dark.isActive ? 'aqua-green-text' : 'text-electric-indigo']">
          {{ item.label }}
        </p>
      </div>
      <q-separator v-if="index + 1 !== items.length" color="grey" class="q-mx-sm" vertical />
    </template>
  </div>
</template>
<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

defineProps({
  items: {
    type: Array,
    default: () => []
  },
  smallerText: {
    type: Boolean,
    default: false
  }
})
</script>
<style lang="scss" scoped>
.chipTab {
  height: max-content !important;
  border-radius: 1rem;
  min-width: min-content !important;
  border: 1px solid $grey;
  .chip-label {
    text-wrap: nowrap;
    font-size: 0.7rem;
  }
  &.smaller {
    .chip-label {
      font-size: 11px;
    }
  }
}
</style>
