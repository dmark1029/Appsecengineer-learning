<template>
  <div class="row q-col-gutter-lg" v-if="values.length">
    <div class="col-lg-3 col-md-3 col-xs-12 col-sm-3" v-for="(item, index) in values" :key="index">
      <div class="row bordered_info cursor_pointer">
        <div class="col-12" v-if="item.logo">
          <q-img v-if="item.logo" :src="item.logo" class="top-radius" contain :ratio="16 / 9" position="top"></q-img>
        </div>
        <div class="col-12">
          <div class="row q-pa-sm">
            <div class="col-md-12 col-sm-12 col-xs-12" style="min-height: 70px">
              <div class="text-body2 text-weight-bold ase-roboto ellipsis-2-lines">
                <div class="float-left q-pr-sm">
                  <q-tooltip class="text-caption text-weight-thin ase-roboto">{{ item.description }}</q-tooltip>
                </div>
                <div class="ase_xs text-body2">
                  {{ item.event_name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CourseTooltip :data="item" v-if="item" />
    </div>
  </div>
  <NoDataCard title="No Data found" v-else />
</template>
<script>
import NoDataCard from '../NoDataCard.vue'
import CourseTooltip from 'src/components/course/common/CourseTooltip.vue'

export default {
  components: {
    NoDataCard,
    CourseTooltip
  },
  props: {
    values: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>
<style scoped lang="scss">
.bordered_info {
  border-radius: 12px 12px 12px 12px;
  border: 2.5px solid #cbcbcb;
}
.top-radius {
  border-radius: 9.5px 9.5px 0px 0px;
}
</style>
