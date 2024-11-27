<template>
  <div>
    <q-card class="none-spacing">
      <div class="row padding_12">
        <div class="col-md-5 col-sm-5 col-xs-12 flex flex-center">
          <q-img :ratio="16 / 16" width="90%" style="border-radius: 7px" height="95%" :src="logo" />
        </div>
        <div class="col-md-7 col-sm-7 col-xs-12 none-spacing">
          <div class="padding_7">
            <p class="text-subtitle2 text-weight-bold ase-roboto ase-black-shade none-spacing line_height_normal">
              {{ title }}
            </p>
            <p class="text-caption text-weight-regular ase-roboto ase-black-light none-spacing line_height_normal">
              {{ description.length > 100 ? description.substring(0, 100) + ' ... ' : description }}
            </p>
            <div class="row none-spacing">
              <div class="col-md-6 col-sm-6 col-xs-6 none-spacing">
                <p class="text-caption text-weight-bold ase-roboto ase-black-shade none-spacing line_height_normal">
                  {{ price }}
                </p>
                <span class="none-spacing">
                  <q-icon name="article" color="grey-8" style="padding-right: 0px; font-size: 10px" />
                  <label class="none-spacing" style="display: inline-block">
                    <p class="text-caption text-weight-regular ase-roboto ase-black-shade none-spacing line_height_normal">
                      {{ countCourse }} Courses
                    </p>
                  </label>
                </span>
              </div>
              <div class="col-md-6 col-sm-6 col-xs-6 padding_7" align="right">
                <q-btn
                  color="secondary"
                  push
                  size="xs"
                  @click="$emit('individualClick')"
                  class="text-subtitle2 text-weight-regular ase-roboto full-width"
                  text-color="white"
                  style="font-weight: 600; font-size: 12px"
                >
                  UPGRADE
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>
<script>
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
export default {
  name: 'SubscriptionIndividualView',
  props: {
    data: {},
    title: {},
    description: {},
    subsKey: {},
    logo: {},
    price: {},
    countCourse: {}
  },
  methods: {
    showLearningPathInfo(id) {
      this.$router.push(`/portal/learning-path-individual/${urlSafeBase64Encode(id)}`)
    },
    moveToIndividualLp(data) {}
  }
}
</script>
<style scoped></style>
