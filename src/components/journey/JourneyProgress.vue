<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()
</script>

<template>
  <q-card
    flat
    class="journey-progress-card basic-shadow overflow-hidden"
    :class="[$q.dark.isActive ? 'dark-border' : 'dark-border-lighter']"
  >
    <q-card-section class="q-pa-none">
      <div class="full-width relative-position">
        <q-img src="https://picsum.photos/500/300" :ratio="16 / 9" />
        <div
          class="img-chip absolute-top-right avenir-bold q-px-sm row items-center justify-center"
          :class="{
            dark: $q.dark.isActive
          }"
        >
          DEVOPS
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <h6 class="avenir-bold q-ma-none">Progress</h6>
      <div class="row no-wrap items-center full-width justify-center q-my-sm">
        <q-linear-progress
          size="10px"
          track-color="#cdcdda33"
          rounded
          :value="70 / 100"
          animation-speed
          aria-label="Course progress"
          class="course-progress progress-bar"
        />
        <span class="text-caption q-ml-md progress-value">70%</span>
      </div>
      <p
        class="q-mt-md q-mb-none text-grey-light info"
        :class="{
          'text-grey-2': $q.dark.isActive
        }"
      >
        Finish your journey to get your certificate
      </p>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pb-none">
      <h6 class="avenir-bold q-ma-none">Details</h6>

      <div v-for="(benefit, index) in [1, 2, 3, 4, 5]" :key="index" class="row items-start q-my-md">
        <q-img :src="`/svg/light/correct_filled.svg`" :ratio="1" width="20px" class="q-mr-sm" />
        <p :style="{ fontSize: '1rem' }" class="q-mb-none">Beginner - Advanced</p>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-btn flat class="btn-bittersweet text-capitalize full-width">Enroll now</q-btn>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <p :style="{ fontSize: '16px' }" class="avenir-bold">Name of the next lesson/course here. Porem ipsum dolet,scing elit.</p>
      <q-btn flat class="btn-bittersweet bg-primary-light text-primary text-capitalize full-width">
        Next lesson
        <q-icon name="east" size="sm" color="primary" />
      </q-btn>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
.journey-progress-card {
  width: 350px;
  position: sticky;
  top: 6rem;
  .img-chip {
    background: #ffffff99;
    right: 10px;
    top: 10px;
    border-radius: 20px;
    height: 20px;
    font-size: 12px;
    &.dark {
      color: $night-blue;
    }
  }

  .progress-bar {
    height: 11px;
  }

  .info {
    font-size: 18px;
  }

  .progress-value {
    font-size: 13px;
  }
}
</style>
