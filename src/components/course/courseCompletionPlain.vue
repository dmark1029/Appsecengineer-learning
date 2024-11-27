<template>
  <div>
    <ConfettiExplosion v-if="visible" :particleCount="300" :particleSize="20" :stageHeight="1000" :stageWidth="2000" :duration="8000" />

    <p style="padding-top: 10%" class="badge-title text-center">
      {{ coursesStore.courseInfo?.progress_percent >= 100 ? 'Congratulations! You have completed' : "Sorry, you haven't finished" }}
    </p>
    <br />
    <br />
    <div v-if="coursesStore.courseHeaderData.name" class="badge-title text-center">
      <b>{{ coursesStore.courseHeaderData.name }}</b>
      course
    </div>
    <br />
    <br />
    <template v-if="coursesStore.courseHeaderData.achievementType">
      <div v-if="coursesStore.courseHeaderData.achievementType === 'badge'" class="portal_xxlg portal_bold text-center">
        <a @click="goToAchievement()" class="text-link">Click on Achievement</a>
        to view your badges.
      </div>
    </template>
  </div>
</template>

<script setup>
import { useCoursesStore } from 'src/store/pinia/courses'
import { defineComponent, watch } from 'vue'
import { useRouter } from 'vue-router'
import ConfettiExplosion from 'vue-confetti-explosion'
import { ref } from 'vue'

defineComponent({
  name: 'CourseCompletionPlain',
  methods: {
    metaInfo() {
      return {
        meta: [
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:site', content: '@we45' },
          {
            name: 'twitter:image',
            content: 'https://picsum.photos/325/325/?image=158'
          },
          { property: 'og:title', content: 'Vue Social Cards Example' },
          { property: 'og:site_name', content: 'Vue Example' },
          { property: 'og:type', content: 'website' },
          {
            property: 'og:image',
            content: 'https://picsum.photos/325/325/?image=158'
          },
          {
            property: 'og:description',
            content: 'Vue sample site showing off Twitter and Facebook Cards.'
          }
        ]
      }
    }
  }
})

const coursesStore = useCoursesStore()

const visible = ref(coursesStore.courseInfo?.progress_percent >= 100)

const router = useRouter()

function goToAchievement() {
  router.push({ name: 'profile' })
}
</script>

<style lang="scss" scoped>
@function strip-unit($value) {
  @return $value / ($value * 0 + 1);
}

@mixin fluid-type($properties, $min-vw, $max-vw, $min-value, $max-value) {
  @each $property in $properties {
    #{$property}: $min-value;
  }

  @media screen and (min-width: $min-vw) {
    @each $property in $properties {
      #{$property}: calc(#{$min-value} + #{strip-unit($max-value - $min-value)} * (100vw - #{$min-vw}) / #{strip-unit($max-vw - $min-vw)});
    }
  }

  @media screen and (min-width: $max-vw) {
    @each $property in $properties {
      #{$property}: $max-value;
    }
  }
}

.demo {
  @include fluid-type(font-size, 50px, 100px, 12px, 14px);
}

.badge-user-info-label {
  font-size: 16px;
  font-weight: 700;
  text-align: left;
}

.badge-user-info-label-value {
  font-size: 18px;
  text-align: left;
}

.badge-title {
  font-size: 30px;
  font-weight: 900;
}

.badge-description {
  font-size: 18px;
  font-weight: 100;
  font-style: normal;
}
</style>
