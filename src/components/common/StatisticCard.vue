<template>
  <BaseCard class="q-py-xs q-pa-md statistic-card" flat>
    <q-card-section v-for="(stat, index) in stats" :key="index" class="stats q-my-md q-py-sm q-px-lg item" :class="{ active: index === 0 }">
      <div class="text-left">
        <div class="text-subtitle1">{{ stat.count }}</div>
        <div class="text-subtitle1">{{ stat.title }}</div>
      </div>
    </q-card-section>
  </BaseCard>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    stats: {
      type: Array,
      required: true,
      default: () => []
    }
  }
})
</script>

<style lang="scss">
.statistic-card {
  background-color: $grey-12;
  .item {
    background-color: white !important;
    &.active {
      background-color: $statistics-active-card !important;
    }
  }

  &.q-dark {
    background: $dark-page-color;

    .q-card__section {
      &.stats {
        background: $dark-body-color !important;
      }
    }
  }
}
</style>
