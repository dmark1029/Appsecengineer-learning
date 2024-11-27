<template>
  <div>
    <q-input
      outlined
      :value="name"
      :autofocus="autofocus"
      :maxlength="maxLength"
      :rules="[(val) => val.length <= maxLength - 1 || `Please use maximum ${maxLength} characters`]"
      @update:modelValue="$emit('update:name', $event)"
      :required="required"
      :label="title"
    ></q-input>
  </div>
</template>
<script>
export default {
  props: {
    required: {
      required: false,
      type: Boolean,
      default: false
    },
    name: {
      required: false,
      type: String,
      default: ''
    },
    title: {
      required: false,
      type: String,
      default: 'Name'
    },
    autofocus: {
      required: false,
      type: Boolean,
      default: false
    },
    maxLength: {
      required: false,
      type: Number,
      default: 251
    }
  }
}
</script>
