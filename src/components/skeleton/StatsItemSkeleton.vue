<template>
  <div
    class="col-12 col-sm-6 ach-sections row items-center justify-between q-px-sm q-py-sm no-wrap"
    :class="{ 'bg-night-blue': $q.dark.isActive }"
  >
    <q-skeleton type="circle" />
    <q-skeleton style="border-radius: 8px" width="70%" height="70%" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()
</script>
