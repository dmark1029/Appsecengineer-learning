<template>
  <div>
    <div class="row">
      <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <q-card class="bg-transparent no-shadow no-border">
          <q-card-section class="q-pa-none">
            <div class="row q-col-gutter-sm">
              <div class="col-md-3 col-sm-12 col-xs-12">
                <q-item style="background-color: #2b2d7d; border-radius: 16px" class="q-ml-xs">
                  <q-item-section side style="background-color: #2b2d7d" class="q-pa-lg q-mr-none text-white">
                    <q-icon name="fas fa-users" color="white" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class="q-pa-md q-ml-none text-white">
                    <q-item-label class="text-white appsec-h1 text-weight-bolder">{{ maxUsers }}</q-item-label>
                    <q-item-label class="appsec-h2">Maximum Users</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-md-3 col-sm-12 col-xs-12">
                <q-item style="background-color: #2d3eba; border-radius: 16px" class="q-ml-xs">
                  <q-item-section side style="background-color: #2d3eba" class="q-pa-lg q-mr-none text-white">
                    <q-icon name="fas fa-user-tag" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class="q-pa-md q-ml-none text-white">
                    <q-item-label class="text-white appsec-h1 text-weight-bolder">{{ currentUsers }}</q-item-label>
                    <q-item-label class="appsec-h2">Current Users</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-md-3 col-sm-12 col-xs-12">
                <q-item style="background-color: #4969db; border-radius: 16px" class="q-ml-xs">
                  <q-item-section side style="background-color: #4969db" class="q-pa-lg q-mr-none text-white">
                    <q-icon name="fas fa-user" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class="q-pa-md q-ml-none text-white">
                    <q-item-label class="text-white appsec-h1 text-weight-bolder">{{ remainingUsers }}</q-item-label>
                    <q-item-label class="appsec-h2">Remaining Users</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-md-3 col-sm-12 col-xs-12">
                <q-item style="background-color: #5a8dea; border-radius: 16px" class="q-ml-xs q-mr-xs">
                  <q-item-section side style="background-color: #5a8dea" class="q-pa-lg q-mr-none text-white">
                    <q-icon name="fas fa-calendar-day" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class="q-pa-md q-ml-none text-white">
                    <q-item-label class="text-white appsec-h1 text-weight-bolder">{{ endDate }}</q-item-label>
                    <q-item-label class="appsec-h2">End Date</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'headerSectionReport',
  props: ['maxUsers', 'currentUsers', 'remainingUsers', 'endDate'],
  computed: {}
}
</script>
