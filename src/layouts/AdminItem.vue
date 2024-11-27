<template>
  <q-expansion-item class="none-spacing q-mx-md" transparent role="menuitem">
    <template v-slot:header>
      <q-item-section side>
        <q-img :src="`/newIcons/Admin.png`" height="40px" width="40px" fit="fill" style="scale: 1.2" />
      </q-item-section>
      <q-item-section>
        <div class="text-subtitle1">Admin</div>
      </q-item-section>
    </template>
    <q-item class="q-px-none">
      <q-list class="none-spacing s-list q-px-none" :style="{ width: '100%' }" dense>
        <q-list class="s-list">
          <SidebarItem
            v-for="(item, index) in adminItems"
            adminItem
            :item="item"
            iconClasses="padding_7"
            iconSize="xs"
            :key="index"
            labelClases="text-subtitle1 none-spacing"
          />
        </q-list>
      </q-list>
    </q-item>
  </q-expansion-item>
</template>

<script setup>
import SidebarItem from './SidebarItem.vue'

defineProps({
  adminItems: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang="scss">
.q-expansion-item__container {
  .q-item {
    border-radius: 6px;
  }
}
</style>
