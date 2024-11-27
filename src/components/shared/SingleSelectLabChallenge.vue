<template>
  <div>
    <q-select
      clearable
      dense
      fill-input
      hide-selected
      input-debounce="0"
      map-options
      options-selected-class="color-custom-orange"
      outlined
      use-input
      :disable="loadingData"
      :label="title"
      :loading="loadingData"
      :options="selectOption"
      :rules="required ? [(val) => !!val || 'Field is required'] : []"
      :value="selected"
      @filter="filterFn"
      :option-disable="(item) => (item.value ? optionsListData(item.value) : false)"
      @update:modelValue="$emit('update:selected', $event)"
    >
      <template v-slot:after-options v-if="showMore">
        <q-item>
          <q-item-section @click="loadMoreItems" class="text-center" style="cursor: pointer">
            <label v-if="loadingData">...</label>
            <label v-else>
              <q-btn color="primary" size="sm" :label="`Load more`" />
            </label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-red" style="cursor: pointer">No data</q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
export default {
  name: 'SingleSelectLabChallenge',
  props: {
    selected: { required: false },
    options: { required: true, type: Array },
    loadingData: { required: false, type: Boolean, default: false },
    required: { required: false, type: Boolean, default: false },
    showMore: { required: false, type: Boolean, default: true },
    title: { required: false, type: String, default: 'Name' },
    disabledList: { required: false, type: Array, default: () => [] }
  },
  data() {
    return {
      selectOption: this.options,
      text_loading: 'Load more',
      filterFalse: true,
      searchInfoLabel: '',
      searchDataVal: ''
    }
  },
  watch: {
    options: {
      handler(val) {
        this.selectOption = val
      }
    }
  },
  methods: {
    filterFn(val, update) {
      const needle = val.toLowerCase()
      this.selectOption = this.options.filter((v) => v.label.toLowerCase().indexOf(needle) > -1) || this.options
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
    async loadMoreItems() {
      this.filterFalse = true
      await this.$emit('loadMoreItems')
      //   this.filterFn()
    },
    optionsListData(value) {
      if (this.disabledList.length > 0) {
        const data = this.disabledList.map((data) => data.sk)
        if (data.includes(value)) {
          return true
        }
      }
    }
  }
}
</script>
