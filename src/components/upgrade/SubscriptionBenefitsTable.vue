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
        <q-td class="bg-grey-3" key="challenger" :props="props"></q-td>
        <q-td class="bg-grey-3" key="pro" :props="props"></q-td>
        <q-td class="bg-grey-3" key="proPlus" :props="props"></q-td>
      </q-tr>
      <q-tr v-else :props="props">
        <q-td class="benefit-cell flex items-center justify-between" key="benefit" :props="props">
          {{ props.row.benefit }}
          <q-btn dense flat round size="sm" @click="props.expand = !props.expand" :icon="props.expand ? 'expand_less' : 'expand_more'" />
        </q-td>
        <q-td class="benefit-cell" key="challenger" :props="props">
          <span v-if="typeof props.row.challenger === 'boolean'">
            <q-icon :color="props.row.challenger ? 'accent' : 'grey'" :name="props.row.challenger ? 'check_circle' : 'cancel'" size="sm" />
          </span>
          <span v-else>{{ props.row.challenger }}</span>
        </q-td>
        <q-td class="benefit-cell" key="pro" :props="props">
          <span v-if="typeof props.row.pro === 'boolean'">
            <q-icon :color="props.row.pro ? 'accent' : 'grey'" :name="props.row.pro ? 'check_circle' : 'cancel'" size="sm" />
          </span>
          <span v-else>{{ props.row.pro }}</span>
        </q-td>
        <q-td class="benefit-cell" key="proPlus" :props="props">
          <span v-if="typeof props.row.proPlus === 'boolean'">
            <q-icon :color="props.row.proPlus ? 'accent' : 'grey'" :name="props.row.proPlus ? 'check_circle' : 'cancel'" size="sm" />
          </span>
          <span v-else>{{ props.row.proPlus }}</span>
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
        { name: 'challenger', align: 'center', label: 'CHALLENGER', field: 'challenger' },
        { name: 'pro', align: 'center', label: 'PRO', field: 'pro' },
        { name: 'proPlus', align: 'center', label: 'PRO PLUS', field: 'proPlus' }
      ],
      rows: [
        { isSubtitle: true, benefit: 'ACCESS TO LEARNING PATHS & COURSES' },
        {
          benefit: 'Unlimited Courses',
          challenger: 'Limited Access',
          pro: 'Unlimited Access',
          proPlus: 'Unlimited Access',
          description: 'Gain unlimited access to all our courses in Kubernetes, AWS, Azure and so much more'
        },
        {
          benefit: 'Quizzes and Interview Prep Kits (coming soon)',
          challenger: false,
          pro: true,
          proPlus: true,
          description: 'Gain unlimited access to all our courses in Kubernetes, AWS, Azure and so much more'
        },
        {
          benefit: 'Learning Paths',
          challenger: 'Unlimited Access',
          pro: 'Unlimited Access',
          proPlus: 'Unlimited Access',
          description: 'Take any course you want in our whole catalog and learn at your pace.'
        },
        {
          benefit: 'Unlimited Guided Hands-on Labs',
          challenger: 'Unlimited Access',
          pro: 'Unlimited Access',
          proPlus: 'Unlimited Access',
          description: 'Get unlimited access to all our labs and learning material for extensive hand-on practice.'
        },
        {
          benefit: 'Playgrounds',
          challenger: true,
          pro: true,
          proPlus: true,
          description:
            'Quickly launch a secure, in-browser Cloud Playground. Learn by Doing in live AWS, Azure, and GCP sandbox environments – without racking up an unexpected bill.'
        },
        {
          benefit: 'Challenges',
          challenger: true,
          pro: true,
          proPlus: true,
          description:
            'Designed to test & evaluate your cloud and appsec skills. Challenges present you with real-world security problems, needing real-world solutions.'
        },
        {
          benefit: 'Badges and Skills Certifications',
          challenger: true,
          pro: true,
          proPlus: true,
          description:
            'Display your new arsenal of skills on your social media and add to your resume, with cool new certificates and badges for every course and challenge'
        },
        {
          benefit: 'Learning Path Roadmaps',
          challenger: true,
          pro: true,
          proPlus: true,
          description: 'Know the right courses to take to achieve all your immediate and long term infosec career goals.'
        },
        { isSubtitle: true, benefit: 'GUIDED HANDS-ON LABS' },
        {
          benefit: 'Unlimited Cloud Servers for Hands-on Labs',
          challenger: 'Unlimited Access',
          pro: 'Unlimited Access',
          proPlus: 'Unlimited Access',
          description:
            'Spin up pre-configured, auto-provisioned servers in a click, without unexpected bill. Learn all your new skills by actually doing.'
        },
        {
          benefit: 'Unlimited Playgrounds for Learning',
          challenger: 'Unlimited Access',
          pro: 'Unlimited Access',
          proPlus: 'Unlimited Access',
          description:
            'Drum up those real-world skills by enjoying unlimited access to cloud environment, completely in-browser. Without the worry of a surprise bill.'
        },
        {
          benefit: 'Unlimited Challenges for Enhanced Skills',
          challenger: 'Unlimited Access',
          pro: 'Unlimited Access',
          proPlus: 'Unlimited Access',
          description: 'Display and test your know-how with fun interactive challenges.Learn to break and build!'
        },
        {
          benefit: 'AWS and Azure Sandboxes for zero friction cloud security learning',
          challenger: false,
          pro: false,
          proPlus: true,
          description: 'Display and test your know-how with fun interactive challenges.Learn to break and build!'
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
