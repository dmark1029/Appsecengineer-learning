<template>
  <div>
    <q-card style="background-color: #f6f9fa">
      <q-item bordered class="rounded-borders">
        <q-item-section avatar>
          <q-avatar>
            <img :src="data.logo" alt="x" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label style="padding-top: 1.5%">
            <p class="text-caption text-weight-bold ase-roboto ase-orange none-spacing">
              {{ data.name }}
            </p>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-card-section>
        <div class="portal_sm ase-roboto" style="color: #1c1d1f" v-html="data.about"></div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup>
import { defineComponent } from 'vue'

defineComponent({
  name: 'CourseContentsInstructorStyle'
})
defineProps({
  data: {
    required: true
  }
})
</script>
