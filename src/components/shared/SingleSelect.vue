<template>
  <div>
    <q-select
      outlined
      dense
      clearable
      :value="selected"
      use-input
      :disable="disabled"
      :label="title"
      hide-selected
      fill-input
      input-debounce="0"
      :autofocus="autofocus"
      @update:modelValue="$emit('update:selected', $event)"
      :options="selectOption"
      :rules="required ? [(val) => !!val || 'Field is required'] : []"
      @filter="filterFn"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            <p class="text-h4 text-weight-bold ase-roboto ase-black-light line-height-normal padding_12">No data</p>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>
<script>
export default {
  name: 'SingleSelect',
  props: {
    selected: {
      required: false
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
    disabled: {
      required: false,
      type: Boolean,
      default: false
    },
    options: {
      required: true,
      type: Array
    },
    required: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectOption: null
    }
  },
  methods: {
    filterFn(val, update, abort) {
      if (val) {
        const needle = val.toLowerCase()
        this.selectOption = this.options.filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
      }
      if (this.selectOption !== null) {
        update()
        return
      }

      setTimeout(() => {
        update(() => {
          this.$emit('findOptions', { show: true })
          this.selectOption = this.options
        })
      }, 1000)
    },

    abortFilterFn() {}
  }
}
</script>
