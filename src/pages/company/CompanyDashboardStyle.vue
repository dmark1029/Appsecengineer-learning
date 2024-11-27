<template>
  <div>
    <q-card class="card_style">
      <div class="row card_style_row" v-if="defaultSelect === 'all'">
        <div class="q-pa-xs col-xs-4 col-sm-4 col-md-4 col-lg-4">
          <div class="cursor_pointer sub_card_box card-line flex flex-center" @click="actionItem('user')">
            <div class="padding_7 text-center">
              <q-icon name="settings" class="icon_size" />
              <p class="ase-roboto text-subtitle1">User Settings</p>
            </div>
          </div>
        </div>
        <div class="q-pa-xs col-xs-4 col-sm-4 col-md-4 col-lg-4">
          <div class="cursor_pointer sub_card_box card-line flex flex-center" @click="actionItem('about')">
            <div class="padding_7 text-center">
              <q-icon name="fas fa-university" class="icon_size" />
              <p class="ase-roboto text-subtitle1">About</p>
            </div>
          </div>
        </div>
        <div class="q-pa-xs col-xs-4 col-sm-4 col-md-4 col-lg-4">
          <div class="cursor_pointer sub_card_box card-line flex flex-center" @click="actionItem('assignment')">
            <div class="padding_7 text-center">
              <q-icon name="fas fa-book" class="icon_size" />
              <p class="ase-roboto text-subtitle1">Assignments</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row"></div>
    </q-card>
  </div>
</template>
<script>
import { QSpinnerFacebook } from 'quasar'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'
export default {
  name: 'CompanyIndex',
  props: [],
  created() {},
  setup() {
    const companyUserTeamsStore = useCompanyUserTeamsStore()
    const companyUsersStore = useCompanyConsumerStore()
    return { companyUsersStore, companyUserTeamsStore }
  },
  data() {
    return {
      defaultSelect: 'all'
    }
  },
  watch: {
    'companyUsersStore.isLoading': {
      handler() {
        if (this.companyUsersStore.isLoading) {
          this.$q.loading.show({
            spinner: QSpinnerFacebook,
            spinnerColor: 'white',
            spinnerSize: 140,
            message: 'Hang on...',
            messageColor: 'white'
          })
        } else {
          this.$q.loading.hide()
        }
      }
    }
  },
  methods: {
    actionItem(value) {
      this.defaultSelect = value
      if (value === 'about') {
        this.$router.push({ name: 'company.settings' })
      }
      if (value === 'user') {
        this.$router.push({ name: 'company.user_settings' })
      }
      if (value === 'assignment') {
        this.$router.push({ name: 'company.assignments' })
      }
    },
    rollbackSettings(data) {
      this.defaultSelect = 'all'
    },
    rollbackSettingsData(data) {
      this.defaultSelect = 'all'
    }
  }
}
</script>
<style scoped>
.card_style {
  min-height: 80vh;
  padding: 1%;
}
.card_style_row {
  height: 80vh;
  padding: 5%;
}
.sub_card_box {
  padding: 5%;
  width: 95%;
  max-height: 100%;
}
.block_scope {
  display: block;
}
.inlineblock_scope {
  display: inline;
  float: left;
}
.icon_size {
  font-size: 32px;
}
.text_size_data {
  font-size: 22px;
}
</style>
