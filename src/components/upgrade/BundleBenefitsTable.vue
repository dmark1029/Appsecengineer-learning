<template>
  <BaseTable
    class="q-mt-xl"
    :columns="columns"
    hide-bottom
    :pagination="{ rowsPerPage: 0 }"
    row-key="benefit"
    :rows="rows"
    style="width: 1200px; max-width: 90vw"
  >
    <template v-slot:header="props">
      <q-tr class="bg-accent" :props="props">
        <q-th v-for="col in props.cols" class="text-bold" :key="col.name" :props="props">{{ col.label }}</q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr v-if="props.row.isSubtitle" :props="props">
        <q-td class="benefit-cell text-bold bg-grey-3" key="benefit" :props="props">
          {{ props.row.benefit }}
        </q-td>
        <q-td class="bg-grey-3" key="business" :props="props"></q-td>
        <q-td class="bg-grey-3" key="businessPlus" :props="props"></q-td>
        <q-td class="bg-grey-3" key="enterprise" :props="props"></q-td>
      </q-tr>
      <q-tr v-else :props="props">
        <q-td class="benefit-cell flex items-center justify-between" key="benefit" :props="props">
          {{ props.row.benefit }}
          <q-btn dense flat round size="sm" @click="props.expand = !props.expand" :icon="props.expand ? 'expand_less' : 'expand_more'" />
        </q-td>
        <q-td class="benefit-cell" key="business" :props="props">
          <span v-if="typeof props.row.business === 'boolean'">
            <q-icon :color="props.row.business ? 'accent' : 'grey'" :name="props.row.business ? 'check_circle' : 'cancel'" size="sm" />
          </span>
          <span v-else>{{ props.row.business }}</span>
        </q-td>
        <q-td class="benefit-cell" key="businessPlus" :props="props">
          <span v-if="typeof props.row.businessPlus === 'boolean'">
            <q-icon
              :color="props.row.businessPlus ? 'accent' : 'grey'"
              :name="props.row.businessPlus ? 'check_circle' : 'cancel'"
              size="sm"
            />
          </span>
          <span v-else>{{ props.row.businessPlus }}</span>
        </q-td>
        <q-td class="benefit-cell" key="enterprise" :props="props">
          <span v-if="typeof props.row.enterprise === 'boolean'">
            <q-icon :color="props.row.enterprise ? 'accent' : 'grey'" :name="props.row.enterprise ? 'check_circle' : 'cancel'" size="sm" />
          </span>
          <span v-else>{{ props.row.enterprise }}</span>
        </q-td>
      </q-tr>
      <q-tr class="bg-grey-3" :props="props" v-show="props.expand">
        <q-td colspan="100%">
          <div class="text-left">{{ props.row.description }}</div>
        </q-td>
      </q-tr>
    </template>
  </BaseTable>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { name: 'benefit', align: 'left', label: '', field: 'benefit' },
        { name: 'business', align: 'center', label: 'BUSINESS', field: 'business' },
        { name: 'businessPlus', align: 'center', label: 'BUSINESS PLUS', field: 'businessPlus' },
        { name: 'enterprise', align: 'center', label: 'ENTERPRISE', field: 'enterprise' }
      ],
      rows: [
        { isSubtitle: true, benefit: 'LEARNING FUNDAMENTALS' },
        {
          benefit: 'Unlimited Courses',
          business: 'Unlimited Access',
          businessPlus: 'Unlimited Access',
          enterprise: 'Unlimited Access',
          description: 'Gain unlimited access to all our courses in Kubernetes, AWS, Azure and so much more'
        },
        {
          benefit: 'Quizzes and Interview Prep Kits (coming soon)',
          business: true,
          businessPlus: true,
          enterprise: true,
          description: 'Gain unlimited access to all our courses in Kubernetes, AWS, Azure and so much more'
        },
        {
          benefit: 'Learning Paths',
          business: 'Unlimited Access',
          businessPlus: 'Unlimited Access',
          enterprise: 'Unlimited Access',
          description: 'Take any course you want in our whole catalog and learn at your pace.'
        },
        {
          benefit: 'Unlimited Guided Hands-on Labs',
          business: 'Unlimited Access',
          businessPlus: 'Unlimited Access',
          enterprise: 'Unlimited Access',
          description: 'Get unlimited access to all our labs and learning material for extensive hand-on practice.'
        },
        {
          benefit: 'Playgrounds',
          business: true,
          businessPlus: true,
          enterprise: true,
          description:
            'Quickly launch a secure, in-browser Cloud Playground. Learn by Doing in live AWS, Azure, and GCP sandbox environments – without racking up an unexpected bill.'
        },
        {
          benefit: 'Challenges',
          business: true,
          businessPlus: true,
          enterprise: true,
          description:
            'Designed to test & evaluate your cloud and appsec skills. Challenges present you with real-world security problems, needing real-world solutions.'
        },
        {
          benefit: 'Badges and Skills Certifications',
          business: true,
          businessPlus: true,
          enterprise: true,
          description:
            'Display your new arsenal of skills on your social media and add to your resume, with cool new certificates and badges for every course and challenge'
        },
        {
          benefit: 'Learning Path Roadmaps',
          business: true,
          businessPlus: true,
          enterprise: true,
          description: 'Know the right courses to take to achieve all your immediate and long term infosec career goals.'
        },
        { isSubtitle: true, benefit: 'HANDS-ON EXPERTISE' },
        {
          benefit: 'Unlimited Cloud Servers for Hands-on Labs',
          business: 'Unlimited Access',
          businessPlus: 'Unlimited Access',
          enterprise: 'Unlimited Access',
          description:
            'Spin up pre-configured, auto-provisioned servers in a click, without unexpected bill. Learn all your new skills by actually doing.'
        },
        {
          benefit: 'Unlimited Playgrounds for Learning',
          business: 'Unlimited Access',
          businessPlus: 'Unlimited Access',
          enterprise: 'Unlimited Access',
          description:
            'Drum up those real-world skills by enjoying unlimited access to cloud environment, completely in-browser. Without the worry of a surprise bill.'
        },
        {
          benefit: 'Unlimited Challenges for Enhanced Skills',
          business: 'Unlimited Access',
          businessPlus: 'Unlimited Access',
          enterprise: 'Unlimited Access',
          description: 'Display and test your know-how with fun interactive challenges.Learn to break and build!'
        },
        {
          benefit: 'AWS and Azure Sandboxes for zero friction cloud security learning',
          business: false,
          businessPlus: true,
          enterprise: true,
          description: 'Display and test your know-how with fun interactive challenges.Learn to break and build!'
        },
        { isSubtitle: true, benefit: 'TEAM MANAGEMENT' },
        {
          benefit: 'Role-Based Access Control',
          business: 'Unlimited Access',
          businessPlus: 'Unlimited Access',
          enterprise: 'Unlimited Access',
          description: 'Manage your larger teams with ease, with specific roles and permission in the admin panel.'
        },
        {
          benefit: 'Manage Users and Teams',
          business: true,
          businessPlus: true,
          enterprise: true,
          description: 'Create groups of users and teams to make your infosec training at scale a breeze.'
        },
        {
          benefit: 'User Reports & Analytics',
          business: true,
          businessPlus: true,
          enterprise: true,
          description: 'Monitor every user’s progress on a single pane of glass. No user left behind!'
        },
        {
          benefit: 'Team Reports and Analytics',
          business: true,
          businessPlus: true,
          enterprise: true,
          description: 'Monitor each team’s progress and download detailed reports'
        },
        {
          benefit: 'User Course Assignments',
          business: true,
          businessPlus: true,
          enterprise: true,
          description: 'Assign relevant courses, playgrounds and challenges for individual users or groups of users.'
        },
        {
          benefit: 'Outlier/Exception Reports and Analytics',
          business: true,
          businessPlus: true,
          enterprise: true,
          description: 'Stay on top of everything by knowing when some users outperform or underperform the rest of the group'
        },
        {
          benefit: 'Notifications',
          business: true,
          businessPlus: true,
          enterprise: true,
          description: 'Get email updates and notifications on team learning and progress.'
        },
        {
          benefit: 'Badges and Skills Certifications',
          business: true,
          businessPlus: true,
          enterprise: true,
          description: 'Badges & certificates are automatically generated as users complete courses.'
        },
        { isSubtitle: true, benefit: 'SUPPORT' },
        {
          benefit: 'Discord Community',
          business: true,
          businessPlus: true,
          enterprise: true,
          description: 'Join over 4000 users in our Discord community and stay on the bleeding edge of InfoSec'
        },
        {
          benefit: 'Email Support',
          business: true,
          businessPlus: true,
          enterprise: true,
          description: 'Have a problem? Or even a suggestion? Reach out to our support channel for quick resolution'
        },
        {
          benefit: 'Live Events with ASE Trainers',
          business: true,
          businessPlus: true,
          enterprise: true,
          description: 'Live codes and bleeding edge content with our coveted trainers so you can stay in the know.'
        },
        {
          benefit: 'AMA Style Learning',
          business: false,
          businessPlus: false,
          enterprise: true,
          description: 'Have a question for your trainer? Ask anything!'
        },
        { isSubtitle: true, benefit: 'SCALABILITY' },
        {
          benefit: 'Password less Authentication',
          business: true,
          businessPlus: true,
          enterprise: true,
          description:
            'Goodbye SSO! Completely password less access with Magic Link across all your users and teams. No more messy passwords and no need for Single-Sign On'
        },
        {
          benefit: 'Custom Learning Paths',
          business: false,
          businessPlus: false,
          enterprise: true,
          description:
            'Get your own Learning Path tailored and perfected for your company’s needs and vision. It’s like ILT on your browser!'
        },
        {
          benefit: 'Skills Assessment',
          business: true,
          businessPlus: true,
          enterprise: true,
          description:
            'Not just any CTF: Get customised assessments for each of your teams to best assess learning status and skills acquired.'
        },
        {
          benefit: 'Interviews',
          business: false,
          businessPlus: false,
          enterprise: true,
          description: 'Comming soon...'
        },
        { isSubtitle: true, benefit: 'INTEGRATION' },
        {
          benefit: 'API Access',
          business: false,
          businessPlus: false,
          enterprise: true,
          description: 'Hook up AppSecEngineer to your organizational training platform'
        },
        { isSubtitle: true, benefit: 'PROFESSIONAL SERVICES' },
        {
          benefit: 'Onboarding and Admin training',
          business: false,
          businessPlus: false,
          enterprise: true,
          description: 'Receive training for the use and management of the AppSecEngineer platform and admin panel'
        },
        {
          benefit: 'Priority Support',
          business: false,
          businessPlus: false,
          enterprise: true,
          description: 'Enjoy world-class support for any and all queries within hours.'
        },
        {
          benefit: 'Custom Challenge & Contest Development',
          business: false,
          businessPlus: false,
          enterprise: true,
          description: 'Customized challenges and tailored contests for your organization’s unique requirements'
        },
        {
          benefit: 'Specialized Tracks for Security Champions',
          business: false,
          businessPlus: false,
          enterprise: true,
          description: 'Build your best security posture with our incredible Security Champions Programme'
        }
      ]
    }
  }
}
</script>

<style scoped>
.benefit-cell {
  font-size: 0.9rem !important;
}
</style>
