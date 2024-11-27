<template>
  <q-card class="column full-height bg-green-10 text-white card verify-card">
    <q-card-section class="col q-gutter-md">
      <q-icon name="workspace_premium" size="25px" color="white" class="col-2"></q-icon>
      <div class="text-title col-grow">{{ name }} (Basic)</div>
      <div class="text-weight-bolder col-2" outline>Verified</div>
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
.verify-card {
  width: 95px;
  border-radius: 0px;
}
</style>
