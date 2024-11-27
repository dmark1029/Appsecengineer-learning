<template>
  <slot :name="`template-sidebar-${item.name}`">
    <q-item
      :class="[adminItem ? 'item-border q-my-sm' : 'sidebar-link-item', $q.dark.isActive && !adminItem ? 'bg-dark-1' : '']"
      class="q-py-sm"
      clickable
      v-ripple
      :to="{ name: item.route }"
      role="menuitem"
    >
      <q-item-section side>
        <q-img :src="`/newIcons/${item.img}.png`" height="40px" width="40px" fit="fill" style="scale: 1.2" />
      </q-item-section>
      <q-item-section>
        <div class="sidebar-item-label text-subtitle1" :class="labelClases">{{ item.label }}</div>
      </q-item-section>
    </q-item>
  </slot>
</template>

<script setup>
import { useQuasar } from 'quasar'

defineProps({
  item: { type: Object, required: true, default: () => {} },
  iconSize: { default: 'sm', type: String },
  iconClasses: { type: String },
  labelClases: { type: String },
  adminItem: {
    type: Boolean,
    default: () => false
  }
})

const $q = useQuasar()
</script>

<style lang="scss">
.sidebar-link-item {
  background-color: $light-gray;
}

.item-border {
  border-radius: 6px;
}
</style>
