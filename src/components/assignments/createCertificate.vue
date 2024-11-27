<template>
  <div>
    <BaseDialog v-model="showDialog" persistent :title="title" @close="onCancel">
      <q-card-section>
        <div class="text-center">Note: Once certificate details are filled they can't be modified. Please fill the details carefully.</div>
      </q-card-section>

      <q-form greedy @submit.prevent="onSubmit()">
        <q-card-section class="q-pt-none">
          <q-list class="row">
            <q-item class="col-md-4 col-sm-6 col-xs-12">
              <q-item-section>
                <BaseSelect
                  label="Duration Type *"
                  :options="durationTypeOptions"
                  :rules="required"
                  v-model="certificateObj.duration_type"
                />
                <p v-if="assignmentStore.errorCertificate.duration_type" class="text-caption text-negative">
                  {{ assignmentStore.errorCertificate.duration_type_msg }}
                </p>
              </q-item-section>
            </q-item>
            <q-item class="col-md-4 col-sm-6 col-xs-12">
              <q-item-section>
                <BaseInput label="Duration *" :min="1" required :rules="min(1)" type="number" v-model="certificateObj.duration" />
                <p v-if="assignmentStore.errorCertificate.duration" class="text-caption text-negative">
                  {{ assignmentStore.errorCertificate.duration_msg }}
                </p>
              </q-item-section>
            </q-item>
            <q-item class="col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                <BaseInput
                  label="Expiry Date"
                  :options="(date) => date >= todayDateValueAsPerQuasarDate()"
                  type="date"
                  v-model="certificateObj.expiry_date"
                />
                <p v-if="assignmentStore.errorCertificate.expiry_date" class="text-caption text-negative">
                  {{ assignmentStore.errorCertificate.expiry_date_msg }}
                </p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseInput label="Enter description *" required :rules="required" type="textarea" v-model="certificateObj.description" />
                <p v-if="assignmentStore.errorCertificate.description" class="text-caption text-negative">
                  {{ assignmentStore.errorCertificate.description_msg }}
                </p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseInput label="Criteria *" type="textarea" v-model="certificateObj.criteria" required :rules="required" />
                <p v-if="assignmentStore.errorCertificate.criteria" class="text-caption text-negative">
                  {{ assignmentStore.errorCertificate.criteria_msg }}
                </p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseInput
                  hint="Enter any search query and click send button. Eg: DevSecOps, Docker, AWS etc..."
                  label="Search skills. After completing this course assignment user will have knowledge about this skills."
                  sendButton
                  v-model="querySearch"
                  @send="searchQueryData"
                />
                <p v-if="queriedSkillsData?.length === 0 && assignmentStore.errorCertificate.skills" class="text-caption text-negative">
                  Please type skills and click on fire buttom
                </p>
              </q-item-section>
            </q-item>
            <q-item class="col-12" v-if="queriedSkillsData?.length > 0">
              <q-item-section>
                <BaseSelect
                  :hint="!certificateObj.skills?.length ? 'Note: At least one skill should be selected' : ''"
                  label="Select skills *"
                  multiple
                  :options="queriedSkillsData"
                  :rules="required"
                  v-model="certificateObj.skills"
                  option-label="label"
                  option-key="value"
                />
                <p v-if="assignmentStore.errorCertificate.skills" class="text-caption text-negative">
                  {{ assignmentStore.errorCertificate.skills_msg }}
                </p>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            class="text-subtitle1 ase-roboto text-weight-medium"
            color="secondary"
            :disable="!certificateObj.duration_type || !certificateObj.duration || !certificateObj.skills?.length || isSaving"
            :loading="isSaving"
            size="md"
            type="submit"
          >
            Save
          </q-btn>
        </q-card-actions>
      </q-form>
    </BaseDialog>
  </div>
</template>

<script setup>
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import { todayDateValueAsPerQuasarDate, urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { min, required } from 'src/utils/rules'
import { useAssignmentStore } from 'src/store/pinia/assignment'
import { defineComponent, onBeforeMount, ref, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

defineComponent({
  name: 'CreateCertificatePage'
})

const props = defineProps(['id', 'show'])
const emit = defineEmits(['onCacel'])

const route = useRoute()

const assignmentStore = useAssignmentStore()

const showDialog = shallowRef(props.show)
const title = shallowRef('Fill certificate details')
const querySearch = shallowRef('')
const queriedSkillsData = ref([])
const certificateObj = ref({
  criteria: '',
  description: '',
  duration: []
})
const durationTypeOptions = ref(['Hour', 'Day', 'Week', 'Month', 'Year'])
const isSaving = shallowRef(false)

onBeforeMount(() => {
  const errorMsgs = {
    status: false,
    duration_type: false,
    duration_type_msg: '',
    duration: false,
    duration_msg: '',
    description: false,
    description_msg: '',
    skills: false,
    skills_msg: ''
  }
  assignmentStore.setErrorCertificate(errorMsgs)
})

async function onSubmit() {
  isSaving.value = true
  const data = {
    assign_id: urlSafeBase64Decode(route.params.assignmentId),
    description: certificateObj.value.description,
    duration: parseInt(certificateObj.value.duration),
    duration_type: certificateObj.value.duration_type
  }

  if (certificateObj.value.expiry_date) {
    data.expiry_date = certificateObj.value.expiry_date.replace(/\//g, '-')
  }

  if (certificateObj.value.criteria) {
    data.criteria = certificateObj.value.criteria
  }

  if (certificateObj.value.skills?.length > 0) {
    data.skills = certificateObj.value.skills.map((skill) => ({
      title: skill.label,
      skillId: skill.value,
      languageCode: skill.languageCode
    }))
  }

  await assignmentStore.createCompanyCertificate(data)

  if (assignmentStore.statusOfAssignmentAPI === true) {
    await assignmentStore.fetchCompanyAssignmentGet({
      assign_id: urlSafeBase64Decode(route.params.assignmentId),
      extra: 'a_'
    })
    emit('onCacel', { show: true })
    certificateObj.value = {
      description: '',
      duration: 0,
      duration_type: null,
      skills: []
    }
  }
  isSaving.value = false
}

function onCancel() {
  emit('onCacel', { show: false })
}

async function searchQueryData() {
  await assignmentStore.fetchSkillsQueryData({ query: querySearch.value, startIndex: 0, length: 80 })
  queriedSkillsData.value = assignmentStore.skillsInfo.map((skillData) => ({
    label: skillData.title,
    value: skillData.skillId,
    languageCode: skillData.languageCode,
    skillId: skillData.skillId
  }))
}
</script>
