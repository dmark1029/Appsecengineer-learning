<template>
  <LoadingScreen v-if="tokenLocal" />
  <q-layout v-else class="flex items-center justify-center">
    <q-img class="z-fab" :ratio="753 / 481" src="/login/telekinesis_woman.png" style="margin-right: -1rem" width="45rem" />
    <q-page-container class="relative-position">
      <q-card
        class="absolute-center bg-indigo-14"
        square
        style="margin: -0.375rem 0 0 0.75rem; height: 35rem; max-width: 90vw; width: 27rem"
      >
        &nbsp;
      </q-card>
      <q-card class="bg-indigo-10 text-white" square style="height: 35rem; max-width: 90vw; width: 27rem">
        <q-card-section class="q-px-xl q-py-lg text-center">
          <q-img alt="AppSecEngineer" :ratio="268 / 85" src="/logo.svg" width="18rem" />
        </q-card-section>
        <div class="flex items-center justify-between">
          <q-separator color="indigo-14" size="2px" :style="{ width: ssoMode ? '12%' : '30%' }" />
          <h1 class="inline-block q-my-none text-accent text-bold text-h5">{{ ssoMode ? 'ORGANIZATION ' : '' }}LOGIN</h1>
          <q-separator color="indigo-14" size="2px" :style="{ width: ssoMode ? '12%' : '30%' }" />
        </div>
        <q-card-section :class="[ssoMode ? 'q-px-xl q-pt-xl' : 'q-pa-xl']">
          <q-form ref="loginForm" greedy>
            <BaseInput
              autofocus
              bg-color="indigo-14"
              input-class="text-white"
              :label="ssoMode ? 'Enter your work email address' : 'Email'"
              required
              :rules="email"
              type="email"
              v-model="username"
            />
            <q-btn
              v-if="!ssoMode"
              style="border-radius: 20px"
              :label="loginStore.loginStatus ? 'Loading...' : 'Sign in with Magic Link'"
              no-caps
              size="md"
              type="submit"
              class="full-width"
              color="accent"
              @click.prevent.stop="loginWithMagicLink"
            />
            <q-btn
              v-else
              style="border-radius: 20px"
              :label="loginStore.isLoading ? 'Loading...' : 'Continue'"
              no-caps
              size="md"
              type="submit"
              class="full-width q-mt-sm"
              color="accent"
              @click.prevent.stop="signinWithSso"
            />
            <div class="row justify-center q-py-md items-center no-wrap" :class="{ 'q-pt-xl': ssoMode }">
              <div class="col-grow">
                <q-separator color="white" inset />
              </div>
              <div class="col-auto">OR</div>
              <div class="col-grow">
                <q-separator color="white" inset class="col-4" />
              </div>
            </div>
            <template v-if="!ssoMode">
              <div class="row justify-center">
                <BaseBtn :href="config.googleOauthUrl" class="br-4 full-width google-login text-subtitle1" flat size="md">
                  <q-icon left size="1.4em" name="app:google" />
                  <div>Sign in with Google</div>
                </BaseBtn>
                <div
                  class="text-darkOrange text-subtitle2 cursor-pointer q-py-md"
                  :class="{ 'text-center': ssoMode }"
                  @click="toggleSsoMode"
                >
                  Sign in with Organization login
                </div>
              </div>
            </template>
          </q-form>
        </q-card-section>
        <q-card-section class="q-pb-xl q-pt-none q-px-xl">
          <template v-if="!ssoMode">
            <p class="q-mb-none text-subtitle2 text-weight-light">Not yet an AppSecEngineer?</p>
            <a class="text-darkOrange text-subtitle2" href="https://appsecengineer.com/main-menu-pages/pricing" target="_blank">
              Get your plan now
            </a>
          </template>
          <p
            v-if="ssoMode"
            class="text-darkOrange q-mb-lg text-subtitle2 cursor-pointer"
            :class="{ 'text-center': ssoMode }"
            @click="toggleSsoMode"
          >
            Sign in with Magic Link
          </p>
        </q-card-section>
      </q-card>
    </q-page-container>
    <q-img class="absolute-bottom-right z-fab" :ratio="237 / 367" src="/login/white_stripes.svg" width="16rem" />
    <BaseDialog v-model="showMagicLinkDialog" @close="showMagicLinkDialog = false" title="Email Sent" noheader style="width: 500px">
      <template #separator></template>
      <q-card-section class="q-my-md q-mx-md q-pa-none text-center">
        <div class="row justify-end">
          <BaseBtn color="primary" icon="close" round size="sm" @click="showMagicLinkDialog = false" />
        </div>
        <div class="q-pb-xs q-px-lg">
          <p class="text-h5">Magic Link Sent to your email</p>
          <p class="text-subtitle1 text-weight-light">
            We have sent an email with sign-in link. Please sign-in using that link. The link will expire in three minutes.
          </p>
        </div>
      </q-card-section>
    </BaseDialog>
    <q-footer class="flex items-center justify-between q-px-md" reveal>
      <h6 class="q-my-sm text-body2">Copyright &copy; AppSecEngineer {{ new Date().getFullYear() }}</h6>
      <div class="q-gutter-x-xl">
        <a href="https://assets.appsecengineer.com/Terms%20of%20Use.pdf" target="_blank">Terms of Use</a>
        <a href="https://appsecengineer.com/privacy-policy" target="_blank">Privacy Policy</a>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import BaseInput from 'components/shared/BaseInput.vue'
