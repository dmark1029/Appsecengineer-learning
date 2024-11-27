<template>
  <div>
    <q-page>
      <div class="row">
        <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <q-card class="my-card" flat bordered>
            <img :src="coursesStore.courseInfo.logo" :height="400" alt="x" />
            <q-card-section>
              <div class="appsec-h1 q-mt-sm q-mb-xs">{{ coursesStore.courseInfo.name }}</div>
            </q-card-section>
            <q-separator />
          </q-card>
        </div>
      </div>
      <div class="row">
        <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <q-card>
            <BaseTabs :style="{ align: 'justify' }" v-model="tab" dense>
              <q-tab name="description" label="Description" />
              <q-tab name="instructor" label="Instructor" />
            </BaseTabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="description">
                <div class="appsec-h1">Description</div>
                <br />
                <span class="appsec-h2">
                  {{ coursesStore.courseInfo.description }}
                </span>
              </q-tab-panel>
              <q-tab-panel name="instructor">
                <q-card>
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar>
                        <img :src="coursesStore.instructorInfo.logo" alt="x" />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="appsec-h1">{{ coursesStore.instructorInfo.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-card-section>
                    <div v-html="coursesStore.instructorInfo.about" class="appsec-h2"></div>
                  </q-card-section>
                </q-card>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script setup>
import { useCoursesStore } from 'src/store/pinia/courses'
import { defineComponent, shallowRef } from 'vue'

defineComponent({
  name: 'CourseIntroContentPage'
})

const coursesStore = useCoursesStore()

const tab = shallowRef('description')
</script>
