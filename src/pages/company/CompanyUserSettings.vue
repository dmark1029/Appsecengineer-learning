<template>
  <div>
    <div class="text-subtitle1 q-mb-md">User Settings</div>
    <q-card class="br-4 q-pa-md">
      <q-list>
        <q-item class="column">
          <div class="text-subtitle1">Add Fields</div>
          <div class="text-muted">
            These custom fields will reflect on the users creation page and also will show on the user reports. Example: Role, Designation,
            etc
          </div>
        </q-item>
      </q-list>
      <q-list v-if="fetchCustomUserFields.c_attrs?.length > 0">
        <q-item>
          <q-item-section side top>
            <div align="right">
              <q-btn round class="gt-xs cursor_pointer" color="red" size="sm" @click="enableDelete" icon="delete">
                <q-tooltip>Delete all custom attributes</q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
      </q-list>

      <q-form greedy @submit.prevent="onSubmit()">
        <q-item v-for="(experience, index) in customFormFieldsArray" :key="index">
          <q-item-section class="bordered">
            <div class="row q-col-gutter-md q-pa-md">
              <div class="col-md-3 col-sm-12">
                <BaseSelect :clearable="false" label="Attribute Type" :options="keyTypes" v-model="experience.keydropdown" />
              </div>
              <div class="col-md-4 col-sm-12">
                <BaseInput dense :maxLength="50" label="Attribute name *" required v-model="experience.key" />
                <div v-if="errorMsgsUserCustomUser[experience.key] && !experience.value" class="text-caption text-negative">
                  {{ errorMsgsUserCustomUser[experience.key + '_msg'] }}
                </div>
              </div>
              <div class="col-md-5 col-sm-12 row">
                <div class="col-10">
                  <BaseSelect
                    v-if="experience.keydropdown === 'DropDown'"
                    hint="Once you create press enter to add another"
                    label="Attribute value"
                    v-model="experience.values_list"
                    use-input
                    use-chips
                    multiple
                    hide-dropdown-icon
                    new-value-mode="add-unique"
                    :rules="[(val) => val?.length || 'Minimum 1 options is required']"
                  />
                </div>
                <div v-if="customFormFieldsArray.length > 1" class="col-2 q-pa-sm" align="right">
                  <q-btn color="red" icon="remove" round size="xs" @click="removeCustomfields(index)" />
                </div>
              </div>
            </div>
          </q-item-section>
        </q-item>
        <q-item class="column">
          <div class="row justify-between">
            <q-btn color="primary" icon="add" round @click="addCustomfields">
              <q-tooltip>Add Custom fields</q-tooltip>
            </q-btn>
            <q-btn
              color="green-12"
              type="submit"
              v-if="customFormFieldsArray.length > 0 && fieldsEnabled && customFormFieldsArray.length > 0 && customFormFieldsArray[0].key"
              align="right"
            >
              Save
            </q-btn>
          </div>
        </q-item>
      </q-form>
    </q-card>
    <template v-if="isDelete">
      <Delete
        :show="isDelete"
        :header="`to delete all custom attributes`"
        @confirmDelete="customConfirmDeletion($event)"
        @confirmDeleteCancel="isDelete = false"
      />
    </template>
  </div>
</template>

<script>
import BaseSelect from 'components/shared/BaseSelect.vue'
import Delete from 'components/shared/Delete.vue'
import { QSpinnerFacebook, useQuasar } from 'quasar'

