<template>
  <div>
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white">
        <div class="appsec-h1">Change Password</div>
      </q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md" @submit.prevent="onSubmit()">
          <BaseInput
            label="Current Password * *"
            :maxlength="50"
            required
            :rules="[...minLength(1), ...maxLength(50)]"
            v-model="password"
          />
          <p v-if="errorNewPwdGetter.old_password" class="text-caption text-negative">{{ errorNewPwdGetter.old_password_msg }}</p>

          <br />
          <BaseInput
            label="Current Password * *"
            :maxlength="50"
            required
            :rules="[...minLength(1), ...maxLength(50), sameAs(password)]"
            v-model="newPassword"
          />
          <p v-if="errorNewPwdGetter.new_password" class="text-caption text-negative">{{ errorNewPwdGetter.new_password_msg }}</p>

          <p class="portal_font_family ase-md error_msg_color" v-if="!password_test_conditions.leng">Longer than 7 characters</p>
          <p class="portal_font_family ase-md error_msg_color" v-if="!password_test_conditions.caps">Need a capital letter</p>
          <p class="portal_font_family ase-md error_msg_color" v-if="!password_test_conditions.small">Need a lowercase letter</p>
          <p class="portal_font_family ase-md error_msg_color" v-if="!password_test_conditions.num">Need a number</p>
          <p class="portal_font_family ase-md error_msg_color" v-if="!password_test_conditions.spe">Need a special character</p>

          <br />
          <q-input filled v-model="repeatPassword" label="Confirm Password *" type="password" />
          <div class="portal_font_family ase-md error_msg_color" v-if="!$v.repeatPassword.sameAsPassword">Passwords must be identical.</div>
          <br />
          <q-btn
            push
            type="submit"
            size="14px"
            :loading="isLoading"
            :disabled="!isComplete"
            color="btn"
            style="width: 150px"
            class="float-right"
          >
            SUBMIT
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Loading...
            </template>
          </q-btn>
          <br />
          <br />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import { maxLength, minLength, required, sameAs } from 'src/utils/rules'
import { mapGetters } from 'vuex'

export default {
  name: 'ProfileChangePassword',
  data() {
    return {
      password: '',
      newPassword: '',
      repeatPassword: '',
      registerStatus: false,
      errors: '',
      password_test_conditions: {
        caps: false,
        num: false,
        small: false,
        eight: false,
        len: false,
        spe: false
      },
      required,
      minLength,
      maxLength,
      sameAs
    }
  },
  watch: {
    password: {
      handler() {
        const err_msgs = {}
        err_msgs.old_password = false
        err_msgs.old_password_msg = ''
        this.errorMsgReset(err_msgs)
      }
    },
    newPassword: {
      handler(value) {
        const err_msgs = {}
        err_msgs.new_password = false
        err_msgs.new_password_msg = ''
        this.errorMsgReset(err_msgs)
        const message = []
        this.password_test_conditions = { caps: false, num: false, small: false, leng: false, spe: false }
        const reNum = /[0-9]/
        if (reNum.test(value)) {
          this.password_test_conditions.num = true
          message.push('Please provide atleast One numeric value')
        }
        const reSmall = /[a-z]/
        if (reSmall.test(value)) {
          this.password_test_conditions.small = true
          message.push('Please provide atleast One small letter')
        }
        const reCaps = /[A-Z]/
        if (reCaps.test(value)) {
          this.password_test_conditions.caps = true
          message.push('Please provide atleast One caps letter')
        }
        const reSpec = /\W|_/g
        if (reSpec.test(value)) {
          this.password_test_conditions.spe = true
          message.push('Please provide atleast One special character')
        }

        if (value.length > 7) {
          this.password_test_conditions.leng = true
          message.push('Minimum of 8 characters is required')
        }
      }
    },
    repeatPassword: {
      handler() {
        const err_msgs = {}
        err_msgs.access_token = false
        err_msgs.access_token_msg = ''
        this.errorMsgReset(err_msgs)
      }
    }
  },
  methods: {
    ...mapActions('setNewPassword', ['isChangePasswordStatus', 'setNewPassword', 'errorMsgReset']),
    onSubmit() {
      const data = {
        old_password: this.password,
        new_password: this.newPassword
      }
      this.isChangePasswordStatus(true)
      this.setNewPassword(data)
    }
  },
  computed: {
    isComplete() {
      return (
        this.password &&
        this.newPassword &&
        this.repeatPassword &&
        this.password_test_conditions.leng &&
        this.password_test_conditions.caps &&
        this.password_test_conditions.small &&
        this.password_test_conditions.num &&
        this.password_test_conditions.spe
      )
    },
    ...mapGetters('setNewPassword', {
      isLoading: 'isLoading',
      changePasswordErrorMsg: 'changePasswordErrorMsg',
      changePasswordErrorStatus: 'changePasswordErrorStatus',
      errorNewPwdGetter: 'errorNewPwdGetter'
    })
  }
}
</script>
