<template>
  <div>
    <p class="text-main-title" :style="{ 'font-weight': boldNumber, 'font-size': fontSize, 'line-height': lineHeight, color: color }">
      {{ title }}
    </p>
  </div>
</template>
<script>
export default {
  name: 'ParaStyle',
  props: {
    title: {
      type: String,
      required: false
    },
    fontSize: {
      type: String,
      required: false,
      default: '14px'
    },
    boldNumber: {
      required: false,
      default: 550
    },
    lineHeight: {
      type: Number,
      required: false,
      default: 1.8
    },
    color: {
      type: String,
      required: false,
      default: '#1C1D1F'
    }
  }
}
</script>
<style scoped>
.text-main-title {
}
</style>
