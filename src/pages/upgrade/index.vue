<template>
  <section>
    <ConfettiExplosion v-if="visible" :particleCount="300" :particleSize="20" :stageHeight="1000" :stageWidth="2000" :duration="8000" />
    <div
      v-if="
        (subscriptionInfoData.data && Object.keys(subscriptionInfoData.data).length === 0 && isCompanyAdmin === 'false') || !isCompanyAdmin
      "
    >
      <q-img src="~assets/congratsInd.png" :ratio="16 / 9" dense></q-img>
      <div class="text-center">
        <div class="text-h6 text-weight-medium text-indigo-5">Congratulations!</div>
        <div class="text-subtitle1 text-weight-medium">
          You are using AppSecEngineer™ Pro Plus, the highest tier plan for Individuals.
          <br />
          If you would like to start training a team or add more users,
          <div @click="goInTouch" class="cursor-pointer"><u>contact sales by clicking here.</u></div>
        </div>
      </div>
    </div>
    <div
      v-else-if="
        (subscriptionInfoData.data &&
          Object.keys(subscriptionInfoData.data).length === 0 &&
          isCompanyAdmin === 'true' &&
          companyUsersStore.companyInfo.priceId === 'Enterprise-Pro-USD-Yearly') ||
        !isCompanyAdmin
      "
    >
      <q-img src="~assets/congratsInd.png" :ratio="16 / 9" dense></q-img>
      <div class="text-center">
        <div class="text-h6 text-weight-medium text-indigo-5">Congratulations!</div>
        <div class="text-subtitle1 text-weight-medium">
          Congratulations! You are using AppSecEngineer™ Enterprise, the highest tier plan for Enterprises.
          <br />
          If you would like to add more users,
          <div @click="goInTouch" class="cursor-pointer"><u>contact sales by clicking here.</u></div>
        </div>
      </div>
    </div>
    <section class="text-center" v-else>
      <h4 class="text-bold">Plans & Pricing</h4>
      <div v-if="isCompanyAdmin === 'false' || !isCompanyAdmin">
        <q-btn-group class="text-accent" rounded unelevated>
          <q-btn
            class="text-bold"
            :class="{ 'bg-accent text-primary': tab === 'subscriptions' }"
            :flat="tab === 'subscriptions'"
            label="Subscriptions"
            outline
            @click="tab = 'subscriptions'"
          />
          <q-btn
            v-if="
              subscriptionInfoData?.data?.['Individual-AWS-Security-Specialist'] ||
              subscriptionInfoData?.data?.['Individual-DevSecOps-Security-Specialist']
            "
            class="text-bold"
            :class="{ 'bg-accent text-primary': tab === 'bundles' }"
            :flat="tab === 'bundles'"
            label="Bundles"
            outline
            @click="tab = 'bundles'"
          />
        </q-btn-group>

        <q-tab-panels animated class="q-my-md" v-model="tab">
          <q-tab-panel class="row items-center justify-evenly q-pa-lg" name="subscriptions">
            <SubscriptionCard
              v-if="subscriptionInfoData.data && subscriptionInfoData.data['Individual-Challenger']"
              :benefits="challengerBenefits"
              class="col-3"
              :data="subscriptionInfoData.data['Individual-Challenger']"
              discount="33"
              space="xs"
              :subtitle="`Play with 100+ challenges,\nnew releases every week`"
              title="Challenger"
              @onCheckout="onCheckout"
            />
            <SubscriptionCard
              v-if="subscriptionInfoData.data && subscriptionInfoData.data['Individual-Pro']"
              :benefits="proBenefits"
              class="col-3"
              :data="subscriptionInfoData.data['Individual-Pro']"
              discount="52"
              space="md"
              :subtitle="`Learn-by-doing in\nunlimited hands-on Labs`"
              title="Pro"
              @onCheckout="onCheckout"
            />
            <SubscriptionCard
              v-if="subscriptionInfoData.data && subscriptionInfoData.data['Individual-Pro-Plus']"
              :benefits="proPlusBenefits"
              class="col-12"
              dark
              :data="subscriptionInfoData.data['Individual-Pro-Plus']"
              discount="47"
              space="lg"
              :subtitle="`Learn-by-doing in\nunlimited hands-on Labs\nand sandboxes`"
              title="Pro Plus"
              @onCheckout="onCheckout"
            />
            <SubscriptionBenefitsTable class="col-12" />
          </q-tab-panel>
          <q-tab-panel class="flex items-center justify-evenly q-pa-lg" name="bundles">
            <BundleCard
              :benefits="awsSecurityBenefits"
              :data="subscriptionInfoData.data['Individual-AWS-Security-Specialist']"
              :subtitle="`Train for the most sought-after\nsecurity skills in tech`"
              title="AWS Security Specialist"
              @onCheckout="onCheckout"
            />
            <BundleCard
              :benefits="devSecOpsBenefits"
              :data="subscriptionInfoData.data['Individual-DevSecOps-Security-Specialist']"
              :subtitle="`Speed up security process and\nlearn to secure any tech stack`"
              title="DevSecOps Security Specialist"
              @onCheckout="onCheckout"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>

      <div v-else-if="isCompanyAdmin === 'true'" class="row items-center justify-evenly q-pa-lg">
        <SubscriptionCard
          v-if="subscriptionInfoData.data && subscriptionInfoData.data.hasOwnProperty('Enterprise-Basic')"
          :benefits="businessBelefits"
          class="col-3"
          :data="subscriptionInfoData.data['Enterprise-Basic']"
          discount="42"
          isOrganization
          space="xs"
          subtitle="Upskill smaller teams with hands-on learning, challenges playgrounds.\n\nRequires a minimun of 5 learners."
          title="Business"
          @onCheckout="onCheckout"
        />
        <SubscriptionCard
          v-if="subscriptionInfoData.data && subscriptionInfoData.data.hasOwnProperty('Enterprise-Plus')"
          :benefits="businessPlusBelefits"
          class="col-3"
          :data="subscriptionInfoData.data['Enterprise-Plus']"
          discount="42"
          isOrganization
          space="sm"
          subtitle="Upskill mid-size teams of 5 or more with hands-on learning, challenges and sandboxes, made easy with the admin panel.\nRequires a minimun of 5 learners."
          title="Business Plus"
          @onCheckout="onCheckout"
        />
        <SubscriptionCard
          v-if="subscriptionInfoData.data && subscriptionInfoData.data.hasOwnProperty('Enterprise-Pro')"
          :benefits="enterpriseBelefits"
          class="col-3"
          dark
          :data="subscriptionInfoData.data['Enterprise-Pro']"
          isOrganization
          onlyTouch
          space="md"
          subtitle="Fully scalable. Hands-on learning for Large teams, made easy with the admin panel. Accelerate team learning with champions, challenges, sandboxes and playgrounds."
          title="Enterprise"
          @goInTouch="goInTouch"
        />
        <BundleBenefitsTable class="col-12 q-pa-md" />
      </div>
    </section>
    <div id="popup" style="display: none">
      <q-bar class="bg-white none-spacing">
        <p class="text-subtitle1 text-weight-bold ase-roboto ase-black-shade none-spacing">GET IN TOUCH</p>
        <q-space />
        <q-btn class="ase-roboto ase-md" color="secondary" round size="sm" icon="close" @click="closePopup" />
        <hr />
        <br />
      </q-bar>
      <br />
    </div>
  </section>
