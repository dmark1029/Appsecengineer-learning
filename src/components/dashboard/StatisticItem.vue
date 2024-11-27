<template>
  <div class="column justify-center bordered_info text-center">
    <p class="text-subtitle2 none-spacing ase-black-shade ase-roboto">
      {{ title }}
      <q-icon
        v-if="editAction"
        name="edit"
        size="xs"
        color="primary"
        class="cursor-pointer"
        @click="$emit('addUsers')"
        style="color: red"
      ></q-icon>
    </p>
    <p class="text-h6 none-spacing ase-orange ase-roboto">
      {{ count }}
    </p>
    <q-tooltip anchor="bottom middle" self="bottom middle" v-if="tootlipTitle">{{ tootlipTitle }}</q-tooltip>

    <slot></slot>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue'

defineComponent({
  name: 'StatisticItem'
})

defineProps(['title', 'count', 'editAction', 'tootlipTitle'])
</script>

<style scoped lang="scss">
.bordered_info {
  background: #fff;
  border: 2px solid #eaeaea;
  border-radius: 8px;
  box-shadow: inset 0px, 1px rgba(0, 0, 0, 0.05);
  padding: 18px;
  transition: all 0.2s ease-in-out;
}
</style>
