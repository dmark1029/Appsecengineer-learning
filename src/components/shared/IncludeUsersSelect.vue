<template>
  <div>
    <q-select
      filled
      outlined
      clearable
      menu-self="top left"
      :value="selected"
      use-input
      :label="title"
      :autofocus="autofocus"
      multiple
      :error="errorStatus"
      :required="required"
      @update:modelValue="$emit('update:selected', $event)"
      @filter="filterFn"
      @filter-abort="abortFilterFn"
      :options="filterOptions"
      :option-label="(item) => (item === null ? 'Null value' : item.email)"
      :option-value="(item) => (item === null ? null : item.email)"
      :loading="loading"
    >
      <template v-slot:error>
        <p class="ase-md portal_bold error_msg_color none-spacing">{{ errorMessage }}</p>
      </template>
      <template v-slot:no-option>
        <p class="ase-lg portal_bold text-center none-spacing padding_7">Added all users to team</p>
      </template>
    </q-select>
  </div>
</template>
<script>
export default {
  name: 'MultipleSelect',
  props: {
    selected: {
      required: false
    },
    loading: {
      required: false,
      type: Boolean,
      default: false
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
    options: {
      required: true,
      type: Array
    },
    showMore: {
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
  },
  watch: {
    selectOption: {
      handler() {}
    }
  },
  data() {
    return {
      selectOption: null,
      componentKey: 1,
      opts: [],
      filterOptions: this.options
    }
  },
  methods: {
    filterFn(val, update, abort) {
      update(() => {
        if (val === '') {
          this.filterOptions = this.options
        } else {
          const needle = val.toLowerCase()
          this.filterOptions = this.options.filter((v) => v.email.toLowerCase().indexOf(needle) > -1)
        }
      })
    },
    onScroll() {
      this.$emit('paginatedData')
    },
    abortFilterFn() {}
  }
}
</script>
