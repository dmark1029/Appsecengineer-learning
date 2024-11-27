<template>
  <BaseCard class="q-pa-md">
    <div class="row padding_12">
      <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div class="q-mb-md">
          <q-btn
            class="none-spacing text-weight-bold ase-roboto cursor_pointer"
            :style="{ background: '#11142D', color: '#fff', display: 'inline-block' }"
            size="sm"
            label="Back"
            icon="arrow_back"
            @click="$emit('backToChallenge')"
          >
            <q-tooltip>Challenge Info</q-tooltip>
          </q-btn>
        </div>
        <div v-if="data.name" class="text-subtitle2 text-weight-regular">
          <label class="text-weight-bold">Name</label>
          : {{ data.name }}
        </div>
        <div v-if="data.description">
          <p class="text-subtitle2 text-weight-regular" style="text-align: justify">
            <label class="text-weight-bold">Description</label>
            : {{ data.description }}
          </p>
        </div>
        <div v-if="data.difficulty" class="text-subtitle2 ase-roboto text-weight-regular">
          <label class="text-weight-bold">Proficiency</label>
          :
          <q-chip
            color="green"
            class="text-subtitle1 ase-roboto"
            text-color="white"
            style="font-size: 12px; padding: 7px"
            v-if="data.difficulty"
          >
            {{ data.difficulty }}
          </q-chip>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
<script setup>
import { defineComponent } from 'vue'

defineComponent({
  name: 'SolutionHeader'
})

defineProps(['data'])
</script>
