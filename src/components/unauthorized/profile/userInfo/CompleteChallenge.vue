<template>
  <div>
    <div class="row q-col-gutter-lg" v-if="values.length">
      <div class="col-lg-3 col-md-4 col-xs-12 col-sm-6" v-for="(item, index) in values" :key="index">
        <q-card class="my-card full-height column" flat bordered>
          <q-item class="bg-primary text-white card-title">
            <q-item-section>
              <q-item-label class="title">{{ item.name }}</q-item-label>
              <q-item-label>{{ item.difficulty }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-card-section horizontal>
            <q-card-section>
              <div class="text-weight-bolder text-h6">Score</div>
              <q-knob
                :step="25"
                :modelValue="item.score"
                show-value
                size="40px"
                :thickness="0.22"
                color="secondary"
                track-color="secondary"
                class="text-secondary text-weight-bolder q-mb-lg"
              />
            </q-card-section>

            <q-card-section class="q-gutter-sm">
              <q-badge color="primary" v-for="(item, index) in item.tags" :key="index">{{ item }}</q-badge>
            </q-card-section>
          </q-card-section>

          <CourseTooltip
            :data="{
              description: item.description
            }"
          />
        </q-card>
      </div>
    </div>
    <NoDataCard title="No Challenges found" v-else />
  </div>
</template>
<script>
import CourseTooltip from 'src/components/course/common/CourseTooltip.vue'
import NoDataCard from '../NoDataCard.vue'
export default {
  components: { NoDataCard, CourseTooltip },
  props: {
    values: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped>
.card-title {
  min-height: 90px;
}
</style>
