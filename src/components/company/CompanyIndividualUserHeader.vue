<template>
  <div>
    <q-card class="bg-transparent no-shadow no-border">
      <q-card-section class="q-pa-none">
        <div class="row q-col-gutter-sm">
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-item style="background-color: #2b2d7d; border-radius: 16px" class="q-ml-xs">
              <q-item-section side style="background-color: #2b2d7d" class="q-pa-lg q-mr-none text-white">
                <q-icon name="fas fa-clock" color="white" size="24px"></q-icon>
              </q-item-section>
              <q-item-section class="q-pa-md q-ml-none text-white">
                <q-item-label class="text-white appsec-h1 text-weight-bolder">
                  {{ companyUsersStore.userAnalyticInfo.courseMinutes }}
                </q-item-label>
                <q-item-label class="appsec-h2">Completed Minutes</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-item style="background-color: #2d3eba; border-radius: 16px" class="q-ml-xs">
              <q-item-section side style="background-color: #2d3eba" class="q-pa-lg q-mr-none text-white">
                <q-icon name="fas fa-user-tag" size="24px"></q-icon>
              </q-item-section>
              <q-item-section class="q-pa-md q-ml-none text-white">
                <q-item-label class="text-white appsec-h1 text-weight-bolder">
                  {{ companyUsersStore.userAnalyticInfo.activeCourses }}
                </q-item-label>
                <q-item-label class="appsec-h2">Enrolled Courses</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-item style="background-color: #4969db; border-radius: 16px" class="q-ml-xs">
              <q-item-section side style="background-color: #4969db" class="q-pa-lg q-mr-none text-white">
                <q-icon name="fas fa-user-graduate" size="24px"></q-icon>
              </q-item-section>
              <q-item-section class="q-pa-md q-ml-none text-white">
                <q-item-label class="text-white appsec-h1 text-weight-bolder">{{ companyUsersStore.userAnalyticInfo.badges }}</q-item-label>
                <q-item-label class="appsec-h2">Badges Earned</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-item style="background-color: #5a8dea; border-radius: 16px" class="q-ml-xs q-mr-xs">
              <q-item-section side style="background-color: #5a8dea" class="q-pa-lg q-mr-none text-white">
                <q-icon name="fas fa-flask" size="24px"></q-icon>
              </q-item-section>
              <q-item-section class="q-pa-md q-ml-none text-white">
                <q-item-label class="text-white appsec-h1 text-weight-bolder">
                  {{ companyUsersStore.userAnalyticInfo.completedLabs }}
                </q-item-label>
                <q-item-label class="appsec-h2">Completed Labs</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'
export default {
  name: 'CompanyIndividualUserHeader',
  setup() {
    const companyUsersStore = useCompanyConsumerStore()
    return { companyUsersStore }
  }
}
</script>
