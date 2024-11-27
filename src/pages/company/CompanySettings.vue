<template>
  <BaseCard class="br-4 column q-py-sm q-px-lg">
    <div class="row col-12 q-col-gutter-lg q-my-sm">
      <div class="col-9">
        <chart-section
          :monthlyStats="fetchMonthlyStats"
          :weeklyStats="fetchWeeklyStats"
          :loadingIconData="isLoading"
          :topCourses="fetchTopCoursesGetter"
          v-if="!isLoading"
        />
        <q-inner-loading :showing="isLoading" label="Loading Chart..." label-class="text-teal" label-style="font-size: 1.1em" />
      </div>
      <div class="col-3 q-mt-sm">
        <div class="text-subtitle1 q-mb-sm">About</div>
        <StatisticCard :stats="statistics"></StatisticCard>
      </div>
    </div>

    <q-dialog v-model="addUsersPopup" persistent>
      <q-card flat class="q-pa-sm" style="width: 800px; max-width: 90vw" transition-show="flip-up" transition-hide="flip-down">
        <div class="q-py-sm">
          <q-bar class="bg-white none-spacing">
            <p class="text-subtitle1 ase-roboto ase-black-shade none-spacing text-weight-medium">User's count</p>
            <q-space />
            <q-btn
              class="ase-roboto text-caption"
              icon="close"
              :no-caps="false"
              round
              size="sm"
              :style="{ background: '#FF754C', color: '#fff', display: 'inline-block' }"
              @click="addUsersPopup = false"
            />
          </q-bar>
        </div>
        <q-separator></q-separator>
        <q-form @submit="onSubmit()" class="q-gutter-md">
          <div class="row justify-center q-pa-md">
            <div class="col-12" align="right"></div>
            <div class="col-12">
              <BaseInput label="Total user's count" :min="1" :max="20" type="number" v-model="usersCount" />
              <p v-if="fetchErrorMsgsCompanyUsers.pass_percentage" class="text-caption text-negative">
                {{ fetchErrorMsgsCompanyUsers.pass_percentage_msg }}
              </p>
            </div>
            <div class="col-12">
              <q-card-actions align="right">
                <q-btn class="text-capitalize bg-primary text-white" @click="onCancelCount()">Cancel</q-btn>
                <q-btn class="text-capitalize bg-primary text-white" type="submit">Save</q-btn>
              </q-card-actions>
            </div>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </BaseCard>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useLoginStore } from 'src/store/pinia/login'

import BaseInput from 'components/shared/BaseInput.vue'
import { QSpinnerFacebook, useQuasar } from 'quasar'
import config from 'src/config'
import { checkout } from 'src/utils/checkout'
import StatisticCard from 'src/components/common/StatisticCard.vue'
import ChartSection from 'components/reports/chartSection.vue'
import { useAnalyticsStatsStore } from 'src/store/pinia/analyticsStats'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'

export default {
  components: { BaseInput, StatisticCard, ChartSection },
  setup() {
    const loginStore = useLoginStore()

    const companyUsersStore = useCompanyConsumerStore()
    const fetchUserInfo = computed(() => loginStore.fetchUserInfo)
    const isCompanyAdmin = computed(() => loginStore.isCompanyAdmin)
    const isSubs = computed(() => loginStore.isSubs)
    const parentUser = computed(() => loginStore.parentUser)
    const analyticsStore = useAnalyticsStatsStore()

    const addUsersPopup = ref(false)
    const usersCount = ref(0)

    const $q = useQuasar()

    const isLoading = computed(() => companyUsersStore.isLoading)
    const getCompanyInfo = computed(() => companyUsersStore.companyInfo)
    const fetchErrorMsgsCompanyUsers = computed(() => companyUsersStore.errorMsgsCompanyUsers)

    const fetchCompanyInfo = () => companyUsersStore.fetchCompanyInfo()
    const checkPlansInfo = () => companyUsersStore.checkPlansInfo()

    const rollbackSettings = () => {
      store.commit('rollbackSettingsData', {
        show: true
      })
    }

    const addUsers = () => {
      if (!getCompanyInfo.value.name) {
        //isStatus(true)
        fetchCompanyInfo()
      }
      usersCount.value = getCompanyInfo.value.totalUsers
      addUsersPopup.value = true
    }

    const onSubmit = async () => {
      const payload = {
        email: fetchUserInfo.value.email,
        quantity: usersCount.value,
        item_price_id: getCompanyInfo.value.priceId
      }
      try {
        await checkout(config.baseURLEnterprise, payload)
        //isStatus(true)
        fetchCompanyInfo()
        addUsersPopup.value = false
      } catch (err) {
        const errorMsg = err.errorMsgs.custom_msg
        const notify = {
          message: `${errorMsg}`,
          color: 'negative',
          position: 'top'
        }
        store.commit('showNotification', notify)
      }
    }

    const onCancelCount = () => {
      usersCount.value = getCompanyInfo.value.totalUsers
      addUsersPopup.value = false
    }

    onMounted(() => {
      if (parentUser.value) {
        const dataInfo = checkPlansInfo()
        dataInfo.then((subInfo) => {})
      }

      //isStatus(true)
      fetchCompanyInfo()
      usersCount.value = getCompanyInfo.value.totalUsers

      analyticsStore.fetchCompanyStatsAction(true)
    })

    watch(
      () => isLoading.value,
      (newVal) => {
        if (newVal) {
          $q.loading.show({
            spinner: QSpinnerFacebook,
            spinnerColor: 'white',
            spinnerSize: 140,
            message: 'Hang on...',
            messageColor: 'white'
          })
        } else {
          $q.loading.hide()
        }
      }
    )

    const statistics = computed(() => {
      return [
        {
          title: 'Company Name',
          count: getCompanyInfo.value?.name || '-'
        },
        {
          title: 'Subscription Start Date',
          count: getCompanyInfo.value.startDate || 0
        },
        {
          title: 'Subscription End Date',
          count: getCompanyInfo.value.endDate || 0
        },
        {
          title: 'Total Users',
          count: getCompanyInfo.value.totalUsers || 0
        },
        {
          title: 'Users Registered',
          count: getCompanyInfo.value.activeUsers || 0
        },
        {
          title: 'Remaining Users',
          count: getCompanyInfo.value.remainingUsers || 0
        }
      ]
    })

    const fetchMonthlyStats = computed(() => analyticsStore.monthlyStats)
    const fetchWeeklyStats = computed(() => analyticsStore.weeklyStats)
    const fetchTopCoursesGetter = computed(() => analyticsStore.topCourses)

    watch(isLoading, (value) => {
      if (value) {
        $q.loading.show({
          spinner: QSpinnerFacebook,
          spinnerColor: 'white',
          spinnerSize: 140,
          message: 'Hang on...',
          messageColor: 'white'
        })
      } else {
        $q.loading.hide()
      }
    })
    return {
      fetchUserInfo,
      isCompanyAdmin,
      isSubs,
      parentUser,
      addUsersPopup,
      usersCount,
      isLoading,
      getCompanyInfo,
      fetchErrorMsgsCompanyUsers,
      rollbackSettings,
      addUsers,
      onSubmit,
      onCancelCount,
      statistics,
      fetchMonthlyStats,
      fetchWeeklyStats,
      fetchTopCoursesGetter,
      companyUsersStore
    }
  }
}
</script>
