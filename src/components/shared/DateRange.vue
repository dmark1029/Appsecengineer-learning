<template>
  <div>
    <q-dialog v-model="showDialog" persistent @escape-key="confirmCancel()">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Date Range</div>
          <q-space />
          <q-btn icon="close" flat round color="white" @click="confirmCancel()" />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div align="center">
            <q-date style="width: 600px; max-width: 80vw;" no-unset navigation-min-year-month="2020/07" landscape mask=“YYYY/MM”
            class="text-white q-btn-override" v-model="date" />
          </div>
        </q-card-section>
        <br />
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
            label="Yes"
            push
            type="submit"
            size="14px"
            color="primary"
            style="width: 80px"
            class="float-left"
            @click="confirmSelect()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'DateRangeSelector',
  props: ['show', 'name', 'header'],
  data() {
    return {
      date: '',
      showDialog: this.show
    }
  },
  methods: {
    confirmSelect() {
      this.$emit('confirmSelect', { show: true, date: this.date })
    },
    confirmCancel() {
      this.date = ''
      this.$emit('confirmCancel', { show: true })
    }
  }
}
</script>

<style scoped lang="scss">
.q-btn-override {
  background-color: #ffffff !important;
  color: #ffffff !important;
  &:hover {
    background-color: #ffffff !important;
    color: #ffffff !important;
  }
  &:focus,
  &:active {
    background-color: #ffffff !important;
    color: #ffffff !important;
  }
}
</style>