import { ref, onMounted, computed } from 'vue'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'
export default {
  name: 'CompanyUserSettings',
  components: { Delete },

  setup() {
    const fieldsEnabled = ref(true)
    const isDelete = ref(false)
    const keyTypes = ref(['Text', 'DropDown'])
    const customFormFieldsArray = ref([{ keydropdown: 'Text', key: '', value: '', values_list: [] }])

    const $q = useQuasar()
    const companyUsersStore = useCompanyConsumerStore()

    const getCompanyInfo = computed(() => companyUsersStore.companyInfo)
    const errorMsgsUserCustomUser = computed(() => companyUsersStore.errorCompanyUserCustomFields)
    const fetchCustomUserFields = computed(() => companyUsersStore.companyUserCustomFields)
    onMounted(async () => {
      $q.loading.show({ loading: true })
      await companyUsersStore.fetchCompanyInfo()
      try {
        await companyUsersStore.fetchCompanyUserCustomFieldsData({ company_id: getCompanyInfo.value.id })

        if (fetchCustomUserFields.value.c_attrs?.length > 0) {
          fieldsEnabled.value = true
          customFormFieldsArray.value = fetchCustomUserFields.value.c_attrs.map((data) => ({
            keydropdown: fetchCustomUserFields.value.defaults[data] ? 'DropDown' : 'Text',
            key: data,
            value: data,
            values_list: fetchCustomUserFields.value.defaults[data] ? fetchCustomUserFields.value.defaults[data] : []
          }))
        }
      } catch (err) {
        //
      } finally {
        $q.loading.hide()
      }
    })

    function enableDelete() {
      isDelete.value = true
    }
    async function customConfirmDeletion(event) {
      $q.loading.show({
        message: 'Deleting'
      })
      if (event.show) {
        await companyUsersStore.deleteCompanyUserCustomFieldsData({})
        isDelete.value = false
        customFormFieldsArray.value = [{ keydropdown: 'Text', key: '', value: '', values_list: [] }]
        fieldsEnabled.value = true
      }

      $q.loading.hide()
    }
    function addCustomfields() {
      customFormFieldsArray.value.push({
        keydropdown: 'Text',
        key: '',
        value: '',
        values_list: []
      })
    }
    function removeCustomfields(index) {
      const slicedData = customFormFieldsArray.value
      slicedData.splice(index, 1)
      customFormFieldsArray.value = slicedData
    }
    async function onSubmit() {
      $q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: 'white',
        spinnerSize: 140,
        message: 'Hang on...',
        messageColor: 'white'
      })
      const err_msgs = {
        team_name: false,
        team_name_msg: '',
        manager: false,
        manager_msg: '',
        director: false,
        director_msg: '',
        vp: false,
        vp_msg: '',
        division: false,
        division_msg: ''
      }
      const testKey = customFormFieldsArray.value.filter(function (creature) {
        return creature.key === 'sk'
      })
      if (testKey.length > 0) {
        $q.notify({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: 'provide valid custom attribute must not contain sk '
        })
      }
      await companyUsersStore.errorMsgResetCustomFields(err_msgs)
      const data = {}
      const addedCustomFieldsDict = {}
      let c_attrs = []
      if (customFormFieldsArray.value.length > 0) {
        customFormFieldsArray.value.forEach((arrayData) => {
          if (arrayData.key && arrayData.key !== 'sk') {
            if (arrayData.keydropdown === 'Text' || arrayData.keydropdown === 'DropDown') {
              c_attrs.push(arrayData.key)
              if (arrayData.keydropdown === 'DropDown') {
                if (arrayData.values_list) {
                  if (arrayData.values_list.length > 0) {
                    addedCustomFieldsDict[arrayData.key] = arrayData.values_list
                  } else {
                    c_attrs = c_attrs.filter((e) => e !== arrayData.key)
                  }
                }
              }
            }
          }
        })
      }
      data.c_attrs = c_attrs
      if (Object.keys(addedCustomFieldsDict).length > 0 || Object.keys(addedCustomFieldsDict).length === 0) {
        data.defaults = addedCustomFieldsDict
      }
      if (fetchCustomUserFields.value.c_attrs?.length > 0) {
        if (data.c_attrs.length > 0) {
          try {
            await companyUsersStore.updateCustomFields(data)
            await companyUsersStore.fetchCompanyUserCustomFieldsData({ company_id: this.getCompanyInfo.id })
            if (fetchCustomUserFields.value.c_attrs.length > 0) {
              fieldsEnabled.value = true
              customFormFieldsArray.value = fetchCustomUserFields.value.c_attrs.map((data) => ({
                keydropdown: typeof fetchCustomUserFields.value.defaults[data] === 'object' ? 'DropDown' : 'Text',
                key: data,
                value: data,
                values_list: fetchCustomUserFields.value.defaults[data] ? fetchCustomUserFields.value.defaults[data] : []
              }))
            }
          } catch (err) {
            //
          }
        } else {
        }
      } else {
        await companyUsersStore.createCustomFields(data)
        await companyUsersStore.fetchCompanyUserCustomFieldsData({ company_id: getCompanyInfo.value.id })
      }
      $q.loading.hide()
    }
    return {
      fieldsEnabled,
      isDelete,
      keyTypes,
      customFormFieldsArray,
      getCompanyInfo,
      errorMsgsUserCustomUser,
      fetchCustomUserFields,
      enableDelete,
      addCustomfields,
      onSubmit,
      customConfirmDeletion,
      removeCustomfields,
      companyUsersStore
    }
  }
}
</script>

<style scoped>
.bordered_data {
  border: 1px solid rgb(236, 230, 230);
  box-shadow: 4px 4px solid grey;
}
</style>
