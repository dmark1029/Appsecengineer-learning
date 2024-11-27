<template>
  <q-input
    type="number"
    outlined
    dense
    :value="name"
    :min="min"
    :max="max"
    @update:modelValue="$emit('update:name', $event)"
    :label="title"
  />
</template>
<script>
export default {
  name: 'Number',
  props: {
    name: {
      required: false,
      default: undefined
    },
    title: {
      required: false,
      type: String,
      default: 'Number'
    },
    min: {
      required: false,
      type: Number
    },
    max: {
      required: false,
      type: Number
    },
    autofocus: {
      required: false,
      type: Boolean,
      default: false
    }
  }
}
</script>