</template>

<script>
import BundleBenefitsTable from 'components/upgrade/BundleBenefitsTable.vue'
import BundleCard from 'components/upgrade/BundleCard.vue'
import SubscriptionBenefitsTable from 'components/upgrade/SubscriptionBenefitsTable.vue'
import SubscriptionCard from 'components/upgrade/SubscriptionCard.vue'
import { QSpinnerFacebook } from 'quasar'
import config from 'src/config'
import { useLoginStore } from 'src/store/pinia/login'
import { checkout } from 'src/utils/checkout'
import { computed } from 'vue'

import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'
import ConfettiExplosion from 'vue-confetti-explosion'

export default {
  components: { SubscriptionCard, BundleCard, BundleBenefitsTable, SubscriptionBenefitsTable },
  data() {
    return {
      visible: false,
      tab: 'subscriptions',
      showPopup: false,
      subscriptionInfoData: {},
      userPlanInfo: {},
      learners: 0,
      challengerBenefits: [
        { text: 'Access to Learning Paths & Courses' },
        { text: 'Guided Hands-on Labs' },
        { included: true, text: 'Challenges (UNLIMITED access)' },
        { included: true, text: 'Badges' },
        { text: 'Playgrounds' },
        { text: 'Learning Path Roadmaps' },
        { text: 'AWS Azure & GCP sandboxes' }
      ],
      proBenefits: [
        { included: true, text: 'Access to All Learning Paths & Courses: unlimited' },
        { included: true, text: 'Guided Hands-on Labs' },
        { included: true, text: 'Challenges (UNLIMITED access)' },
        { included: true, text: 'Badges' },
        { included: true, text: 'Playgrounds' },
        { included: true, text: 'Learning Path Roadmaps' },
        { text: 'AWS Azure & GCP sandboxes' }
      ],
      proPlusBenefits: [
        { included: true, text: 'Access to All Learning Paths & Courses: unlimited' },
        { included: true, text: 'Guided Hands-on Labs' },
        { included: true, text: 'Challenges (UNLIMITED access)' },
        { included: true, text: 'Badges' },
        { included: true, text: 'Playgrounds' },
        { included: true, text: 'Learning Path Roadmaps' },
        { included: true, text: 'AWS Azure & GCP sandboxes' }
      ],
      awsSecurityBenefits: [
        { included: true, text: 'Access to all courses in AWS Security' },
        { included: true, text: 'Access to all courses in Container Security' },
        { included: true, text: 'Access to Guided Hands-on Labs (in AWS Security & Container Security)' },
        { included: true, text: 'Access to AWS Security Challenges' },
        { included: true, text: 'Badges' },
        { included: true, text: 'Access to AWS Security Playgrounds' },
        { included: true, text: 'Learning path Roadmaps (in AWS Security)' },
        { included: true, text: 'Access to AWS Cloud Sandbox' }
      ],
      devSecOpsBenefits: [
        { included: true, text: 'Access to all courses in DevSecOps' },
        { included: true, text: 'Access to all courses in container Security' },
        { included: true, text: 'Access to Guided Hands-on Labs (in DevSecOps & Container Security)' },
        { included: true, text: 'Access to DevSecOps Challenges' },
        { included: true, text: 'Badges' },
        { included: true, text: 'Access to DevSecOps Playgrounds' },
        { included: true, text: 'Learning path Roadmaps (in DevSecOps)' }
      ],
      businessBelefits: [
        { included: true, text: 'Access to All Learning Paths & Courses' },
        { included: true, text: 'Guided Hands-on Labs' },
        { included: true, text: 'Challenges: Unlimited' },
        { included: true, text: 'Playgrounds: Unlimited' },
        { included: true, text: 'Learning Path Roadmaps' },
        { text: 'AWS, Azure & GCP sandboxes' },
        { text: 'Skills Assessments' },
        { text: 'Custom Learning Paths & Challenges' }
      ],
      businessPlusBelefits: [
        { included: true, text: 'Access to ALL Learning Paths & Courses: Unlimited' },
        { included: true, text: 'Guided Hands-on Labs: Unlimited' },
        { included: true, text: 'Challenges: Unlimited' },
        { included: true, text: 'Playgrounds: Unlimited' },
        { included: true, text: 'Learning Path Roadmaps' },
        { included: true, text: 'AWS, Azure & GCP sandboxes' },
        { text: 'Skills Assessments' },
        { text: 'Custom Learning Paths & Challenges' }
      ],
      enterpriseBelefits: [
        { included: true, text: 'Access to ALL Learning Paths & Courses: Unlimited' },
        { included: true, text: 'Guided Hands-on Labs' },
        { included: true, text: 'Challenges: Unlimited' },
        { included: true, text: 'Playgrounds: Unlimited' },
        { included: true, text: 'Badges: Unlimited' },
        { included: true, text: 'Learning Path Roadmaps' },
        { included: true, text: 'AWS, Azure & GCP sandboxes' },
        { included: true, text: 'Skills Assessments' },
        { included: true, text: 'Custom Learning Paths & Challenges' }
      ]
    }
  },
  async created() {
    //this.isStatus(true)
    this.companyUsersStore
      .subscriptionInfo()
      .then((res) => (this.subscriptionInfoData = res))
      .catch((err) => console.warn(err))
    if (this.isCompanyAdmin === 'true' && !this.companyUsersStore.companyInfo.name) {
      //this.isStatus(true)
      this.companyUsersStore.fetchCompanyInfo()
    }
  },
  watch: {
    'companyUsersStore.isLoading': {
      handler() {
        if (this.companyUsersStore.isLoading) {
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
  methods: {
    async onCheckout(payload) {
      const errorMsgs = {}
      const url = payload.company_name ? config.baseURLEnterprise : config.baseURLIndividual

      await checkout(url, payload)
        .then(() => {
          this.companyUsersStore.checkPlansInfo().then((subInfo) => {
            this.loginStore.setUserType(subInfo.data.type === 'FT' ? 'IND' : subInfo.data.type)
            this.loginStore.setUserSubs(subInfo.data.subs_)
          })
          this.companyUsersStore.subscriptionInfo().then((res) => (this.subscriptionInfoData = res))
          this.$router.push('/portal/dashboard')
          this.$q.notify({ message: 'Your payment was successful!', color: 'positive', icon: 'check', position: 'top' })
          this.visible = true
          setTimeout(() => (this.visible = false), 9000)
        })
        .catch((err) => (errorMsgs.value = err.errorMsgs))
    },
    goInTouch() {
      this.showPopup = true
      const popup = document.getElementById('popup')
      const script = document.createElement('script')
      script.async = true
      script.setAttribute('data-uid', 'b45eb9c498')
      script.src = 'https://appsecengineer.ck.page/b45eb9c498/index.js'
      popup.appendChild(script)
      popup.style.display = 'block'
    },
    closePopup(event) {
      window.location.reload()
      const popup = document.getElementById('popup')
      if (!popup.contains(event.target)) {
        this.showPopup = false

        popup.style.display = 'none'
        popup.innerHTML = ''

        let script = popup.querySelector('script')
        if (script !== null) {
          script.remove()
          script = null
        }

        document.addEventListener('click', (event) => this.closePopup(event))
      }
    }
  },
  setup() {
    const loginStore = useLoginStore()
    const companyUsersStore = useCompanyConsumerStore()
    const isCompanyAdmin = computed(() => {
      return loginStore.isCompanyAdmin.toString()
    })

    return {
      loginStore,
      isCompanyAdmin,
      companyUsersStore
    }
  }
}
</script>

<style scoped>
#popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  background-color: #fff;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>
