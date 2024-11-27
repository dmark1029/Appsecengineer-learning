<template>
  <q-list>
    <q-expansion-item
      v-for="(item, index) in data"
      expand-icon-class="text-secondary"
      expand-separator
      :key="index"
      style="background-color: #f6f9fa; border-bottom: 1px solid #d8d8d8"
    >
      <template v-slot:header>
        <q-item-section>
          <p class="ase-black-light ase-roboto none-spacing text-bold">
            {{ item.subject_name }}
          </p>
        </q-item-section>
        <q-item-section side>
          <p class="ase-black-light ase-roboto none-spacing text-bold">
            {{ item.timerCourse }}
          </p>
        </q-item-section>
      </template>
      <q-card-section class="q-pa-none">
        <q-card flat>
          <q-list v-for="(content, subIndex) in item.items" class="menu-list" :key="content.id">
            <q-item class="q-py-md">
              <q-item-section class="block">
                <q-item-label>
                  <p class="q-mb-sm" style="word-break: break-all; text-overflow: ellipsis">
                    <span>
                      <q-icon
                        :color="content.isCompleted ? 'green' : 'deep-orange-6'"
                        :name="content.isCompleted ? 'check_circle' : 'play_circle_filled'"
                        size="14px"
                        style="padding-right: 1%"
                      />
                    </span>
                    <q-icon v-if="content.type === 'lab'" name="fas fa-flask" size="14px" />
                    <q-icon v-if="content.type === 'vid'" name="fas fa-video" size="14px" />
                    <q-icon v-if="content.type === 'quiz'" name="fas fa-question" size="14px" />
                    <q-icon v-if="content.type === 'download'" name="fas fa-download" size="14px" />
                    <q-icon v-if="content.type === 'media'" name="fas fa-photo-video" size="14px" />
                    <label class="ase-black-light ase-roboto ase-md ase-md-bold" style="text-align: justify; word-break: normal">
                      {{ content.name }}
                    </label>
                  </p>
                  <div v-if="content.itemTtl !== '0:00'">
                    <span class="ase-roboto text-bold text-secondary" style="margin-left: 2.8rem">
                      {{ content.itemTtl }}
                    </span>
                  </div>
                </q-item-label>
              </q-item-section>
              <q-item-section side v-if="content.type === 'vid' && index < 1 && subIndex < 2 && content.id">
                <q-item-label caption>
                  <q-btn
                    class="ase-roboto q-px-xs q-py-xs radius-8 text-bold text-secondary"
                    label="Watch Preview"
                    size="sm"
                    @click="goToVideo(content)"
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator inset />
          </q-list>
        </q-card>
      </q-card-section>
    </q-expansion-item>
    <q-separator />
  </q-list>
</template>

<script setup>
import { defineComponent } from 'vue'

defineComponent({
  name: 'CourseContentsList'
})

defineProps({
  data: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['goToVideoPreview'])

function goToVideo(content) {
  emit('goToVideoPreview', { data: content })
}
</script>

<style scoped>
.q-icon {
  color: #6b6b6b;
  display: inline-block;
  padding-right: 7px;
}
</style>
