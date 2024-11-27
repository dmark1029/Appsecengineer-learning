<template>
  <div>
    <q-input
      type="password"
      outlined
      :value="name"
      :autofocus="autofocus"
      @update:modelValue="$emit('update:name', $event)"
      :label="title"
    ></q-input>
  </div>
</template>
<script>
export default {
  name: 'Password',
  props: {
    name: {
      required: false,
      type: String,
      default: ''
    },
    title: {
      required: false,
      type: String,
      default: 'Email'
    },
    autofocus: {
      required: false,
      type: Boolean,
      default: false
    }
  }
}
</script>
