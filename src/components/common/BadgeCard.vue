<template>
  <q-card class="bg-primary text-white row items-center justify-center q-pa-sm badge-card">
    <q-card-section class="column items-center justify-center flex-column q-gutter-md">
      <q-icon name="report_problem" color="yellow" size="30px" />
      <div class="caption text-center">{{ name }}</div>
      <q-rating name="quality" :value="+star" max="5" size="1em" color="yellow" icon="star_border" icon-selected="star" no-dimming />
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    star: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.badge-card {
  max-width: 130px;
}
</style>
