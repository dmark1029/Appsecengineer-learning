<template>
  <div>
    <q-page>
      <div class="row">
        <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <dashboard-header></dashboard-header>
        </div>
      </div>
      <br />
      <div class="row">
        <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <dashboard-content></dashboard-content>
        </div>
      </div>
    </q-page>
  </div>
</template>
<script>
import CompanyIndividualUserContent from 'components/company/CompanyIndividualUserContent.vue'
import CompanyIndividualUserHeader from 'components/company/CompanyIndividualUserHeader.vue'
import { QSpinnerFacebook } from 'quasar'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'

export default {
  name: 'CompanyIndividualUserInfo',
  components: {
    'dashboard-header': CompanyIndividualUserHeader,
    'dashboard-content': CompanyIndividualUserContent
  },
  setup() {
    const companyUsersStore = useCompanyConsumerStore()
    return { companyUsersStore }
  },
  created() {
    const data = {
      email: urlSafeBase64Decode(this.$route.params.email)
    }
    //this.isStatus(true)
    this.companyUsersStore.fetchUserDashboardAnalytic({ user_id: urlSafeBase64Decode(this.$route.params.email) })
    this.companyUsersStore.fetchUserActiveCourses(data)
    this.companyUsersStore.fetchUserCompletedCourses(data)
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
    viewCoursePage(event) {
      this.$router.push(event.url)
    },
    gotoMyCourses() {
      this.$router.push({ name: 'courses' })
    }
  }
}
</script>
