<script setup>
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const dark = computed(() => $q.dark.isActive)
</script>

<template>
  <div class="journey-card-wrapper full-height q-mx-sm q-mb-md">
    <q-card flat class="journey-card full-width overflow-hidden" :class="[dark ? 'dark-border' : 'dark-border-lighter']">
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

      <q-card-section class="q-pb-sm">
        <h6 class="q-ma-none q-pr-xl avenir-bold">21-day Curated Beginner DevSecOps Journey</h6>
        <p class="text-capitalize q-mt-sm q-mb-none" :style="{ fontSize: '14px' }">
          Rorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulp utate libero et velit taciti sociosqu ad litora torquent per
          conubia nostra, per inceptos.
        </p>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-none row" style="height: 40px">
        <div class="col-grow q-px-md row items-center">
          <div class="level-circle bg-aqua-green" />
          <p class="q-ml-sm q-my-none" style="font-size: 12px; margin-top: 3px" :class="[dark ? 'text-grey-2' : 'text-grey-light']">
            Beginner
          </p>
        </div>

        <q-separator vertical />

        <div class="row items-center justify-center q-px-sm">
          <p class="q-my-none text-no-wrap" style="font-size: 12px" :class="[dark ? 'text-grey-2' : 'text-grey-light']">26h 40m</p>
        </div>

        <q-separator vertical />

        <div
          class="row items-center justify-center cursor-pointer"
          :class="[dark ? 'bg-indigo-gradiant' : 'bg-indigo-gradiant-light']"
          style="width: 5.5rem"
          @click="
            router.push({
              name: 'journeys.journey',
              params: {
                journeyId: 'fake-id'
              }
            })
          "
        >
          <q-icon name="east" size="sm" :class="[dark ? 'text-white' : 'text-electric-indigo']" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.journey-card {
  .level-circle {
    height: 12px;
    width: 12px;
    background-color: $aqua-green;
    clip-path: circle();
  }

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
}
</style>
