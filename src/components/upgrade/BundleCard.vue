<template>
  <q-card class="card q-px-sm radius-24">
    <h6 class="absolute bg-blue custom-radius q-my-none q-px-md q-py-sm text-h6 text-white" style="margin-top: -24px; margin-left: -10px">
      {{ title }}
    </h6>
    <q-card-section class="q-mt-lg text-left">
      <p class="text-subtitle1" style="white-space: pre-line">{{ subtitle }}</p>
      <p v-if="hasMonthly" class="q-mb-none text-body1">
        <span class="text-blue text-bold">${{ monthlyPrice }}</span>
        /month, billed yearly only
      </p>
      <p v-if="hasYearly" class="text-body1">${{ yearlyPrice }} /year</p>
    </q-card-section>
    <q-card-section :class="`q-gutter-y-sm q-pt-none`">
      <div v-for="(benefit, index) of benefits" class="text-left text-body2" :key="index">
        <q-icon :color="benefit.included ? 'accent' : 'grey'" :name="benefit.included ? 'check_circle' : 'cancel'" size="sm" />
        <span class="q-ml-sm">{{ benefit.text }}</span>
      </div>
    </q-card-section>
    <q-card-actions class="q-mb-md q-mx-sm">
      <q-btn v-if="hasMonthly" class="text-bold" color="accent" @click="onCheckout('Monthly')" label="Get my bundle now" size="16px" />
      <q-btn v-if="hasYearly" class="text-bold" color="accent" @click="onCheckout('Yearly')" label="Get my bundle now" size="16px" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { useLoginStore } from 'src/store/pinia/login'

export default {
  props: {
    benefits: { type: Array, required: true },
    data: { type: Array },
    prices: { type: Array },
    subtitle: { type: String, required: true },
    title: { type: String, required: true }
  },
  setup() {
    const loginStore = useLoginStore()
    return { loginStore }
  },
  data() {
    return {
      dataLearners: this.learners,
      hasMonthly: false,
      hasYearly: false,
      monthlyPrice: 0,
      yearlyPrice: 0
    }
  },
  mounted() {
    if (this.data) {
      this.hasMonthly = this.data.some((plan) => plan.id.includes('Monthly'))
      this.hasYearly = this.data.some((plan) => plan.id.includes('Yearly'))
      this.monthlyPrice = ((item) => (item ? item.price : undefined))(this.data.find((item) => item.id.includes('Monthly')))
      this.yearlyPrice = ((item) => (item ? item.price : undefined))(this.data.find((item) => item.id.includes('Yearly')))
    }
  },
  methods: {
    onCheckout(period) {
      const plan = this.data.find((plan) => plan.id.includes(period))

      const payload = {
        first_name: this.loginStore.fetchUserInfo.firstName,
        last_name: this.loginStore.fetchUserInfo.lastName,
        email: this.loginStore.fetchUserInfo.email,
        item_price_id: plan.id
      }

      if (this.isOrganization) {
        payload.company_name = this.getCompanyInfo.name
        payload.quantity = this.dataLearners
      }

      this.$emit('onCheckout', payload)
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  border: 2px solid $primary;
  width: 23rem;
}

.custom-radius {
  border-radius: 0 12px 12px 12px;
}
</style>
