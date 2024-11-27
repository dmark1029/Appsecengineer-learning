<template>
  <div class="row">
    <div class="q-pa-xs col-12">
      <p class="text-subtitle1 text-justify">
        {{ contentObject.description }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentInfoSectionPage',
  props: {
    contentObject: {}
  }
}
</script>

<style scoped>
p {
  white-space: pre-line;
}
</style>
