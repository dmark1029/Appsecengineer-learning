<template>
  <div>
    <q-input
      :disable="disabled"
      clearable
      outline
      bordered
      dense
      filled
      mask="####-##-##"
      :fill-mask="false"
      :hint="date ? '' : 'YYYY-MM-DD'"
      :hide-hint="true"
      :label="title"
      :error="errorStatus"
      @update:modelValue="$emit('date', $event)"
      :autofocus="autofocus"
      v-model="date"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date dense mask="YYYY-MM-DD" :options="optionsFn" :hide-hint="true" v-model="date">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="white" text-color="black" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
      <template v-slot:error>
        <p class="error_msg_color none-spacing" style="font-size: 12px">{{ errorMessage }}</p>
      </template>
    </q-input>
  </div>
</template>
<script>
import { DateComparison } from 'src/utils/reuseFunctions'
export default {
  name: 'Date',
  props: {
    modelValue: {
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
    },
    errorStatus: {
      required: false,
      type: Boolean,
      default: false
    },
    errorMessage: {
      required: false,
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {}
  },
  methods: {
    optionsFn(date) {
      return DateComparison(date, new Date())
    },
    testData(event) {}
  },
  computed: {
    date: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.q-btn-override {
  background-color: #ffffff !important;
  color: #ffffff !important;
  &:hover {
    background-color: #ffffff !important;
    color: #ffffff !important;
  }
  &:focus,
  &:active {
    background-color: #ffffff !important;
    color: #ffffff !important;
  }
}
.q-btn__wrapper {
  background-color: #ffffff !important;
}
</style>
