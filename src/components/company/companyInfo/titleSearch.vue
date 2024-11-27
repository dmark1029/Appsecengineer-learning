<template>
  <div class="row no-wrap q-gutter-lg justify-between" :class="!dropDown ? 'reverse' : ''">
    <q-btn-dropdown v-if="dropDown" color="primary" label="Create User">
      <q-list>
        <q-item clickable v-close-popup @click="emitShowCreate">
          <q-item-section>
            <q-item-label>
              <div class="text-subtitle1">Create user</div>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="emitShowPopWindow">
          <q-item-section>
            <q-item-label>
              <div class="text-subtitle1">Import users</div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <div>
      <BaseBtn v-if="createBtn" color="green-12" label="Create" @click="emitShowCreate" padding="10px 10px" />
    </div>
    <div>
      <BaseInput
        v-if="showSearch"
        dense
        color="red"
        outlined
        placeholder="Search..."
        width="100%"
        style="width: 100%"
        @keyup.enter="emitSearchData"
        v-model="search"
        clearable
        @clear="emitClearSearchData"
      >
        <template v-slot:append>
          <q-separator color="grey-10" vertical class="q-ma-sm" />
          <q-icon name="search" @click="emitSearchData" />
        </template>
      </BaseInput>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'titleSearch',
  props: {
    createBtn: { type: Boolean, default: false, required: false },
    dropDown: { type: Boolean, default: true, required: false },
    modelValue: { type: String },
    showSearch: { type: Boolean, default: true, required: false },
    tokenBtn: { type: Boolean, default: false, required: false }
  },
  emits: ['update:modelValue', 'showCreate', 'showPopWindow', 'showAccessToken', 'searchData', 'clearSearchData'],
  setup(props, { emit }) {
    const search = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })

    const emitShowCreate = () => {
      emit('showCreate', { show: true })
    }

    const emitShowPopWindow = () => {
      emit('showPopWindow', true)
    }

    const emitSearchData = () => {
      emit('searchData')
    }

    const emitClearSearchData = () => {
      emit('clearSearchData')
    }

    return {
      search,
      emitShowCreate,
      emitShowPopWindow,
      emitSearchData,
      emitClearSearchData
    }
  }
}
</script>
