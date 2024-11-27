<script setup>
import JourneyHeader from 'components/journey/JourneyHeader.vue'
import JourneyCourses from 'components/journey/JourneyCourses.vue'
import JourneyProgress from 'components/journey/JourneyProgress.vue'
</script>

<template>
  <section>
    <JourneyHeader
      title="21-day Curated Beginner DevSecOps Journey"
      subTitle="Journey short intro here. Rorem dolor sit amet, consectetur adipiscing elit. Nunc vulp utate libero et velit taciti sociosqu ad litora torquent per conubia nostra, per inceptos"
    />

    <div class="row no-wrap justify-between q-gutter-sm journey-details-section q-mt-lg">
      <div>
        <p class="details">
          Journey description here. Torem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis
          tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas
          eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu orquent per conubia nostra, per inceptos himenaeos.
        </p>
        <div class="overview-label avenir-bold text-electric-indigo q-my-lg">Overview of this journey</div>
        <q-separator class="q-mb-md" />
        <JourneyCourses title="Courses" />
        <q-separator class="q-my-lg" />
        <JourneyCourses title="Challenges" challengesMode />
        <q-separator class="q-my-lg" />
        <JourneyCourses title="Playgrounds" playgroundsMode />
      </div>

      <div>
        <JourneyProgress />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.journey-details-section {
  .details {
    font-size: 1rem;
  }

  .overview-label {
    font-size: 1.2rem;
  }
}
</style>
