<template>
  <div class="bg-indigo-gradiant relative-position full-width row items-center notify-area">
    <div class="col-md-1 col-sm-2 col-12 q-px-md full-height">
      <q-img src="/icons/badge.svg" style="scale: 2; min-width: 50px; max-height: 70px" height="100%" fit="fill" />
    </div>
    <div class="col-md-11 col-sm-10 col-12 full-height column align-center justify-center text-white info_area">
      <h6 class="avenir-bold q-my-none">New Badge Achieved!</h6>
      <p class="q-mb-none">
        You have achieved XYZ Challenge Badge &nbsp; | &nbsp;
        <span style="text-decoration: underline" class="cursor-pointer" @click="$router.push({ path: '/portal/profile/achievements' })">
          view all my achievements
        </span>
        <q-icon name="chevron_right" size="xs" />
      </p>
    </div>
    <q-btn
      aria-label="Notification close button"
      flat
      icon="close"
      rounded
      color="white"
      size="sm"
      class="absolute-top-right q-mt-sm"
      @click="emit('close')"
    />
  </div>
</template>

<script setup>
import { defineModel } from 'vue'

const emit = defineEmits('close')
</script>

<style lang="scss" scoped>
.notify-area {
  border-radius: 0.8rem !important;
  min-height: 80px;
  height: min-content;
}

@media (max-width: 620px) {
  .info_area {
    padding: 2.5rem 0.2rem;
    text-align: center;
  }
}
</style>
