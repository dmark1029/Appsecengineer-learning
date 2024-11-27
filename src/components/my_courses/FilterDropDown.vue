<script setup>
defineProps({
  label: {
    type: String,
    default: () => ''
  },
  textColor: {
    type: String,
    default: () => ''
  },
  options: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Array,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <BaseBtnDropdown class="radius-8 ase-roboto" no-caps :text-color="textColor" :label="label">
    <q-option-group
      :modelValue="modelValue"
      :options="options"
      size="sm"
      type="checkbox"
      class="ase-roboto portal_lg"
      active-color="text-active"
      color="grey-8"
      keep-color
      @update:modelValue="$emit('update:modelValue', $event)"
    >
      <template v-slot:label="opt">
        <div class="row items-center q-pr-sm">
          <q-avatar v-if="opt.logo" size="1.5em" :class="{}">
            <q-img
              :src="`filters/${opt.logo}`"
              :class="{
                'blur-logo': options.includes(opt.value)
              }"
            />
          </q-avatar>
          <span
            class="q-pl-xs"
            :class="{
              'text-active': options.includes(opt.value)
            }"
          >
            {{ opt.label }}
          </span>
        </div>
      </template>
    </q-option-group>
  </BaseBtnDropdown>
</template>
