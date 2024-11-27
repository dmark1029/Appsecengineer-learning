<template>
  <div>
    <q-input
      :dense="densed"
      outlined
      :disable="disabled"
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
      :rules="rules"
    >
      <template v-slot:error>
        <p class="ase-md portal_bold error_msg_color none-spacing">{{ errorMessage }}</p>
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
      type: Boolean,
      default: false
    },
    rules: {
      required: false
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
    titleFalse: {
      required: false,
      type: Boolean,
      default: false
    },
    errorMessage: {
      required: false,
      type: String,
      default: ''
    },
    disabled: {
      required: false,
      type: Boolean,
      default: false
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
