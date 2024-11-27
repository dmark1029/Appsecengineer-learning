<template>
  <div>
    <BaseCard class="my-card">
      <q-list>
        <q-item>
          <q-item-section>
            <q-item-label overline>
              <div class="text-subtitle1 text-weight-bold">Title</div>
            </q-item-label>
            <q-item-label>
              <div class="text-subtitle1 none-spacing">
                {{ assignmentStore.assignmentInfo.details.title }}
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced inset />

        <q-item>
          <q-item-section>
            <q-item-label overline>
              <div class="text-subtitle1 text-weight-bold">Description</div>
            </q-item-label>
            <q-item-label>
              <div class="text-subtitle1 none-spacing">
                {{ assignmentStore.assignmentInfo.details.description }}
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
        <q-item>
          <q-item-section>
            <q-item-label overline>
              <div class="text-subtitle1 text-weight-bold">Duration</div>
            </q-item-label>
            <q-item-label>
              <div class="text-subtitle1">
                {{ `${assignmentStore.assignmentInfo.details.duration} ${assignmentStore.assignmentInfo.details.duration_type} (s)` }}
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced inset />

        <q-item>
          <q-item-section>
            <q-item-label overline>
              <div class="text-subtitle1 text-weight-bold">Skill set</div>
            </q-item-label>
            <q-item-label>
              <template v-for="(skill, index) in assignmentStore.assignmentInfo.details.skills">
                <q-chip outline color="primary" size="14px" v-if="skill" v-bind:key="skill + 'Dummy' + index">
                  {{ skill }}
                </q-chip>
              </template>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced inset />
        <template v-if="assignmentStore.assignmentInfo.details">
          <q-item v-if="typeof assignmentStore.assignmentInfo.details.status === 'string'">
            <q-item-section>
              <q-item-label overline>
                <div class="text-subtitle1 text-weight-bold">Status</div>
              </q-item-label>
              <q-item-label color="success">
                <q-btn color="green" size="md" dense>
                  <q-badge color="green">{{ assignmentStore.assignmentInfo.details.status }}</q-badge>
                </q-btn>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <q-separator spaced inset />
      </q-list>
    </BaseCard>
  </div>
</template>
<script>
import { dateFormatReadable } from 'src/utils/reuseFunctions'
import { useAssignmentStore } from 'src/store/pinia/assignment'
export default {
  name: 'CompanyAssignmentGetInfoDeliveryDetailsInfo',
  created() {},
  components: {},
  setup() {
    const assignmentStore = useAssignmentStore()
    return {
      assignmentStore
    }
  },
  watch: {},
  methods: {
    rollbackSettings() {
      this.$emit('rollbackSettingsData', {
        show: true
      })
    },
    updateDateFormatter(date) {
      return dateFormatReadable(date)
    }
  }
}
</script>
