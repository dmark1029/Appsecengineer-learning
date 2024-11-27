<template>
  <div>
    <q-select
      :disable="disabled"
      :dense="densed"
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
      :options="selectOption"
      :loading="loading"
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
        <p class="portal_md portal_bold error_msg_color none-spacing">{{ errorMessage }}</p>
      </template>
    </q-select>
  </div>
</template>
<script>
export default {
  name: 'MultipleSelectSearch',
  props: {
    selected: {
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
      this.selectOption = this.options
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
    onScroll() {
      this.$emit('paginatedData')
    },
    abortFilterFn() {}
  }
}
</script>
