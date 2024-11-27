<template>
  <div>
    <q-page>
      <div class="row">
        <div class="q-pa-xs col-xs-2 col-sm-2 col-md-2 col-lg-2">
          <IndividualPageSideBar />
        </div>
        <div class="q-pa-xs col-xs-10 col-sm-10 col-md-10 col-lg-10">
          <IndividualPageContent />
        </div>
      </div>
    </q-page>
  </div>
</template>
<script setup>
import { defineComponent } from 'vue'

import IndividualPageContent from 'components/course/IndividualPageContent.vue'
import IndividualPageSideBar from 'components/course/IndividualPageSideBar.vue'

defineComponent({
  name: 'IndividualPage'
})
</script>
