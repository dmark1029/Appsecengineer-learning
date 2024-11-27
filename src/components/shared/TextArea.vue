<template>
  <div>
    <q-input
      outlined
      dense
      :value="name"
      :autofocus="autofocus"
      @update:modelValue="$emit('update:name', $event)"
      :rules="required ? [(val) => !!val || 'Field is required'] : []"
      type="textarea"
      :label="title"
    ></q-input>
  </div>
</template>
<script>
export default {
  name: 'TextArea',
  props: {
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
    required: {
      required: false,
      type: Boolean,
      default: false
    }
  }
}
</script>
