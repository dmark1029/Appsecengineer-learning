<template>
  <q-page>
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <div class="text-center">
          <q-avatar class="image" size="100px" text-color="white" @click="openFile">
            <q-img v-if="picture" :src="picture" @error="error">
              <div class="absolute-full flex flex-center icon">
                <q-icon color="primary" name="upload" size="40px" />
              </div>
            </q-img>

            <q-avatar v-else class="bg-primary" size="100px">
              <div class="text-white">{{ userAvatar }}</div>
              <div
                class="absolute-full full-height full-width flex flex-center icon"
                :style="{
                  backgroundColor: '#cdcdcd3b'
                }"
              >
                <q-icon color="black" name="upload" size="45px" />
              </div>
            </q-avatar>

            <q-file
              accept="jpg, jpeg, png"
              borderless
              class="absolute-bottom"
              ref="uploadFile"
              v-model="newPhoto"
              @update:modelValue="updatePicture"
              @click.stop
              max-file-size="6000000"
              @rejected="onRejected"
            >
              <template v-slot:file>
                <q-chip class="hidden" />
              </template>
            </q-file>
          </q-avatar>

          <p class="text-h6 q-mb-none">{{ fetchUserInfo.firstName }} {{ fetchUserInfo.lastName }}</p>
          <p class="text-subtitle2 q-mb-xs">{{ fetchUserInfo.email }}</p>
          <router-link class="text-primary" target="_blank" :to="{ name: 'public.profile', params: { id: userId } }">
            <q-btn outline rounded label="View public profile" />
          </router-link>
          <q-chip v-if="isCompanyAdmin" class="q-mt-sm" color="positive" label="Admin" text-color="white" />
        </div>

        <q-tabs
          active-color="black"
          active-bg-color="white"
          class="bg-transparent q-mt-xl q-mr-md"
          :class="isDark ? 'bg-dark' : 'bg-white'"
          inline-label
          indicator-color="transparent"
          style="border: none !important; height: 75vh"
          v-model="tab"
          vertical
        >
          <q-tab
            v-for="tab in tabs"
            :key="tab.name"
            :label="tab.label"
            :name="tab.name"
            :icon="tab.icon"
            style="justify-content: flex-start"
          />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels animated v-model="tab" swipeable vertical transition-prev="jump-up" transition-next="jump-up">
          <q-tab-panel name="profile">
            <ProfileUserInfo />
          </q-tab-panel>

          <q-tab-panel name="achievements">
            <ProfileBadges />
            <q-separator spaced="xl" />
            <div>
              <p class="text-h5">You can also take these courses</p>
              <div class="row">
                <div
                  v-for="(course, index) in numberOfCourses"
                  class="col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3"
                  :class="{ disabled: course.disabled }"
                  :key="index"
                >
                  <SlideView :data="course" :key="course.id" @moveToCourseInfo="moveToCourseInfo" />
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="activity">
            <UserActivity :datesRange="dropdownValue.value" idVal="DashboardUserActivity">
              <template v-slot:dashboardSlot>
                <BaseSelect :clearable="false" :options="dropdownOptions" v-model="dropdownValue" />
              </template>
            </UserActivity>
          </q-tab-panel>

          <!-- <q-tab-panel name="userAssignments">
            <ProfileAssignment />
          </q-tab-panel> -->

          <!-- <q-tab-panel name="paymentMethods">
            <ProfilePayments />
          </q-tab-panel> -->
        </q-tab-panels>
      </template>
    </q-splitter>
  </q-page>
</template>

<script>
import ProfileAssignment from 'components/profile/ProfileAssignment.vue'
import ProfileBadges from 'components/profile/ProfileBadges.vue'
import ProfileChangePassword from 'components/profile/ProfileChangePassword.vue'
import ProfileUserInfo from 'components/profile/ProfileUserInfo.vue'
import ProfilePayments from 'components/profile/ProfilePayments.vue'
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import SlideView from 'components/dashboard/SlideView.vue'
import jwt_decode from 'jwt-decode'
import UserActivity from 'pages/activity/activityUser.vue'
import { LocalStorage, QSpinnerFacebook, useQuasar } from 'quasar'
import { useLoginStore } from 'src/store/pinia/login'
import { currentYearOld, previousDates } from 'src/utils/reuseFunctions'
import { maxLength, minLength } from 'src/utils/rules'
import { computed, ref } from 'vue'
import { useDashboardStore } from 'src/store/pinia/dashboard'

import { mapState, mapActions as piniaActions } from 'pinia'
import { useRouter } from 'vue-router'
import { useProfileStore } from 'src/store/pinia/profile'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useMacroMetaStore } from 'src/store/pinia/macroMeta'

