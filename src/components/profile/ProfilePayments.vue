<template>
  <section class="q-gutter-md">
    <q-card v-if="activeSection === 'initial'" class="col-grow" flat>
      <div class="flex column text-center">
        <q-card-section>
          <p class="subtitle1">You don't have any saved payment method</p>
          <q-btn
            @click="toggleSection('addPayment')"
            :class="{ active: isActive('addPayment') }"
            color="primary"
            icon="credit_card"
            label="Add Payment Method"
            style="width: 230px"
          />
        </q-card-section>
      </div>
    </q-card>

    <q-card v-if="activeSection === 'addPayment'" class="col-grow" flat>
      <q-form greedy @submit="savePayment">
        <q-card-section>
          <q-btn square class="q-mb-md" color="primary" size="xs" icon="arrow_back" @click="toggleSection('initial')" />
          <p class="subtitle1">Card Details</p>
          <p>Name on Card</p>
          <BaseInput label="Enter Card Name" required="true" v-model="cardName" />
          <p class="subtitle1 q-pt-sm">Card Number</p>
          <BaseInput type="number" required="true" label="1234 5678 9213" v-model="cardNumber" />
          <div class="" style="max-width: 50%">
            <p class="subtitle1 q-pt-sm">Expiry</p>
            <BaseInput type="date" required="true" label="06/27" v-model="cardExpiry" />
            <p class="subtitle1 q-pt-sm">CVV</p>
            <!-- <BaseInput label="***8" required="true" v-model="cardCVV" /> -->

            <q-input v-model="password" filled :type="isPwd ? 'password' : 'text'" outlined>
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </div>
          <p class="subtitle1 q-pt-sm">Email address</p>
          <p class="subtitle1">Invoices will be sent to this email</p>
          <BaseInput type="email" icon="mail" required="true" label="Enter your email" v-model="email" />

          <q-card-actions align="left">
            <q-btn class="q-mt-md" color="primary" label="Save" padding="8px 16px" type="submit" />
          </q-card-actions>
        </q-card-section>
      </q-form>
    </q-card>

    <q-card v-if="activeSection === 'addedCards'" flat>
      <q-card-section>
        <div>
          <h4 class="text-weight-medium q-mb-xs">Payment Methods</h4>
          <div class="flex justify-between">
            <p class="subtitle2">
              Any Updates made to your payment Method information
              <br />
              will be applied to your upcoming scheduled payments
            </p>
            <q-btn
              @click="addCard"
              :class="{ active: isActive('addPayment') }"
              color="primary"
              icon="credit_card"
              label="Add Payment Method"
              style="width: 250px; height: 35px"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator inset color="black" />
      <!-- TODO: Remove comment when backend is ready -->
      <q-card>
        <q-card-section>
          <div class="flex justify-between">
            <img src="/icons/profile.svg" alt="x" style="width: 100px" />
            <div class="q-mt-md">
              <p class="q-ma-sm subtitle1" style="font-size: 30px">Mastercard</p>
              <div class="flex q-mb-none">
                <p class="q-mx-sm" style="font-size: 15px">XXXX XXXX XXXX 1234</p>
                <p style="font-size: 15px">Expiry 11/23</p>
              </div>
            </div>
            <q-chip class="q-mt-lg" color="positive" label="primary" square text-color="white" />

            <div class="q-mt-lg">
              <q-btn class="q-mx-xs q-my-md" round color="black" size="10px" icon="edit" style="width: 10px; height: 10px" />
              <q-btn class="q-mx-xs q-my-md" round color="primary" size="10px" icon="delete" style="width: 10px; height: 10px" />

              <q-button />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-card>
  </section>
</template>

<script setup>
import { BaseInput } from 'components/wrappers/BaseInput'
import { ref } from 'vue'
import { required } from 'src/utils/rules'

const cardName = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCVV = ref('')
const email = ref('')
const isPwd = ref(true)

const activeSection = ref('initial')
const isPaymentSaved = ref(false)

const toggleSection = (section) =>
  section === 'addPayment' && !isPaymentSaved.value ? (activeSection.value = section) : (activeSection.value = '')

const isActive = (section) => activeSection.value === section

const savePayment = () => {
  activeSection.value = 'addedCards'
}

const addCard = () => {
  isPaymentSaved.value = false
  toggleSection('addPayment')
}
</script>
