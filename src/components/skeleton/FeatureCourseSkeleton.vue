<template>
  <div
    class="full-height basic-shadow row no-wrap q-pa-md bg-white skeleton-feature"
    :class="{ 'bg-dark-1 dark-border': $q.dark.isActive }"
  >
    <div style="min-height: 18rem; min-width: 18rem" class="c">
      <q-skeleton width="100%" height="100%" class="img-area" square style="border-radius: 8px" />
    </div>
    <div class="q-ml-md q-pr-md details">
      <div class="full-height column items-start justify-start">
        <q-skeleton type="QChip" width="40%" />
        <q-skeleton class="q-mt-md q-mb-sm" style="border-radius: 8px" width="100%" />
        <div class="row items-center full-width justify-between q-col-gutter-sm wrap q-mb-md q-mt-sm q-ml-sm">
          <q-skeleton type="QChip" width="39%" />
          <q-skeleton type="QChip" width="59%" />
        </div>
        <q-skeleton type="text" width="100%" />
        <q-skeleton type="text" width="100%" />
        <q-skeleton type="text" width="50%" />
        <div class="full-width row justify-end items-center q-mt-auto">
          <q-skeleton square width="45%" height="35px" style="border-radius: 8rem" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()
</script>

<style lang="scss">
.skeleton-feature {
  border-radius: 0.8rem;
  .details {
    width: 100%;
  }
  @media (max-width: 1024px) {
    flex-direction: column;

    height: min-content !important;
    .details {
      margin-left: 0 !important;
      margin-top: 1rem !important;
    }
    .img-area {
      height: 30rem !important;
    }
  }
}
</style>
