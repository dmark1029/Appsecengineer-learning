<template>
  <div>
    <q-list bordered>
      <q-item>
        <q-item-section class="appsec-h1-bold" avatar>#</q-item-section>
        <q-item-section>
          <div class="appsec-h1-bold">Name</div>
        </q-item-section>
        <q-item-section>
          <div class="appsec-h1-bold">Email</div>
        </q-item-section>
        <q-item-section>
          <div class="appsec-h1-bold">Action</div>
        </q-item-section>
      </q-item>
    </q-list>
    <q-list bordered separator v-for="(user, index) in dataInfo.results" :key="user + index + 'dd+USER+Info'">
      <q-item>
        <q-item-section class="cursor_auto portal_sm" align="left" avatar>{{ index + 1 }}</q-item-section>
        <q-item-section class="cursor_auto portal_sm" align="left">{{ user.name }}</q-item-section>
        <q-item-section class="cursor_auto portal_sm" align="left">{{ user.email }}</q-item-section>
        <q-item-section class="text-link portal_sm" align="left">
          <q-btn
            class="ase-roboto ase-md"
            color="primary"
            size="sm"
            @click="viewMore(user.id)"
            v-if="user.status === 'Sent'"
            style="width: 160px"
          >
            <q-tooltip>View</q-tooltip>
            View
          </q-btn>
          <div class="text-subtitle1">N/A</div>
        </q-item-section>
      </q-item>
    </q-list>
    <template v-if="dataInfo.length === 0">
      <p class="text-center text-h4 text-weight-bold ase-roboto ase-black-light line-height-normal padding_12">No data</p>
    </template>
  </div>
</template>

<script>
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
export default {
  name: 'CreateIssueCertificatesUser',
  components: {},
  props: ['title', 'dataInfo'],
  methods: {
    async actionItemAssignment(value) {
      await this.$router.push(`/portal/course-info/intro/${urlSafeBase64Encode(value.sk)}}/`)
    },
    viewMore(id) {
      const url = `https://appsecengineer.verified.cv/en/verify/${id}`
      window.open(url, '_blank')
    }
  }
}
</script>