export default {
  name: 'ProfileIndex',
  components: {
    BaseSelect,
    ProfileAssignment,
    ProfileBadges,
    ProfileChangePassword,
    ProfileUserInfo,
    UserActivity,
    BaseInput,
    ProfilePayments,
    SlideView
  },
  data() {
    return {
      dropdownOptions: [],
      dropdownValue: {},
      tab: 'profile',
      numberOfCourses: [],
      tabs: [
        { name: 'profile', label: 'Profile', icon: 'account_circle' },
        { name: 'achievements', label: 'Achievements', icon: 'star' },
        { name: 'activity', label: 'Activity', icon: 'history' }
        // { name: 'userAssignments', label: 'User Assignments', icon: 'subscriptions' }
      ],
      company_report_email: false,
      firstName: '',
      lastName: '',
      newPhoto: [],
      picture: '',
      weekly_digest_email: false
    }
  },
  created() {
    this.previousData()
    this.courseMinutesInfo()
    this.tab = this.$route.params.section
  },
  watch: {
    tab: {
      handler(val) {
        if (!val) {
          val = 'profile'
          this.tab = 'profile'
        }
        this.$router.push('/portal/profile/' + val)
      }
    },
    'profileStore.isLoading': {
      handler() {
        if (this.profileStore.isLoading) {
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
    },
    'fetchUserInfo.picture': {
      deep: true,
      immediate: true,
      handler() {
        if (this.fetchUserInfo.picture) {
          this.picture = this.fetchUserInfo.picture
        }
      }
    }
  },
  async mounted() {
    this.firstName = this.fetchUserInfo.firstName
    this.lastName = this.fetchUserInfo.lastName
    this.weekly_digest_email = LocalStorage.getItem('weekly_digest_email') ?? false
    this.company_report_email = LocalStorage.getItem('company_report_email') ?? false

    if (!this.dashboardCourses?.length) {
      await this.fetchDashboardCourses()
    }

    this.numberOfCourses = this.dashboardCourses.slice(0, 4)
  },
  setup() {
    const profileStore = useProfileStore()
    const router = useRouter()
    const $q = useQuasar()
    const loginStore = useLoginStore()
    const coursesStore = useCoursesStore()
    const macroMetaStore = useMacroMetaStore()

    const splitterModel = ref(20)

    const isDark = computed(() => $q.dark.isActive)

    const fetchUserInfo = computed(() => {
      return loginStore.fetchUserInfo
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

    const moveToCourseInfo = async (event) => {
      const data = event.info
      if (data.disabled) return

      if (data.upgrade) {
        await router.push(`/portal/course-info/info/${urlSafeBase64Encode(data.id)}`)
      } else if (data.is_enrolled) {
        await redirectionToCoursePage(data, false)
      } else if (!data.is_enrolled) {
        await coursesStore.enrollUserCourse({ event_id: data.id })

        if (coursesStore.statusOfEnroll) {
          await redirectionToCoursePage(data, true)
        }
      }
    }

    const redirectionToCoursePage = async (data, enroll = false) => {
      const payload = {
        event_id: data.id
      }
      await coursesStore.fetchCourse(payload)
      if (enroll) {
        await addAnalytics(data.id, coursesStore.courseInfo.learningPaths)
      }
      if (
        coursesStore.courseHeaderData.id === data.id &&
        coursesStore.courseHeaderData.is_enrolled &&
        coursesStore.courseHeaderData.is_active
      ) {
        let statusBreak = false
        let index = 0
        for (const item of coursesStore.courseOutlineData) {
          if (statusBreak) {
            break
          }
          let subItemsIndex = 0
          if (item.items ? item.items.length > 0 : false) {
            for (const subItems of item.items) {
              if (subItems.url) {
                if (
                  !subItems.isCompleted ||
                  (coursesStore.courseOutlineData.length === index + 1 && subItemsIndex + 1 === item.items.length)
                ) {
                  statusBreak = true
                  await router.push(subItems.url)
                  break
                }
              }
              subItemsIndex++
            }
          }
          index++
        }
      }
    }

    const addAnalytics = async (eventId, learningPaths) => {
      await macroMetaStore.publishCourseStats({
        course: eventId,
        learning_path: learningPaths
      })
    }

    const onRejected = () => {
      $q.notify({
        type: 'negative',
        message: `Maximum file size is 6MB`
      })
    }

    return {
      loginStore,
      isDark,
      fetchUserInfo,
      minLength,
      maxLength,
      isCompanyAdmin,
      userAvatar,
      userId,
      splitterModel,
      moveToCourseInfo,
      onRejected,
      profileStore,
      coursesStore,
      macroMetaStore
    }
  },
  methods: {
    ...piniaActions(useDashboardStore, ['fetchDashboardCourses']),
    previousData() {
      this.dropdownOptions = previousDates()
      this.dropdownValue = currentYearOld()
    },
    async courseMinutesInfo() {
      const payload = {
        user_id: LocalStorage.getItem('user')?.email,
        key: 'course_minutes'
      }
      await this.coursesStore.fetchDashboardAnalyticsInfo(payload)
    },

    async updateProfile() {
      const data = {
        first_name: this.firstName,
        last_name: this.lastName,
        weekly_digest_email: this.weekly_digest_email
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
        const user = await this.profileStore.updateProfilePicture(payload)
        if (user) {
          this.loginStore.user = user
        }
      }
    },

    openFile() {
      this.$refs.uploadFile.pickFiles()
    }
  },
  computed: {
    ...mapState(useDashboardStore, ['dashboardCourses'])
  }
}
</script>
