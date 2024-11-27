<template>
  <div class="full-height">
    <BaseCard
      class="full-height flex text-subtitle1 cursor-pointer q-pt-md q-px-sm q-pb-sm"
      @click="moveToCourseInfo(data)"
      :class="{ 'no-pointer-events': loading }"
    >
      <div class="full-width content-wrapper">
        <WishlistAction :event="data" v-bind="$attrs" />
        <q-card-section class="q-pa-none col-2 q-mt-sm">
          <q-img
            class="br-10"
            v-if="data.logo"
            loading="eager"
            :src="data.logo"
            style="border-radius: 8px"
            @mouseover="showIcon = false"
            @mouseleave="showIcon = true"
            height="auto"
            fit="fill"
          />
        </q-card-section>
        <slot name="footer" v-bind="data">
          <q-card-section class="full-width self-end q-pa-none q-mt-sm">
            <div class="ellipsis-2-lines text-subtitle1">{{ data.event_name }}</div>
          </q-card-section>
          <q-card-section class="q-pa-none col-2" v-if="data.live_at">
            <div class="row justify-between">
              {{ `${fullDateTimeUTC(data.live_at)}` }}
            </div>
            <q-separator class="q-mt-sm" />
          </q-card-section>

          <q-card-section class="full-width q-pa-none ma-auto">
            <div
              class="align-center self-end q-pa-none row full-width q-my-md"
              :class="[data.proficiency ? 'justify-between' : 'justify-end']"
            >
              <q-chip v-if="data.proficiency" :clickable="false" color="grey-4" text-color="primary">
                {{ data.proficiency === 'Basic' ? 'Beginner' : data.proficiency }}
              </q-chip>
            </div>
            <template v-if="data.is_enrolled">
              <q-linear-progress size="sm" rounded :value="data.progress / 100" color="green" aria-label="Course progress" />
              <div class="row justify-between">
                <p class="text-caption">{{ `${data.progress}% complete` }}</p>
                <p class="text-caption" v-if="data.total">
                  {{ data.completed }}
                  <span>/{{ data.total }} Lessons</span>
                </p>
              </div>
            </template>

            <BaseBtn
              v-else
              @click.stop="moveToCourseInfo(data)"
              unelevated
              class="full-width text-weight-regular"
              :label="data.live_at ? 'Enroll' : 'Start'"
              color="primary"
              :loading="loading"
            />
          </q-card-section>
        </slot>
      </div>
    </BaseCard>

    <CourseTooltip :data="data" v-if="data && data.instructors" />
  </div>
</template>

<script setup>
import { fullDateTimeUTC } from 'src/utils/reuseFunctions'
import { BaseBtn } from '../wrappers/BaseBtn'
import { BaseCard } from '../wrappers/BaseCard'

import CourseTooltip from 'src/components/course/common/CourseTooltip.vue'
import WishlistAction from 'src/components/course/WishlistAction.vue'
import { defineComponent, shallowRef } from 'vue'

defineComponent({
  name: 'DashboardSlideView'
})

defineProps({
  data: { required: true, type: Object },
  loading: {
    type: [Boolean, String],
    default: false
  }
})

const emit = defineEmits(['moveToCourseInfo'])

function moveToCourseInfo(data) {
  emit('moveToCourseInfo', { info: data })
}

const showIcon = shallowRef(true)
</script>

<style lang="scss" scoped>
.w-min-content {
  width: min-content !important;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.ma-auto {
  margin-top: auto;
}
</style>
