<template>
  <q-card>
    <q-list v-for="rate in ratingObject" :key="rate.sk">
      <q-item>
        <q-item-section>
          <q-item-label>
            <p class="text-subtitle2 text-weight-bold ase-roboto ase-black-shade">
              {{ rate.sk.split('#')[0] }}
            </p>
          </q-item-label>
          <q-item-label caption style="padding-left: 0px">
            <p class="text-caption text-weight-bold ase-roboto ase-black-shade">
              {{ rate.description }}
            </p>
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>
            <p class="text-caption text-weight-bold ase-roboto ase-black-light">
              {{ timeDefault(rate.created_on) }}
            </p>
          </q-item-label>
          <q-rating :value="rate.rating" size="1em" :max="5" :style="{ color: '#FFCE73' }" color="#FFCE73" />
        </q-item-section>
      </q-item>

      <q-separator spaced inset />
    </q-list>
    <div v-if="ratingObject.length === 0" align="middle">
      <p class="text-h4 text-weight-bold ase-roboto ase-black-light line-height-normal padding_12">No data</p>
    </div>
  </q-card>
</template>

<script setup>
import { timeSince } from 'src/utils/reuseFunctions'
import { defineComponent } from 'vue'

defineComponent({
  name: 'RatingInfoSectionPage'
})

defineProps({
  ratingObject: {
    required: true
  }
})

function timeDefault(key) {
  const dt = new Date(key)
  const udt = new Date(dt.getTime() - dt.getTimezoneOffset() * 60 * 1000)
  const date = timeSince(udt)
  return date
}
</script>
