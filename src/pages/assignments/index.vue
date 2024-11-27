<template>
  <div class="viewPages centerAlignmentAssignment">
    <div class="row justify-center">
      <div class="col-4 padding_12 cursor-pointer" @click="movePage('course')" align="middle">
        <q-card class="fit row content-center" style="min-height: 250px">
          <div class="col-sm-12">
            <q-icon name="fas fa-user-graduate" size="82px"></q-icon>
          </div>
          <div class="col-sm-12 text-subtitle1 padding_7 text-weight-regular">Course Assignment</div>
        </q-card>
      </div>
      <div class="col-4 padding_12 cursor-pointer" @click="movePage('challenge')" align="middle">
        <q-card class="fit row content-center" style="min-height: 250px">
          <div class="col-sm-12">
            <q-icon name="fas fa-user-graduate" size="82px"></q-icon>
          </div>
          <div class="col-sm-12 text-subtitle1 padding_7 text-weight-regular">Challenge Assignment</div>
        </q-card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      drawer: false,
      routingType: 'assignment'
    }
  },
  validations: {},
  created() {},
  watch: {},
  methods: {
    async movePage(data) {
      await this.$router.push(`/portal/company/${data}/assignments`)
    },
    routingData(value) {
      this.routingType = value
    }
  },
  computed: {}
}
</script>
<style scoped>
.centerAlignmentAssignment {
  display: table-cell;
  height: 80vh;
  margin: 0 auto;
  width: 100vw;
  vertical-align: middle;
  text-align: center;
}
</style>
