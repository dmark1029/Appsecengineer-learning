<template>
  <div>
    <p v-if="!coursesStore.isLoading" class="badge-title text-center">
      {{ coursesStore.courseInfo?.progress_percent >= 100 ? 'Congratulations! You have completed' : "Sorry, you haven't finished" }}
    </p>
    <div v-if="badgeStore.badgeInfo.name" class="badge-title text-center">
      <b>{{ badgeStore.badgeInfo.name }}</b>
      course
    </div>
    <br />
    <div class="row">
      <div class="q-pa-xs col-xs-4 col-sm-4 col-md-4 col-lg-4"></div>
      <div class="q-pa-xs col-xs-4 col-sm-4 col-md-4 col-lg-4">
        <q-img :src="badgeStore.badgeInfo.logo" ripple @click="viewBadgeMoreInfo()" style="cursor: pointer" spinner-color="red"></q-img>
      </div>
    </div>
  </div>
</template>

<script setup>
import { QSpinnerFacebook, useQuasar } from 'quasar'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { useBadgeStore } from 'src/store/pinia/badge'
import { defineComponent, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCoursesStore } from 'src/store/pinia/courses'

defineComponent({
  name: 'CourseCompletionContentPage',
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

const route = useRoute()
const $q = useQuasar()

const badgeStore = useBadgeStore()
const coursesStore = useCoursesStore()

onBeforeMount(async () => {
  await badgeStore.fetchBadgeInfo({
    cert_id: urlSafeBase64Decode(route.params.id)
  })
  document.title = 'Course completed'
})

watch(
  () => badgeStore.isLoading,
  (isLoading) => {
    if (isLoading) {
      $q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: 'white',
        spinnerSize: 140,
        message: 'Hang on...',
        messageColor: 'white'
      })
    } else {
      $q.loading.hide()
    }
  }
)

function viewBadgeMoreInfo() {
  badgeStore.fetchBadgeInfo()
  const url = `https://badge.appsecengineer.com/badges/${urlSafeBase64Decode(route.params.id)}`
  window.open(url, '_blank')
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
src/store/pinia/badge
