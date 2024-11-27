<template>
  <div>
    <q-input
      outlined
      :dense="densed"
      :filled="filled"
      :value="name"
      :autofocus="autofocus"
      :maxlength="maxLength"
      reverse-fill-mask
      :mask="maskType"
      bottom-slots
      @update:modelValue="$emit('update:name', $event)"
      :hint="hintMessage"
      :required="required"
      :type="typeOfField"
      :error="errorStatus"
      :label="title"
    >
      <template v-slot:error>
        <p class="portal_sm portal_bold error_msg_color none-spacing">{{ errorMessage }}</p>
      </template>
    </q-input>
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
    densed: {
      required: false,
      type: Boolean,
      default: true
    },
    name: {
      required: false,
      type: String,
      default: ''
    },
    filled: {
      required: false,
      type: Boolean,
      default: false
    },
    errorMessage: {
      required: false,
      type: String,
      default: ''
    },
    typeOfField: {
      required: false,
      type: String,
      default: 'text'
    },
    hintMessage: {
      required: false,
      type: String,
      default: ''
    },
    errorStatus: {
      required: false,
      type: Boolean,
      default: false
    },
    maskType: {
      required: false,
      type: String,
      default: 'N'
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
