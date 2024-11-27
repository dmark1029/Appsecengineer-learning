<template>
  <div>
    <q-input
      :disable="disabled"
      outlined
      dense
      clearable
      :value="date"
      :label="title"
      @update:modelValue="$emit('update:date', $event)"
      :autofocus="autofocus"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date mask="YYYY-MM-DD" :value="date" @update:modelValue="$emit('update:date', $event)">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>
<script>
export default {
  name: 'Date',
  props: {
    date: {
      required: false,
      default: ''
    },
    title: {
      required: false,
      type: String,
      default: 'Name'
    },
    disabled: {
      required: false,
      type: Boolean,
      default: false
    },
    autofocus: {
      required: false,
      type: Boolean,
      default: false
    }
  }
}
</script>
