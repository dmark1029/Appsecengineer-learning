<template>
  <div>
    <BaseCard class="q-pa-md q-my-lg br-4 bt-p" :class="{ 'bg-grey-12': !$q.dark.isActive }">
      <div class="flex items-center justify-between">
        <div class="text-subtitle1 column">
          <div>{{ username }}</div>
          {{ emailInfo }}
        </div>
      </div>
    </BaseCard>
    <div class="row q-col-gutter-lg">
      <div class="col-xs-9 col-sm-9 col-md-9 col-lg-9">
        <CompanyIndividualUserContent :email="email" :username="usernameData" :idOfHeatMap="'IDOFINDUSER'" />
      </div>
      <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
        <div class="text-subtitle1">Statistics</div>
        <StatisticCard :stats="statistics" />
        <div class="q-py-md">
          <BaseCard bordered>
            <q-card-actions class="q-pa-md">
              <div>Recent Activities</div>
            </q-card-actions>
            <q-separator />
            <UserRecentActivites
              :recentActivities="companyUsersStore.recentActivitiesData"
              v-if="!companyUsersStore.isLoading && companyUsersStore.recentActivitiesData.length"
            />
            <div v-else-if="!companyUsersStore.isLoading">
              <q-card-section>
                <span class="center">
                  <div class="text-subtitle1 text-center">No recent activities</div>
                </span>
              </q-card-section>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CompanyIndividualUserContent from 'components/reports/CompanyIndividualUserContent.vue'
import { QSpinnerFacebook } from 'quasar'

import StatisticCard from 'src/components/common/StatisticCard.vue'
import UserRecentActivites from '../company/UserRecentActivites.vue'
import { useLabStore } from 'src/store/pinia/lab'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'
export default {
  name: 'ProfileUser',
  components: { CompanyIndividualUserContent, StatisticCard, UserRecentActivites },
  props: ['email', 'usernameData'],
  setup() {
    const labStore = useLabStore()
    const companyUsersStore = useCompanyConsumerStore()
    return { labStore, companyUsersStore }
  },
  data() {
    return {
      emailInfo: this.email,
      username: this.usernameData
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
  created() {
    const data = {
      email: this.email
    }
    //this.isStatus(true)
    this.companyUsersStore.fetchUserDashboardAnalytic({ user_id: this.email })
    this.companyUsersStore.fetchUserActiveCourses(data)
    this.companyUsersStore.fetchUserCompletedCourses(data)
    this.companyUsersStore.recentActivities({ user_id: this.email })
  },
  methods: {
    viewCoursePage(event) {
      this.$router.push(event.url)
    },
    gotoMyCourses() {
      this.$router.push({ name: 'courses' })
    },
    routerUrlPath(path) {
      this.$router.push(path)
    }
  },
  computed: {
    statistics() {
      return [
        {
          title: 'Completed mins',
          count: this.companyUsersStore.userAnalyticInfo?.courseMinutes || 0
        },
        {
          title: 'Enrolled Courses',
          count: this.companyUsersStore.userAnalyticInfo?.activeCourses || 0
        },
        {
          title: 'Completed Labs',
          count: this.companyUsersStore.userAnalyticInfo?.completedLabs || 0
        },
        {
          title: 'Badges Earned',
          count: this.companyUsersStore.userAnalyticInfo?.badges || 0
        },
        {
          title: 'Completed Challenges',
          count: this.companyUsersStore.userAnalyticInfo?.completedChallenges || 0
        }
      ]
    }
  }
}
</script>
<style scoped>
.bordered_style {
  padding: 12px;
  border: 1px solid #f2f2f2;
  border-radius: 0px;
}
</style>
