<template>
  <slot :name="`template-sidebar-mini-${item.name}`">
    <q-item class="cursor_pointer mini-item" :to="{ name: item.route }" role="menuitem">
      <q-avatar
        size="50px"
        class="sidebar-link-item radius-style-full q-hoverable"
        :class="{ 'bg-indigo-gradiant ': $route.name === item.route, 'bg-dark-1': $q.dark.isActive }"
      >
        <q-img :src="`/newIcons/${item.img}.png`" height="40px" width="40px" fit="fill" style="scale: 1" />
        <q-tooltip class="text-subtitle2 text-weight-bold ase-roboto" anchor="center right" self="center left">
          {{ item.label }}
        </q-tooltip>
      </q-avatar>
    </q-item>
  </slot>
</template>

<script setup>
import { useQuasar } from 'quasar'

defineProps({
  item: { type: Object, required: true, default: () => {} }
})

const $q = useQuasar()
</script>

<style lang="scss">
.sidebar-link-item {
  background-color: $light-gray;
  &:hover {
    background-color: $iron;
  }
}

.mini-item {
  .q-focus-helper {
    display: none !important;
  }
}
</style>
