<template>
  <div>
    <q-dialog v-model="showDialog" persistent @escape-key="confirmCancel()">
      <q-card style="width: 600px; max-width: 80vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Please provide email</div>
          <q-space />
        </q-card-section>
        <q-separator />
        <q-card-section>Are you sure to resend codes ?</q-card-section>
        <q-separator />
        <q-card-actions align="right" class="text-primary">
          <q-btn
            label="No"
            push
            type="submit"
            size="14px"
            color="primary"
            style="width: 80px"
            class="float-left"
            @click="confirmCancel()"
          />
          <q-btn
            label="Submit"
            push
            type="submit"
            size="14px"
            color="primary"
            style="width: 150px"
            class="float-left"
            :loading="loadingStatus"
            @click="confirmSubmit()"
          >
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Loading...
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'ConfirmCodesPopupLinkInfo',
  props: ['show', 'errorStatus', 'errorStatusMsg', 'loadingStatus'],
  data() {
    return {
      showDialog: this.show
    }
  },
  methods: {
    confirmSubmit() {
      this.$emit('confirmSubmit', { show: true })
    },
    confirmCancel() {
      this.$emit('confirmCancel', { show: true })
    }
  }
}
</script>
