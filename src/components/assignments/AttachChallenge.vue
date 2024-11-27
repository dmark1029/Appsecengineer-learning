<template>
  <BaseCard class="br-4 column q-py-sm q-px-lg">
    <BaseCard class="q-pa-md" bordered v-if="!isCreate && !isDelete">
      <q-item>
        <q-item-section avatar>
          <q-avatar size="xl" class="bg-black text-white text-capitalize">
            {{ assignmentStore.attachChallenge.name?.[0] || assignmentStore.attachChallenge.name }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="ellipsis text-h6">
            {{ assignmentStore.attachChallenge.name }}
          </q-item-label>
          <q-item-label class="row items-center q-gutter-x-sm">
            <div>
              <q-badge color="indigo-4" class="text-capitalize">{{ assignmentStore.attachChallenge.test_type }}</q-badge>
              &nbsp;
            </div>
            <div class="text-subtitle1 text-weight-bold">Start Date:</div>
            <q-icon name="today" size="xs" />
            <div class="text-subtitle1">{{ assignmentStore.attachChallenge.start_date?.split('T')[0].replace(/-/g, '/') }}</div>
            <div class="text-subtitle1 text-weight-bold">End Date:</div>

            <q-icon name="event" size="xs" />
            <span>{{ assignmentStore.attachChallenge.end_date?.replace(/-/g, '/') }}</span>
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-item-label>
            <q-btn
              class="col-auto ase-roboto radius-8"
              color="green-12"
              no-caps
              @click="showCreateTests2({ show: true })"
              :disabled="assignmentStore.attachChallenge.active"
            >
              Attach Custom Challenge
            </q-btn>
            <div class="text-muted q-mt-sm" v-if="assignmentStore.attachChallenge.active">Test has been finalized</div>
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-item-label>
            <q-btn
              class="col-auto ase-roboto radius-8"
              color="green-12"
              no-caps
              @click="showCreateTests({ show: true })"
              :disabled="assignmentStore.attachChallenge.active"
            >
              Attach Challenge
            </q-btn>
            <div class="text-muted q-mt-sm" v-if="assignmentStore.attachChallenge.active">Test has been finalized</div>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <div class="text-subtitle1" v-if="assignmentStore.attachChallenge.description">
            {{ assignmentStore.attachChallenge.description }}
          </div>
        </q-item-section>
      </q-item>
    </BaseCard>

    <div class="flex-row q-pa-sm" v-if="!isCreate && !isDelete">
      <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12 padding_7" v-if="!isCreate && !isDelete">
        <q-tabs align="left" no-caps v-model="tab" class="base-tabs" indicator-color="blue-12" active-bg-color="grey-12">
          <q-tab name="challenges" label="Challenges" />
          <q-tab name="custom" label="Custom Challenges" />
        </q-tabs>

        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="challenges">
            <testsTable :search="search" @updatePage="updatePage($event)" @deletePage="deleteTestPopup($event)" />
          </q-tab-panel>
          <q-tab-panel name="custom">
            <customTable :search="search" @updatePage="updatePage($event)" @deletePage="deleteCustomTestPopup($event)" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <div class="flex justify-end q-mt-md q-mr-lg">
        <q-btn color="primary" label="save" class="ase-robot" @click="onSave" to="/portal/company/assignments/tournaments" v-if="!enable" />
      </div>
    </div>
    <template v-if="isCreate && !isDelete && !disable && !enable && !isCustom">
      <CreateTests
        name="assignmentStore.attachChallenge"
        :title="updateId ? 'Update Attachment' : 'Attach Challenge'"
        :show="isCreate"
        :id="updateId"
        @onCancel="cancelCreateUser($event)"
        :disabledListData="testsStore.tests"
      />
    </template>
    <template v-if="isCreate2 && !isDelete && !disable && !enable && !isCustom">
      <createCustomTests
        name="assignmentStore.attachChallenge"
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
      :loading="isDeleting"
      @confirmDelete="deletePage($event)"
      @confirmDeleteCancel="confirmDeleteCancel($event)"
    />

    <Delete
      v-if="isDeleteCustom"
      :show="isDeleteCustom"
      :header="'you want to detach the challenge'"
      :loading="isDeleting"
      @confirmDelete="onDelete()"
      @confirmDeleteCancel="cancelDeleteCustom($event)"
    />
  </BaseCard>
</template>

<script setup>
import createCustomTests from 'components/tests/createCustomTests.vue'
import CreateTests from 'components/tests/createTests.vue'
import testsTable from 'components/tests/testsTable.vue'
import Delete from 'src/components/shared/Delete.vue'
import customTable from '../tests/customTable.vue'

import { Notify } from 'quasar'

import { useAiChallengesStore } from 'src/store/pinia/aiChallenges/aiChallenges'
import { useTestsStore } from 'src/store/pinia/tests'
import { useAssignmentStore } from 'src/store/pinia/assignment'

import { defineComponent, onMounted, shallowRef } from 'vue'

defineComponent({
  name: 'CompanyTest'
})

const props = defineProps({ data: Object })

const aiChallenges = useAiChallengesStore()
const testsStore = useTestsStore()
const assignmentStore = useAssignmentStore()

const isDeleteCustom = shallowRef(false)
const deleteIdCustom = shallowRef('')
const isCreate = shallowRef(false)
const isCreate2 = shallowRef(false)
const updateId2 = shallowRef('')
const isCustom = shallowRef(false)
const isDelete = shallowRef(false)
const disable = shallowRef(false)
const enable = shallowRef(false)
const updateId = shallowRef('')
const search = shallowRef('')
const deleteId = shallowRef('')
const tab = shallowRef('challenges')
const isDeleting = shallowRef(false)

const id = assignmentStore.attachChallenge

onMounted(async () => {
  await testsStore.fetchTests({ test: id.sk })
})

async function onDelete() {
  isDeleting.value = true
  const payload = {
    test_id: id.sk,
    challenges: [deleteIdCustom.value]
  }

  await aiChallenges.detachChallenge(payload, false)
  await testsStore.fetchTests({ test: id.sk })

  isDeleteCustom.value = false
  isDeleting.value = false
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

const onSave = () => {
  Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Assignment has been successfully created' })
  testsStore.clearTests()
}

async function showCreateTests(event) {
  isCreate.value = Boolean(event.show)
  if (event.show) {
    updateId.value = ''
  }
}

async function showCreateTests2(event) {
  isCreate2.value = Boolean(event.show)
  if (event.show) {
    updateId2.value = ''
  }
}

function updatePage(info) {
  if (testsStore.challenges.length === 0) {
    testsStore.fetchChallenges({})
  }

  if (info.show) {
    updateId.value = info.data.sk
    testsStore.fetchTestsInfo(info.data)
  }

  isCreate.value = Boolean(info.show)
}

async function deletePage(info) {
  if (info.show) {
    isDeleting.value = true
    await testsStore.deleteAddedChallenge({
      challenge: deleteId.value,
      test: assignmentStore.attachChallenge.sk
    })
    testsStore.fetchTests({
      test: assignmentStore.attachChallenge.sk
    })
    isDeleting.value = false
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
</script>
