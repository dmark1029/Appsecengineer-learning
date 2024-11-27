<template>
  <div>
    <q-list>
      <q-item
        v-if="
          outlineData
            .map((data) => data.items.filter((info) => info.type === 'vid').length)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0) > 0
        "
      >
        <q-item-section avatar>
          <q-icon color="grey-8" size="medium" name="fas fa-video" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="ase-roboto ase-xs">
            <p class="text-caption text-weight-bold ase-roboto ase-orange none-spacing" style="padding-left: 0px; line-height: 1">
              {{
                (
                  '0' +
                  outlineData
                    .map((data) => data.items.filter((info) => info.type === 'vid').length)
                    .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
                ).slice(-2)
              }}
            </p>
          </q-item-label>
          <q-item-label caption class="ase-roboto ase-xs">
            <p class="text-subtitle2 text-weight-bold ase-roboto ase-black-light none-spacing" style="padding-left: 0px; line-height: 1">
              Videos
            </p>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-if="
          outlineData
            .map((data) => data.items.filter((info) => info.type === 'lab').length)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0) > 0
        "
      >
        <q-item-section avatar>
          <q-icon color="grey-8" size="medium" name="fas fa-flask" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="ase-roboto ase-xs">
            <p class="text-caption text-weight-bold ase-roboto ase-orange none-spacing" style="padding-left: 0px; line-height: 1">
              {{
                (
                  '0' +
                  outlineData
                    .map((data) => data.items.filter((info) => info.type === 'lab').length)
                    .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
                ).slice(-2)
              }}
            </p>
          </q-item-label>
          <q-item-label caption class="ase-roboto ase-xs">
            <p class="text-subtitle2 text-weight-bold ase-roboto ase-black-light none-spacing" style="padding-left: 0px; line-height: 1">
              Labs
            </p>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-if="
          outlineData
            .map((data) => data.items.filter((info) => info.type === 'download').length)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0) > 0
        "
      >
        <q-item-section avatar>
          <q-icon color="grey-8" size="medium" name="fa fa-download" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="ase-roboto ase-xs">
            <p class="text-caption text-weight-bold ase-roboto ase-orange none-spacing" style="padding-left: 0px; line-height: 1">
              {{
                (
                  '0' +
                  outlineData
                    .map((data) => data.items.filter((info) => info.type === 'download').length)
                    .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
                ).slice(-2)
              }}
            </p>
          </q-item-label>
          <q-item-label caption class="ase-roboto ase-xs">
            <p class="text-subtitle2 text-weight-bold ase-roboto ase-black-light none-spacing" style="padding-left: 0px; line-height: 1">
              Download
            </p>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-if="
          outlineData
            .map((data) => data.items.filter((info) => info.type === 'media').length)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0) > 0
        "
      >
        <q-item-section avatar>
          <q-icon color="grey-8" size="medium" name="fas fa-photo-video" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="ase-roboto ase-xs">
            <p class="text-caption text-weight-bold ase-roboto ase-orange none-spacing" style="padding-left: 0px; line-height: 1">
              {{
                (
                  '0' +
                  outlineData
                    .map((data) => data.items.filter((info) => info.type === 'media').length)
                    .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
                ).slice(-2)
              }}
            </p>
          </q-item-label>
          <q-item-label caption class="ase-roboto ase-xs">
            <p class="text-subtitle2 text-weight-bold ase-roboto ase-black-light none-spacing" style="padding-left: 0px; line-height: 1">
              Media
            </p>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-if="
          outlineData
            .map((data) => data.items.filter((info) => info.type === 'quiz').length)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0) > 0
        "
      >
        <q-item-section avatar>
          <q-icon color="grey-8" size="medium" name="fas fa-question" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="ase-roboto ase-xs">
            <p class="text-caption text-weight-bold ase-roboto ase-orange none-spacing" style="padding-left: 0px; line-height: 1">
              {{
                (
                  '0' +
                  outlineData
                    .map((data) => data.items.filter((info) => info.type === 'quiz').length)
                    .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
                ).slice(-2)
              }}
            </p>
          </q-item-label>
          <q-item-label caption class="ase-roboto ase-xs none-spacing">
            <p class="text-subtitle2 text-weight-bold ase-roboto ase-black-light none-spacing" style="padding-left: 0px; line-height: 1">
              Quiz
            </p>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script setup>
import { defineComponent } from 'vue'

defineComponent({
  name: 'CourseContentsPreviewContentInfoStyle'
})

defineProps({
  outlineData: {
    required: false
  }
})
</script>
