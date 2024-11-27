<template>
  <section class="q-gutter-md">
    <q-card class="col-grow" flat>
      <q-form greedy @submit="updateProfile">
        <q-card-section>
          <p class="text-subtitle1">First Name *</p>
          <BaseInput v-model="firstName" :rules="[...minLength(2), ...maxLength(50)]" />
          <p class="text-subtitle1">Last name *</p>
          <BaseInput v-model="lastName" :rules="[...minLength(2), ...maxLength(50)]" />
          <p class="text-subtitle1">Write your Headline</p>
          <BaseInput v-model="headline" :rules="[...maxLength(200)]" />
          <q-toggle v-model="weekly_digest_email" label="Subscribe to weekly email" @update:model-value="setWeeklyDigestEmail" />
          <div>
            <q-toggle
              v-if="isCompanyAdmin"
              label="Company weekly report"
              v-model="company_report_email"
              @update:model-value="setCompanyReportEmail"
            />
          </div>
        </q-card-section>
        <q-separator inset style="background-color: #a9a9a9" />
        <q-card-section>
          <p class="text-subtitle1">Links</p>
          <div class="q-gutter-y-xs">
            <BaseInput label="Website" v-model="website" :rules="url" hint="Must have https://" hide-hint />
            <BaseInput label="Twitter" prefix="https://twitter.com/" v-model="twitter" />
            <BaseInput label="Facebook" prefix="https://facebook.com/" v-model="facebook" />
            <BaseInput label="LinkedIn" prefix="https://linkedin.com/in/" v-model="linkedin" />
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn color="primary" label="Save" padding="8px 16px" type="submit" :loading="isLoading" />
        </q-card-actions>
      </q-form>
    </q-card>
  </section>
</template>

<script>
import BaseInput from 'components/shared/BaseInput.vue'
import jwt_decode from 'jwt-decode'
import { LocalStorage, useQuasar, QSpinnerFacebook } from 'quasar'
import { useLoginStore } from 'src/store/pinia/login'
import { maxLength, minLength, shortName } from 'src/utils/rules'
import { computed } from 'vue'

import { url } from 'src/utils/rules'
import { useProfileStore } from 'src/store/pinia/profile'

export default {
  name: 'ProfileUserInfo',
  components: { BaseInput },

  data() {
    return {
      company_report_email: false,
      facebook: undefined,
      firstName: '',
      headline: '',
      lastName: '',
      linkedin: undefined,
      newPhoto: [],
      picture: undefined,
      shortName,
      twitter: undefined,
      website: undefined,
      weekly_digest_email: false,
      url
    }
  },
  watch: {
    'fetchUserInfo.picture': {
      deep: true,
      immediate: true,
      handler() {
        if (this.fetchUserInfo.picture) {
          this.picture = this.fetchUserInfo.picture
        }
      }
    },
    isLoading: {
      handler() {
        if (this.isLoading) {
          this.$q.loading.show({
            spinner: QSpinnerFacebook,
            spinnerColor: 'white',
            spinnerSize: 140,
            message: 'Hang on...',
            messageColor: 'white'
          })
        } else {
          this.$q.loading.hide()
        }
      }
    }
  },
  async mounted() {
    await this.profileStore.fetchProfileDetailedInformation()
    this.firstName = this.profileStore.profileDetailedInfo.first_name
    this.lastName = this.profileStore.profileDetailedInfo.last_name
    this.headline = this.profileStore.profileDetailedInfo.headline
    this.weekly_digest_email = LocalStorage.getItem('weekly_digest_email') ?? false
    this.company_report_email = LocalStorage.getItem('company_report_email') ?? false
    this.facebook = this.profileStore.profileDetailedInfo.facebook_link?.split('https://facebook.com/')[1] ?? ''
    this.linkedin = this.profileStore.profileDetailedInfo.linkedin_link?.split('https://linkedin.com/in/')[1] ?? ''
    this.twitter = this.profileStore.profileDetailedInfo.twitter_link?.split('https://twitter.com/')[1] ?? ''
    this.website = this.profileStore.profileDetailedInfo.website_link
  },
  methods: {
    async updateProfile() {
      const data = {
        first_name: this.firstName,
        last_name: this.lastName,
        headline: this.headline,
        weekly_digest_email: this.weekly_digest_email,
        facebook_link: this.facebook ? 'https://facebook.com/' + this.facebook : 'https://facebook.com/',
        linkedin_link: this.linkedin ? 'https://linkedin.com/in/' + this.linkedin : 'https://linkedin.com/in/',
        twitter_link: this.twitter ? 'https://twitter.com/' + this.twitter : 'https://twitter.com/',
        website_link: this.website ? this.website : undefined
      }

      const user = await this.profileStore.updateProfileInfo(data)

      if (user) {
        this.loginStore.user = user
      }
    },
    async setWeeklyDigestEmail(val) {
      const data = {
        weekly_digest_email: this.weekly_digest_email
      }
      await this.profileStore.updateProfileInfo(data)
      LocalStorage.set('weekly_digest_email', this.weekly_digest_email)
    },

    async setCompanyReportEmail(val) {
      const data = {
        company_report_email: this.company_report_email
      }
      await this.profileStore.updateProfileInfo(data)
      LocalStorage.set('company_report_email', this.company_report_email)
    },

    error() {
      this.picture = null
    },

    async updatePicture() {
      const reader = new FileReader()
      reader.readAsDataURL(this.newPhoto)
      reader.onload = async () => {
        this.picture = reader.result

        const payload = {
          content: reader.result,
          folder: 'profile_image'
        }
        const user = await this.updateProfilePicture(payload)
        if (user) {
          this.loginStore.user = user
        }
      }
    },

    openFile() {
      this.$refs.uploadFile.pickFiles()
    }
  },

  setup() {
    const $q = useQuasar()
    const loginStore = useLoginStore()
    const profileStore = useProfileStore()

    const isDark = computed(() => $q.dark.isActive)

    const fetchUserInfo = computed(() => {
      return loginStore.fetchUserInfo
    })

    const profileDetailedInfo = computed(() => {
      return profileStore.profileDetailedInfo
    })

    const isLoading = computed(() => {
      return profileStore.isLoading
    })

    const isCompanyAdmin = computed(() => {
      return loginStore.isCompanyAdmin
    })

    const userAvatar = computed(() => {
      return fetchUserInfo.value?.firstName?.[0]
    })

    const userId = computed(() => {
      const token = LocalStorage.getItem('token')
      const decodedData = jwt_decode(token)
      return decodedData.sub
    })

    return {
      loginStore,
      isDark,
      fetchUserInfo,
      minLength,
      maxLength,
      isCompanyAdmin,
      userAvatar,
      userId,
      profileDetailedInfo,
      isLoading,
      profileStore
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  opacity: 1;
  .icon {
    visibility: hidden;
    opacity: 0;
    transition: 0.3s;
  }
  &:hover {
    .icon {
      visibility: visible;
      opacity: 1;
      transition: 0.3s;
    }
  }
}
</style>
