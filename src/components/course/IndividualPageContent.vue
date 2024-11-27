<template>
  <div>
    <q-page>
      <div class="row">
        <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <q-video :ratio="16 / 8" src="https://player.vimeo.com/video/76979871?autoplay=1&loop=1&autopause=0" />
        </div>
      </div>
    </q-page>
  </div>
</template>
<script setup>
import { defineComponent } from 'vue'

defineComponent({
  name: 'IndividualPageContent'
})
</script>
