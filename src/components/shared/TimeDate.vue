<template>
  <div>
    <q-input
      :disable="disabled"
      clearable
      outline
      bordered
      dark
      dense
      filled
      :hint="date ? '' : 'YYYY-MM-DD'"
      mask="YYYY-MM-DD HH:mm"
      :hide-hint="true"
      :value="date"
      :label="title"
      :error="errorStatus"
      @update:modelValue="$emit('date', $event)"
      :autofocus="autofocus"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date
              dense
              mask="YYYY-MM-DD HH:mm"
              :value="date"
              :options="optionsFn"
              :hide-hint="true"
              @update:modelValue="$emit('date', $event)"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" text-color="black" flat />
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
  data() {
    return {}
  },
  methods: {
    optionsFn(date) {
      return DateComparison(date, new Date())
    },
    testData(event) {}
  }
}
</script>
