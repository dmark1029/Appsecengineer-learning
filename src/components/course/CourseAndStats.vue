<template>
  <div class="paddingData">
    <div class="row" style="text-align: left">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <p class="text-h5 text-weight-bold ase-roboto ase-black-shade none-spacing">
          {{ coursesStore.courseInfo.name }}
        </p>
      </div>
      <div class="col-md-2 col-sm-2 col-xs-6">
        <span>
          <q-icon size="xs" name="timer" color="grey-8" style="padding-right: 7px" />
          <label class="ase-xs ase-roboto" style="display: inline-block">
            <p class="text-caption text-weight-regular ase-roboto ase-black-shade none-spacing">
              {{ coursesStore.totalCourseMinutes }}
            </p>
          </label>
        </span>
      </div>
      <div class="col-md-2 col-sm-2 col-xs-6">
        <span>
          <q-icon size="xs" name="note" color="grey-8" style="padding-right: 7px" />
          <label class="ase-xs ase-roboto" style="display: inline-block">
            <p class="text-caption text-weight-regular ase-roboto ase-black-shade none-spacing">
              {{ coursesStore.courseOutlineData.length + ' Lessons' }}
            </p>
          </label>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { useCoursesStore } from 'src/store/pinia/courses'
import { defineComponent, shallowRef } from 'vue'

defineComponent({ name: 'LCourseAndStats' })

const coursesStore = useCoursesStore()

const isDownloading = shallowRef(false)
const tab = shallowRef('description')

function downloadContentFile(url) {
  isDownloading.value = true
  setTimeout(() => {
    isDownloading.value = false
    window.open(urlSafeBase64Decode(url), '_blank')
  }, 1000)
}
</script>
<style scoped>
.borderRaius {
  border-radius: 15px;
}
.imgResize {
  width: 100%;
}
.textAlignmentBox {
  padding-top: 1%;
  text-align: left;
}
.paddingData {
  padding: 1%;
}
.bg_color {
  background: #345ead;
}
.heightAlignment {
  min-height: 100%;
}
</style>
