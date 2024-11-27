<template>
  <BaseDialog v-model="isCreateMode" @close="onCacel()" :title="title">
    <q-form greedy @submit="onSubmit()">
      <q-card-section class="q-pa-sm">
        <q-list>
          <q-item>
            <q-item-section>
              <BaseInput autofocus :maxLength="50" label="Name *" required :rules="[...minLength(2), ...maxLength(50)]" v-model="name" />
              <p v-if="companyUserTeamsStore.errorCompanyTeam.team_name" class="text-caption text-negative">
                {{ companyUserTeamsStore.errorCompanyTeam.team_name_msg }}
              </p>
              <div align="right">
                <BaseBtn color="primary" label="Submit" type="submit" />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-form>
  </BaseDialog>
</template>

<script>
import BaseInput from 'components/shared/BaseInput.vue'
import { QSpinnerFacebook } from 'quasar'
import { maxLength, minLength } from 'src/utils/rules'

import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useCompanyTeam } from 'src/store/pinia/company/team'

export default {
  name: 'CreateCompanyTeamInfo',
  // components: { BaseInput },

  props: ['id', 'isCreate', 'title'],
  setup() {
    const companyUserTeamsStore = useCompanyUserTeamsStore()
    const companyTeamStore = useCompanyTeam()
    return { companyUserTeamsStore, companyTeamStore }
  },
  data() {
    return {
      isCreateMode: this.isCreate,
      name: '',
      customFormFieldsArray: [],
      maxLength,
      minLength
    }
  },
  watch: {
    'companyUserTeamsStore.teamInfo': {
      handler() {
        this.name = this.companyUserTeamsStore.teamInfo.name
        if (this.companyUserTeamsStore.teamInfo.customFields.length > 0) {
          this.customFormFieldsArray = [...this.companyUserTeamsStore.teamInfo.customFields]
        }
      }
    },
    'companyUserTeamsStore.isLoading': {
      handler() {
        if (this.companyUserTeamsStore.isLoading) {
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
    addCustomfields() {
      this.customFormFieldsArray.push({ key: '', value: '' })
    },
    async onSubmit() {
      const testKey = this.customFormFieldsArray.filter(function (creature) {
        return creature.key === 'team_name' || creature.key === 'sk'
      })
      if (testKey.length > 0) {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: 'provide valid custom attribute must not contain sk and team_name'
        })
      }
      const data = {
        team_name: this.name
      }
      const addedCustomFields = []
      if (this.customFormFieldsArray.length > 0) {
        this.customFormFieldsArray.forEach((arrayData) => {
          if (arrayData.key && arrayData.value && arrayData.key !== 'team_name' && arrayData.key !== 'sk') {
            data[arrayData.key] = arrayData.value
            addedCustomFields.push(arrayData.key)
          }
        })
      }
      if (this.id) {
        const differenceData = this.differenceArrayData(addedCustomFields)
        if (differenceData.length > 0) {
          data.rfields = differenceData
        }
      }
      //await this.isStatus(true)
      if (this.id) {
        data.team_id = this.id
        if (this.companyUserTeamsStore.teamInfo.name === data.team_name) {
          delete data.team_name
        }
        if (Object.keys(data).length > 1) {
          await this.companyTeamStore.updateCompanyTeam(data)
        } else {
          //await this.isStatus(false)
        }
      } else {
        await this.companyUserTeamsStore.createCompanyTeam(data)
        await this.companyTeamStore.fetchCompanyTeam()
      }
      this.team = {}
      if (this.companyUserTeamsStore.statusOfTeamAPI.status) {
        this.$emit('onCacel', { show: false })
      } else {
        this.$emit('onCacel', { show: true })
      }
    },
    onCacel() {
      this.companyUserTeamsStore.errorMsgReset({ team_name: false, team_name_msg: '' })
      this.$emit('onCacel', { show: true })
      this.companyUserTeamsStore.clearCreateTeamErrors({ status: false, data: '', info: [], message: '' })
    },
    differenceArrayData(addedFields) {
      const getDataInfo = this.companyUserTeamsStore.teamInfo.validationFields
      const newlyAdded = addedFields
      const differenceData = []
      getDataInfo.forEach((data) => {
        if (newlyAdded.indexOf(data) <= -1) {
          differenceData.push(data)
        }
      })
      return differenceData
    }
  }
}
</script>
