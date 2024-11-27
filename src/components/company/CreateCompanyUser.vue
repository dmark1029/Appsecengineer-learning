<template>
  <div class="row q-py-md">
    <div class="col-6">
      <BaseCard bordered class="br-4 q-py-md">
        <q-form greedy @submit="onSubmit()">
          <q-card-section>
            <slot></slot>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-md-6 col-sm-12">
                <BaseInput autofocus label="First Name *" :maxLength="50" required :rules="shortName" v-model="firstName" />
                <p v-if="errorMsgsUser.first_name" class="text-caption text-negative">{{ errorMsgsUser.first_name_msg }}</p>
              </div>
              <div class="col-md-6 col-sm-12">
                <BaseInput label="Last Name *" :maxLength="50" required :rules="shortName" v-model="lastName" />
                <p v-if="errorMsgsUser.last_name" class="text-caption text-negative">{{ errorMsgsUser.last_name_msg }}</p>
              </div>
              <div class="col-md-6 col-sm-12">
                <BaseInput label="Email *" required type="email" :rules="emailRule" v-model="email" />
                <p v-if="errorMsgsUser.email" class="text-caption text-negative">{{ errorMsgsUser.email_msg }}</p>
              </div>
              <q-item v-for="companyField in companyFieldsArray" class="col-md-6 col-sm-12" :key="companyField.key">
                <q-item-section>
                  <BaseSelect
                    v-if="companyField.keydropdown === 'Dropdown'"
                    :label="companyField.key"
                    :options="companyField.values_list"
                    v-model="companyField.value"
                  />
                  <BaseInput
                    v-if="companyField.keydropdown === 'Text'"
                    :maxLength="50"
                    :label="companyField.key + ' *'"
                    required
                    :rules="shortName"
                    v-model="companyField.value"
                  />
                  <p v-if="errorMsgsUser[companyField.key] && !companyField.value" class="text-caption text-negative">
                    {{ errorMsgsUser[companyField.key + '_msg'] }}
                  </p>
                </q-item-section>
              </q-item>
            </div>

            <div class="text-subtitle1 text-primary">
              * Once user is created it cannot be Modified or Deleted. Please fill the details carefully.
            </div>
          </q-card-section>
          <q-card-section class="q-gutter-x-sm">
            <BaseBtn color="primary" label="Cancel" @click="onCancel()" />
            <BaseBtn color="green-12" label="Submit" type="submit" />
          </q-card-section>
        </q-form>
      </BaseCard>
    </div>
  </div>
</template>

<script>
// import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import { email as emailRule, shortName } from 'src/utils/rules'
import { ref, computed, onMounted } from 'vue'

import { useQuasar } from 'quasar'
import { loader } from 'src/utils/helpers'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'
export default {
  name: 'CreateCompanyUserInfo',
  components: { BaseSelect },
  props: ['id', 'courseId', 'subjectId', 'dynamicFields'],

  setup(props, { emit }) {
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const companyFieldsArray = ref([])
    const user = ref({})

    const $q = useQuasar()
    const companyUsersStore = useCompanyConsumerStore()

    const getStatusCreateUserAPI = computed(() => {
      return companyUsersStore.statusOfUserAPI
    })

    const errorMsgsUser = computed(() => {
      return companyUsersStore.errorCompanyUser
    })

    onMounted(() => {
      companyFieldsArray.value = props.dynamicFields
    })

    async function onSubmit() {
      const data = {
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value
      }
      companyFieldsArray.value.map((dataField) => (data[dataField.key] = dataField.value))
      $q.loading.show(loader({}))
      await companyUsersStore.createNewUser(data)
      user.value = {}
      if (getStatusCreateUserAPI.value) {
        emit('onCacel', { show: true })
      }
      $q.loading.hide()
    }

    function onCancel() {
      user.value = {}
      const err_msgs = { first_name: false, first_name_msg: '', last_name: false, last_name_msg: '', email: false, email_msg: '' }
      companyUsersStore.errorMsgReset(err_msgs)
      emit('onCacel', { show: true })
    }

    return {
      firstName,
      lastName,
      email,
      companyFieldsArray,
      emailRule,
      shortName,
      getStatusCreateUserAPI,
      errorMsgsUser,
      onSubmit,
      onCancel,
      companyUsersStore
    }
  }
}
</script>

<style scoped></style>