import LoadingScreen from 'pages/login/LoadingScreen.vue'
import { useLoginStore } from 'src/store/pinia/login'
import { email } from 'src/utils/rules'

import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LocalStorage, useQuasar } from 'quasar'
import config from 'src/config'
import { useCoursesStore } from 'src/store/pinia/courses'

const loginStore = useLoginStore()
const router = useRouter()
const route = useRoute()
const ssoMode = ref(route.query.hasOwnProperty('work_email'))

const coursesStore = useCoursesStore()
const showMagicLinkDialog = ref(false)
const username = ref(route.query.work_email ?? '')
const tokenLocal = ref(LocalStorage.getItem('token') || '')
const $q = useQuasar()
const loginForm = ref(null)

const fetchDashboardData = computed(() => coursesStore.dashboardCoursesData)

async function forLoggedInUser() {
  if (loginStore.hasToken) {
    await coursesStore.fetchDashboardCourses()
    if (fetchDashboardData.value.length > 0) {
      await router.push('/portal/dashboard')
    } else {
      LocalStorage.clear()
    }
  }
}

async function loginWithMagicLink() {
  const valid = await loginForm.value.validate()
  if (!valid) return
  if (!loginStore.isLoggedIn && !loginStore.isLoading) {
    if (window.location.search) {
      const queryParam = decodeURIComponent(window.location.search.substring(1))
      if (
        (queryParam.substring(0, 35) === 'https://learning.appsecengineer.com' &&
          queryParam.includes('https://learning.appsecengineer.com')) ||
        (queryParam.substring(0, 43) === 'https://learning.appsecengineer.com' &&
          queryParam.includes('https://learning.appsecengineer.com')) ||
        (queryParam.substring(0, 21) === 'http://127.0.0.1:8080' && queryParam.includes('http://127.0.0.1:8080'))
      ) {
        loginStore.setQueryParamUrl(decodeURIComponent(window.location.search.substring(1)))
      } else {
        loginStore.setQueryParamUrl('/')
      }
    }
    loginStore.setLoginStatus(true)
    await loginStore.loginData({ username: username.value })
    if (loginStore.apiStatus) {
      showMagicLinkDialog.value = true
    }
  }
}

async function signinWithSso() {
  const valid = await loginForm.value.validate()
  if (!valid) return
  if (!loginStore.isLoggedIn && !loginStore.isLoading) {
    loginStore.loginWithSso({ email: username.value })
  }
}

function onCreated() {
  document.title = 'Login'
  if (route.query?.email) {
    username.value = route.query?.email
  }
  loginStore.setLoginStatus(false)
  forLoggedInUser()
}

function toggleSsoMode() {
  username.value = ''
  ssoMode.value = !ssoMode.value
  router.push({ query: ssoMode.value ? { work_email: username.value } : {} })
}

watch(username, () => {
  ssoMode.value && router.push({ query: { work_email: username.value } })
})

onCreated()

watch(
  () => route.query,
  (newQuery) => {
    // Log the current query for debugging purposes

    // Check if 'work_email' is present in the query parameters
    if (newQuery.hasOwnProperty('work_email')) {
      // If 'work_email' exists, set ssoMode to true
      ssoMode.value = true
    } else {
      // If 'work_email' does not exist, set ssoMode to false
      ssoMode.value = false
    }
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
a {
  color: #fff;
  text-decoration: none;
}
.google-login {
  background-color: white !important;
  border-radius: 20px !important;
  color: black !important;
}
.text-darkOrange {
  color: $darkOrange;
}
</style>
