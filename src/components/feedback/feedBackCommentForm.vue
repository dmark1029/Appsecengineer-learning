<template>
  <div>
    <BaseDialog
      v-model="showDialog"
      persistent
      title="Help make your training awesome!"
      @close="confirmClose()"
      subtitle="Rate us. Takes less than 30 seconds"
    >
      <q-form @submit.prevent="confirmSubmit">
        <q-card-section>
          <div class="text-subtitle1">How would you rate this course ?</div>
          <q-field stack-label :model-value="feedBackRating" :rules="[...between(1, 5)]" dense borderless>
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
                v-model="feedBackRating"
              />
            </template>
          </q-field>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">Is there anything else you'd like to share about this course ?</div>
          <BaseInput
            outlined
            rounded
            square
            filled
            :autofocus="false"
            placeholder="Description"
            type="textarea"
            v-model="name"
            :rules="required"
            class="q-my-sm"
            bg-color="grey-12"
          />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <div align="right">
            <BaseBtn color="primary" label="Submit" type="submit" />
          </div>
        </q-card-actions>
      </q-form>
    </BaseDialog>
  </div>
</template>

<script>
import { required, between } from 'src/utils/rules'

export default {
  name: 'feedBackCommentForm',
  props: ['show', 'modelValue', 'rating', 'header'],
  emits: ['update:modelValue', 'update:rating', 'confirmSubmit', 'confirmClose'],
  data() {
    return {
      required,
      between
    }
  },
  methods: {
    confirmSubmit() {
      this.$emit('confirmSubmit')
    },
    confirmClose() {
      this.$emit('confirmClose')
    }
  },
  computed: {
    name: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    feedBackRating: {
      get() {
        return this.rating
      },
      set(value) {
        this.$emit('update:rating', value)
      }
    },
    showDialog: {
      get() {
        return this.show
      },
      set(value) {
        this.$emit('update:show', value)
      }
    }
  }
}
</script>
