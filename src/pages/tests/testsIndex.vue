<template>
  <BaseCard class="br-4 column q-py-sm q-px-lg">
    <BaseCard class="q-pa-md" bordered v-if="!isCreate && !isDelete">
      <q-item>
        <q-item-section avatar>
          <q-avatar size="xl" class="bg-black text-white text-capitalize">
            {{ testsStore.testReportDetails.name?.[0] || testsStore.testReportDetails.name }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="ellipsis text-h6">
            {{ testsStore.testReportDetails.name }}
          </q-item-label>
          <q-item-label class="row items-center q-gutter-x-sm">
            <div>
              <q-badge color="indigo-4" class="text-capitalize">{{ testsStore.testReportDetails.test_type }}</q-badge>
              &nbsp;
            </div>
            <div class="text-subtitle1 text-weight-bold">Start Date:</div>
            <q-icon name="today" size="xs" />
            <div class="text-subtitle1">{{ testsStore.testReportDetails.start_date?.split('T')[0].replace(/-/g, '/') }}</div>
            <div class="text-subtitle1 text-weight-bold">End Date:</div>

            <q-icon name="event" size="xs" />
            <span>{{ testsStore.testReportDetails.end_date?.replace(/-/g, '/') }}</span>
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-item-label>
            <q-btn
              class="ase-roboto radius-8"
              color="green-12"
              no-caps
              @click="showCreateTests({ show: true })"
              :disabled="testsStore.testReportDetails.active || testsStore.isLoading || isPastOrCurrentDate"
            >
              Attach Challenge
            </q-btn>
            <div class="text-muted q-mt-sm" v-if="testsStore.testReportDetails.active">Test has been finalized</div>
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-item-label>
            <q-btn
              class="ase-roboto radius-8"
              color="green-12"
              no-caps
              @click="showCreateTests2({ show: true })"
              :disabled="testsStore.testReportDetails.active || testsStore.isLoading || isPastOrCurrentDate"
            >
              Attach Custom Challenge
            </q-btn>

            <div class="text-muted q-mt-sm justify-center flex" v-if="testsStore.testReportDetails.active">Test has been finalized</div>
          </q-item-label>
        </q-item-section>
        ``
      </q-item>
      <q-item>
        <q-item-section>
          <div class="text-subtitle1" v-if="testsStore.testReportDetails.description">
            {{ testsStore.testReportDetails.description }}
          </div>
        </q-item-section>
      </q-item>
    </BaseCard>

    <div class="row q-pa-sm" v-if="!isCreate && !isDelete">
      <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12 padding_7" v-if="!isCreate && !isDelete">
        <q-tabs align="left" no-caps v-model="tab" class="base-tabs" switch-indicator indicator-color="blue-12" active-bg-color="grey-12">
          <q-tab name="report" label="Reports" />
          <q-tab name="challenges" label="Challenges" />
          <q-tab name="custom" label="Custom Challenge" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="report">
            <q-table
              class="sticky-column-table base-table"
              :columns="columns"
              row-key="email"
              :loading="testsStore.isLoading"
              :rows="testsStore.testReportInfo.info"
              :rows-per-page-options="[0]"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th auto-width />
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr class="ase-roboto text-subtitle2 text-grey-9" hover :props="props">
                  <q-td auto-width>
                    <q-btn
                      color="black"
                      round
                      size="xs"
                      :icon="props.expand ? 'remove' : 'add'"
                      @click="props.expand = !props.expand"
                      class="text-weight-bolder"
                      :disabled="!props.row?.challenges?.length"
                    />
                  </q-td>
                  <q-td class="text-left" key="email" :props="props">{{ props.row.email }}</q-td>
                  <q-td key="progress" :props="props">
                    <q-linear-progress color="green-12" rounded :value="props.row.score / props.row.total_score" />
                  </q-td>
                  <q-td key="status" :props="props">
                    <q-badge
                      v-if="props.row.attempted"
                      class="text-capitalize"
                      :color="props.row.status === 'fail' ? 'negative' : 'positive'"
                    >
                      {{ props.row.status }}
                    </q-badge>
                    <div v-else>Not Attempted</div>
                  </q-td>
                  <q-td key="score" :props="props">{{ props.row.score ? props.row.score : 0 }}</q-td>
                  <q-td key="total_score" :props="props">{{ props.row.total ? props.row.total : 0 }}</q-td>
                  <q-td key="attempted" :props="props">{{ props.row.attempted ? 'Yes' : 'No' }}</q-td>
                </q-tr>
                <q-tr v-show="props.expand" :props="props">
                  <q-td colspan="100%" no-hover>
                    <q-list dense separator>
                      <q-item v-for="(challenge, index) in props?.row?.challenges" :inset-level="1" :key="index">
                        <q-item-section>{{ challenge.challenge }}</q-item-section>
                        <q-item-section v-if="challenge.score">Score Obtained: {{ challenge.score }}</q-item-section>
                        <q-item-section side>
                          <q-icon :color="challenge.status === 'pass' ? 'positive' : 'negative'" name="circle" size="xs">
                            <q-tooltip class="text-capitalize">{{ challenge.status }}</q-tooltip>
                          </q-icon>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-tab-panel>
          <q-tab-panel name="challenges">
            <testsTable :search="search" @updatePage="updatePage($event)" @deletePage="deleteTestPopup($event)" />
          </q-tab-panel>
          <q-tab-panel name="custom">
            <customTable :search="search" @updatePage="updatePage($event)" @deletePage="deleteCustomTestPopup($event)" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <template v-if="isCreate && !isDelete && !disable && !enable && !isCustom">
      <CreateTests
        name="testIndex"
        :title="updateId ? 'Update Attachment' : 'Attach Challenge'"
        :show="isCreate"
        :id="updateId"
        @onCancel="cancelCreateUser($event)"
        :disabledListData="testsStore.tests"
      />
    </template>
    <template v-if="isCreate2 && !isDelete && !disable && !enable && !isCustom">
      <createCustomTests
        name="testIndex"
        :title="updateId ? 'Update Attachment' : 'Attach Challenge'"
        :show="isCreate2"
        :id="updateId2"
        @onCancel="cancelCreateUser2($event)"
        :disabledListData="testsStore.tests"
      />
    </template>
    <Delete
      v-if="isDelete"
      :show="isDelete"
      :header="'you want to detach the challenge'"
      :loading="testsStore.isLoading"
      @confirmDelete="deletePage($event)"
      @confirmDeleteCancel="confirmDeleteCancel($event)"
    />
    <Delete
      v-if="isDeleteCustom"
      :show="isDeleteCustom"
      :header="'you want to detach the challenge'"
      :loading="isDeletingCustom"
      @confirmDelete="onDelete()"
      @confirmDeleteCancel="cancelDeleteCustom($event)"
    />
  </BaseCard>
</template>

<script setup>
import CreateTests from 'components/tests/createTests.vue'
import testsTable from 'components/tests/testsTable.vue'
import customTable from 'src/components/tests/customTable.vue'
import createCustomTests from 'src/components/tests/createCustomTests.vue'
import Delete from 'src/components/shared/Delete.vue'

import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'

import { useTestsStore } from 'src/store/pinia/tests'
import { useAiChallengesStore } from 'src/store/pinia/aiChallenges/aiChallenges'

import { computed, defineComponent, onBeforeMount, ref, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import { date } from 'quasar'

defineComponent({
  name: 'CompanyTest'
})

const route = useRoute()

const aiChallenges = useAiChallengesStore()
const testsStore = useTestsStore()

const isDeleteCustom = shallowRef(false)
const deleteIdCustom = shallowRef('')
const isCreate = shallowRef(false)
const isCreate2 = shallowRef(false)
const isCustom = shallowRef(false)
const isDelete = shallowRef(false)
const disable = shallowRef(false)
const enable = shallowRef(false)
const updateId = shallowRef('')
const updateId2 = shallowRef('')
const search = shallowRef('')
const deleteId = shallowRef('')
const tab = shallowRef('report')
const columns = ref([
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: false },
  { name: 'progress', label: 'Progress', field: 'progress', align: 'center', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: false },
  { name: 'score', label: 'Score obtained', field: 'score', align: 'center', sortable: false },
  { name: 'total_score', label: 'Total Score', field: 'total_score', align: 'center', sortable: false },
  { name: 'attempted', label: 'Attempted', field: 'attempted', align: 'center', sortable: false }
])
const isDeletingCustom = shallowRef(false)

onBeforeMount(async () => {
  await testsStore.fetchTestReportDetails({ test: urlSafeBase64Decode(route.params.testId) })
  testsStore.fetchTests({ test: urlSafeBase64Decode(route.params.testId) })
  testsStore.fetchTestReportDetails({ test: urlSafeBase64Decode(route.params.testId) })
})

async function onDelete() {
  isDeletingCustom.value = true
  const payload = {
    test_id: urlSafeBase64Decode(route.params.testId),
    challenges: [deleteIdCustom.value]
  }

  await aiChallenges.detachChallenge(payload, false)

  await testsStore.fetchTests({ test: urlSafeBase64Decode(route.params.testId) })

  isDeleteCustom.value = false
  isDeletingCustom.value = false
}

async function deleteCustomTestPopup(event) {
  if (event.show) {
    deleteIdCustom.value = event.data._key
    isDeleteCustom.value = true
  }
}

function cancelDeleteCustom(event) {
  if (event.show) {
    isDeleteCustom.value = false
  }
}

async function showCreateTests(event) {
  if (event.show) {
    isCreate.value = true
    updateId.value = ''
  } else {
    isCreate.value = false
  }
}
async function showCreateTests2(event) {
  if (event.show) {
    isCreate2.value = true
    updateId2.value = ''
  } else {
    isCreate2.value = false
  }
}
function updatePage(info) {
  if (testsStore.challenges.length === 0) {
    fetchChallenges({})
  }
  if (info.show) {
    updateId.value = info.data.sk
    testsStore.fetchTestsInfo(info.data)
    isCreate.value = true
  } else {
    isCreate.value = false
  }
}
async function deletePage(info) {
  if (info.show) {
    await testsStore.deleteAddedChallenge({ challenge: deleteId.value, test: urlSafeBase64Decode(route.params.testId) })
    testsStore.fetchTests({
      test: urlSafeBase64Decode(route.params.testId)
    })
    isDelete.value = false
  }
}
function deleteTestPopup(event) {
  if (event.show) {
    deleteId.value = event.data.sk
    isDelete.value = true
  }
}
function confirmDeleteCancel(event) {
  if (event.show) {
    isDelete.value = false
  }
}
function cancelCreateUser(event) {
  if (event.show) {
    isCreate.value = false
  }
}
function cancelCreateUser2(event) {
  if (event.show) {
    isCreate2.value = false
  }
}

const isPastOrCurrentDate = computed(() => {
  return date.formatDate(new Date(), 'YYYY-MM-DD') >= testsStore.testReportDetails.start_date
})
</script>
