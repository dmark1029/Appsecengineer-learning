<template>
  <div>
    <q-select
      :disable="disabled"
      :dense="densed"
      filled
      outlined
      clearable
      menu-self="top left"
      use-input
      :label="title"
      :autofocus="autofocus"
      multiple
      :error="errorStatus"
      :required="required"
      @filter="filterFn"
      @filter-abort="abortFilterFn"
      :options="options"
      :loading="loading"
      v-model="selected"
    >
      <template v-slot:after-options v-if="showMore">
        <q-item align="center">
          <q-item-section @click="onScroll" class="text-white" style="cursor: pointer">
            <label v-if="loading">...</label>
            <label v-else>
              <q-btn color="primary" size="sm" :label="`Load more`" />
            </label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:error>
        <p class="ase-md portal_bold error_msg_color none-spacing">{{ errorMessage }}</p>
      </template>
    </q-select>
  </div>
</template>
<script>
export default {
  name: 'MultipleSelect',
  props: {
    modelValue: {
      required: false
    },
    loading: {
      required: false,
      type: Boolean,
      default: false
    },
    densed: {
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
    },
    disabled: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  watch: {
    selectOption: {
      handler() {}
    }
  },
  data() {
    return {
      selectOption: null,
      componentKey: 1,
      opts: []
    }
  },
  methods: {
    filterFn(val, update, abort) {
      if (val) {
        const needle = val.toLowerCase()
        this.selectOption = this.options.filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
      }
      if (val.length === 0 || val === null) {
        this.selectOption = this.options
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
    onScroll() {
      this.$emit('paginatedData')
    },
    abortFilterFn() {}
  },
  computed: {
    selected: {
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
