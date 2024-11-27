<template>
  <div class="row none-spacing">
    <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
      <q-btn
        color="green"
        class="ase-roboto text-weight-bold"
        no-caps
        push
        label="Verify Challenge"
        size="sm"
        @click="$emit('verifyLab', { show: true })"
      />
    </div>
  </div>
</template>
<script setup>
import { defineComponent } from 'vue'

defineComponent({
  name: 'verifyLab'
})
</script>
