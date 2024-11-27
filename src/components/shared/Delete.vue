<template>
  <BaseDialog v-model="showDialog" persistent :title="title" @close="confirmDeleteCancel()">
    <q-card-section>
      <div class="q-my-md text-center text-h6">Are you sure {{ header }}?</div>
    </q-card-section>
    <q-separator />
    <q-card-actions align="right">
      <BaseBtn color="primary" :loading="loading" :disable="loading" @click="confirmDelete()">Yes</BaseBtn>
    </q-card-actions>
  </BaseDialog>
</template>

<script>
export default {
  name: 'Delete',
  props: {
    show: {
      type: Boolean
    },
    header: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Quit'
    },
    loading: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      showDialog: this.show
    }
  },
  methods: {
    confirmDelete() {
      this.$emit('confirmDelete', { show: true })
    },
    confirmDeleteCancel() {
      this.$emit('confirmDeleteCancel', { show: true })
    }
  }
}
</script>
