<template>
  <q-card class="card q-px-sm radius-24 relative-position" :class="{ 'bg-primary text-white': dark }">
    <h6 class="bg-accent inline-block q-my-none q-px-md q-py-sm radius-8 text-bold text-h6 text-primary" style="margin-top: -24px">
      {{ title }}
    </h6>
    <q-card-section class="text-left">
      <p class="text-subtitle1" style="white-space: pre-line">{{ subtitle }}</p>
      <p v-if="hasMonthly" class="q-mb-none text-body1">${{ monthlyPrice }} /month, billed monthly</p>
      <p v-if="hasYearly" class="text-body1">
        <span class="text-blue text-bold">${{ (yearlyPrice / 12).toFixed(2) }}</span>
        /month billed annually (${{ yearlyPrice }})
      </p>
    </q-card-section>
    <q-card-section :class="`q-gutter-y-${space} q-pt-none`">
      <div v-for="(benefit, index) of benefits" class="text-left text-body2" :key="index">
        <q-icon :color="benefit.included ? 'accent' : 'grey'" :name="benefit.included ? 'check_circle' : 'cancel'" size="sm" />
        <span class="q-ml-sm">{{ benefit.text }}</span>
      </div>
    </q-card-section>
    <q-card-actions v-if="onlyTouch" align="center" class="q-pb-lg">
      <q-btn class="q-my-md text-bold" color="secondary" label="GET IN TOUCH" outline @click="$emit('goInTouch')" />
    </q-card-actions>
    <q-card-actions v-else class="row items-center justify-center q-pb-lg q-px-md">
      <div v-if="isOrganization" class="col-3 row">
        <q-btn color="primary" icon="remove" round size="xs" @click="learners--" :disable="learners <= 5" />
        <span class="q-mx-sm text-body1">{{ learners }}</span>
        <q-btn color="primary" icon="add" round size="xs" @click="learners++" :disable="learners > 200" />
      </div>
      <div class="col-9 q-gutter-y-md">
        <q-btn v-if="hasMonthly" class="text-bold" color="secondary" label="Go for monthly" outline @click="onPrepareCheckout('Monthly')" />
        <q-btn
          v-if="hasYearly"
          class="text-bold"
          color="secondary"
          :label="hasMonthly ? `Save ${discount}% with yearly` : 'Go for yearly'"
          @click="onPrepareCheckout('Yearly')"
        />
      </div>
    </q-card-actions>

    <transition appear enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
      <q-card class="absolute-bottom text-black" v-show="chargesDialog">
        <q-card-section>
          <h6 class="q-mb-md q-mt-none text-left">Checkout</h6>
          <p class="text-body1">Before checking out, do you want to add a certificate?</p>
          <q-option-group class="text-body1 text-left" dense :options="chargesOptions" type="checkbox" v-model="chargesSelected" />
        </q-card-section>
        <q-card-actions>
          <q-btn class="col-grow" color="secondary" label="Cancel" outline rounded @click="chargesDialog = false" />
          <q-btn class="col-grow" color="primary" label="Confirm" rounded @click="onCheckout(plan)" />
        </q-card-actions>
      </q-card>
    </transition>
  </q-card>
</template>

<script>
import { useLoginStore } from 'src/store/pinia/login'
import { computed } from 'vue'

import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'

export default {
  props: {
    benefits: { type: Array, required: true },
    dark: { type: Boolean, default: false },
    data: { type: Object, required: false },
    discount: { type: String },
    isOrganization: { type: Boolean, default: false },
    onlyTouch: { type: Boolean, default: false },
    space: { type: String, default: 'sm' },
    subtitle: { type: String, required: true },
    title: { type: String, required: true }
  },

  setup() {
    const loginStore = useLoginStore()
    const companyUsersStore = useCompanyConsumerStore()
    const isCompanyAdmin = computed(() => loginStore.isCompanyAdmin.toString())
    return { loginStore, isCompanyAdmin, companyUsersStore }
  },

  data() {
    return {
      chargesDialog: false,
      chargesOptions: [],
      chargesSelected: [],
      learners: 5,
      hasMonthly: false,
      hasYearly: false,
      monthlyPrice: 0,
      plan: {},
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
    onPrepareCheckout(period) {
      this.plan = this.data.find((plan) => plan.id.includes(period))

      if (this.plan.charges.length) {
        this.chargesDialog = true
        this.chargesOptions = this.plan.charges.map((charge) => ({ label: charge.name + ' + $' + charge.price, value: charge.id }))
        return
      }

      this.onCheckout(this.plan)
    },

    onCheckout(plan) {
      const payload = {
        first_name: this.loginStore.fetchUserInfo.firstName,
        last_name: this.loginStore.fetchUserInfo.lastName,
        email: this.loginStore.fetchUserInfo.email,
        item_price_id: plan.id
      }

      if (plan.charges.length) {
        payload.charge_ids = this.chargesSelected
      }

      if (this.isOrganization) {
        payload.company_name = this.companyUsersStore.companyInfo.name
        payload.quantity = this.learners
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
</style>
