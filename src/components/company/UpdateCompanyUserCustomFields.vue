<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-sm">
      <div class="col-12">
        <q-card>
          <q-card-section class="text-h6">
            <div class="text-h6"><slot></slot></div>
          </q-card-section>
          <q-separator />
          <q-form greedy @submit="onSubmit()">
            <q-card-section class="q-pa-sm">
              <q-list class="row">
                <q-item class="col-md-6 col-sm-12">
                  <q-item-section>
                    <BaseInput autofocus label="First Name *" :maxLength="50" required :rules="shortName" v-model="firstName" />
                    <p v-if="companyUsersStore.errorCompanyUser.first_name" class="text-caption text-negative">
                      {{ companyUsersStore.errorCompanyUser.first_name_msg }}
                    </p>
                  </q-item-section>
                </q-item>
                <q-item class="col-md-6 col-sm-12">
                  <q-item-section>
                    <BaseInput label="Last Name *" :maxLength="50" required :rules="shortName" v-model="lastName" />
                    <p v-if="companyUsersStore.errorCompanyUser.last_name" class="text-caption text-negative">
                      {{ companyUsersStore.errorCompanyUser.last_name_msg }}
                    </p>
                  </q-item-section>
                </q-item>
                <q-item class="col-md-6 col-sm-12">
                  <q-item-section>
                    <BaseInput label="Email *" required type="email" :rules="emailRule" v-model="email" />
                    <p v-if="companyUsersStore.errorCompanyUser.email" class="text-caption text-negative">
                      {{ companyUsersStore.errorCompanyUser.email_msg }}
                    </p>
                  </q-item-section>
                </q-item>
              </q-list>
              <p class="text-bold text-caption text-center text-negative text-subtitle2">
                * Once user is created it cannot be Modified or Deleted. Please fill the details carefully.
              </p>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn class="text-capitalize bg-primary text-white ase-roboto ase-md" @click="onCancel()">Cancel</q-btn>
              <q-btn class="text-capitalize bg-primary text-white ase-roboto ase-md" type="submit">Save</q-btn>
            </q-card-actions>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import BaseInput from 'components/shared/BaseInput.vue'
import { email as emailRule, shortName } from 'src/utils/rules'

import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'

export default {
  name: 'CreateCompanyUserFields',
  components: { BaseInput },
  props: ['id', 'courseId', 'subjectId', 'dynamicFields'],
  setup() {
    const companyUsersStore = useCompanyConsumerStore()
    return { companyUsersStore }
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      companyFieldsArray: [],
      emailRule,
      shortName
    }
  },
  created() {
    this.companyFieldsArray = this.dynamicFields
  },
  methods: {
    async onSubmit() {
      const data = {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email
      }
      //this.isStatus(true)

      await this.companyUsersStore.createNewUser(data)
      this.user = {}
      if (this.companyUsersStore.statusOfUserAPI) {
        this.$emit('onCacel', { show: true })
      }
    },
    onCancel() {
      this.user = {}
      const err_msgs = { first_name: false, first_name_msg: '', last_name: false, last_name_msg: '', email: false, email_msg: '' }
      this.companyUsersStore.errorMsgReset(err_msgs)
      this.$emit('onCacel', { show: true })
    }
  }
}
</script>

<style scoped></style>
