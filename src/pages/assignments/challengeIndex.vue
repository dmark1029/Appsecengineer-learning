<template>
  <div class="viewPages">
    <AssignmentData></AssignmentData>
  </div>
</template>
<script>
import AssignmentData from './challengeAssignmentIndex.vue'

export default {
  name: 'challengeIndex',
  components: {
    AssignmentData: AssignmentData
  },
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
    async rollbackSettings() {
      this.$emit('rollbackSettingsData', {
        show: true
      })
      await this.$router.push({ name: 'company.settings' })
    },
    routingData(value) {
      this.routingType = value
    }
  },
  computed: {}
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;600&display=swap');
.login_title {
  color: #05008c;
  text-align: left;
  font: normal normal bold 40px/52px Poppins;
}
.centerAlignmentDiv {
  position: relative;
  top: 20%;
  height: 80vh;
  background-image: radial-gradient(circle, #f5f5fc 20%, #ffffff 100%);
}
.bg_color {
  background-image: radial-gradient(circle, #f5f5fc 20%, #ffffff 100%);
}
.login_form_style {
  width: 80%;
  background: #f3f3fd;
  padding: 5%;
  box-shadow: 10px 10px 30px #5451e124;
  border-radius: 18px;
  opacity: 1;
}
.login_btn {
  background: #00ffba 0% 0% no-repeat padding-box;
  border-radius: 4px;
  font-size: 14px;
  padding: 7px;
  color: #05008c;
  border: #00ffba;
  font-weight: 900;
}
.bg_color_dark {
  background-color: #121212;
}
</style>
