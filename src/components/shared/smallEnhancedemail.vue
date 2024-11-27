<template>
  <div>
    <q-input
      type="email"
      outlined
      :dense="densed"
      :value="name"
      :autofocus="autofocus"
      @update:modelValue="$emit('update:name', $event)"
      :error="errorStatus"
      :required="required"
      bottom-slots
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
  name: 'Email',
  props: {
    name: {
      required: false,
      type: String,
      default: ''
    },
    densed: {
      required: false,
      type: Boolean,
      default: true
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
    },
    required: {
      required: false,
      type: Boolean,
      default: false
    },
    errorMessage: {
      required: false,
      type: String,
      default: ''
    },
    errorStatus: {
      required: false,
      type: Boolean,
      default: false
    }
  }
}
</script>
