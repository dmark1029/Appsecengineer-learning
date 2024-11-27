<script setup>
import JourneyCard from 'src/components/journey/JourneyCard.vue'
</script>

<template>
  <h4 class="font-paytone q-mt-md q-mb-lg" :style="{ fontSize: '26px' }">What will you learn today?</h4>
  <div class="row full-width wrap">
    <div class="journeys-card-wrapper col-lg-4 col-md-6 col-12">
      <JourneyCard />
    </div>
    <div class="journeys-card-wrapper col-lg-4 col-md-6 col-12">
      <JourneyCard />
    </div>
    <div class="journeys-card-wrapper col-lg-4 col-md-6 col-12">
      <JourneyCard />
    </div>
    <div class="journeys-card-wrapper col-lg-4 col-md-6 col-12">
      <JourneyCard />
    </div>
    <div class="journeys-card-wrapper col-lg-4 col-md-6 col-12">
      <JourneyCard />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.journeys-card-wrapper {
  @media (min-width: 1980px) {
    max-width: 33rem !important;
  }
}
</style>
