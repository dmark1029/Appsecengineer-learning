<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  subTitle: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="top-jumbotron full-width bg-night-blue column items-center q-pt-lg q-px-lg q-pb-md">
    <h4 class="text-white font-paytone q-mt-none q-mb-lg text-center">{{ title }}</h4>
    <p class="text-white text-center">
      {{ subTitle }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.top-jumbotron {
  border-radius: 12px;
  p {
    font-size: 20px;
    width: 85%;
  }
}
</style>
