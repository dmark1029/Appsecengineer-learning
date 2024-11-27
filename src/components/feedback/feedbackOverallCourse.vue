<template>
  <div>
    <BaseDialog v-model="showOverviewMuttable" title="Feedback" @close="confirmClose">
      <q-form @submit.prevent="confirmSubmit" v-if="!feedbackInfoOverview.data">
        <q-card-section>
          <p class="portal_xlg padding_top_7">How would you rate this course ?</p>
          <q-field stack-label :model-value="rating" :rules="[...between(1, 5)]" dense borderless>
            <template v-slot:control>
              <q-rating
                name="quality"
                max="5"
                size="5em"
                color="yellow"
                icon="star_border"
                icon-selected="star"
                align="center"
                no-dimming
                v-model="rating"
              />
            </template>
          </q-field>
        </q-card-section>
        <q-card-section>
          <p class="portal_xlg">Is there anything else you'd like to share about this course ?</p>
          <base-input
            outlined
            rounded
            square
            filled
            :autofocus="false"
            placeholder="Description"
            type="textarea"
            v-model="name"
            :rules="required"
          />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="text-primary">
          <BaseBtn color="primary" label="Submit" type="submit" :loading="feedBackStore.isLoading" />
        </q-card-actions>
      </q-form>
      <q-card-section v-else>
        <p class="text-center text-subtitle1">Feedback submitted. Thank you!</p>
        <div align="right">
          <BaseBtn label="Cancel" @click="confirmClose()" />
        </div>
      </q-card-section>
    </BaseDialog>
  </div>
</template>

<script setup>
import { useFeedbackStore } from 'src/store/pinia/feedback'
import { required, between } from 'src/utils/rules'
import { computed, defineComponent } from 'vue'

import BaseInput from 'components/shared/BaseInput.vue'

defineComponent({
  name: 'FeedBackFormOverall'
})

const props = defineProps([
  'showOverview',
  'modelValue',
  'ratingOverview',
  'feedbackInfoOverview',
  'confirmSubmitOverview',
  'confirmCloseOverview'
])

const emit = defineEmits(['update:modelValue', 'update:ratingOverview', 'confirmSubmitOverview', 'confirmCloseOverview'])

const feedBackStore = useFeedbackStore()

function confirmSubmit() {
  emit('confirmSubmitOverview', { show: true })
}
function confirmClose() {
  emit('confirmCloseOverview', { show: false })
}

const showOverviewMuttable = computed({
  get: function () {
    return props.showOverview
  },
  set: function (value) {
    emit('update:showOverviewMuttable', value)
  }
})

const name = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const rating = computed({
  get() {
    return props.ratingOverview
  },
  set(value) {
    emit('update:ratingOverview', value)
  }
})
</script>
