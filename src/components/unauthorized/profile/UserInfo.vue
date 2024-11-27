<template>
  <div class="column q-ma-lg q-gutter-y-md">
    <div class="row items-center">
      <div class="text-h5 text-red-10 text-weight-bold">{{ userName }}</div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
export default {
  props: {
    user: {
      type: Object
    }
  },
  setup(props) {
    const socialMedia = ref([
      {
        name: 'github',
        url: 'https://github.com/arnondp',
        icon: 'fab fa-github'
      },
      {
        name: 'linkedin',
        url: 'https://www.linkedin.com/in/arnon-dp/',
        icon: 'fab fa-linkedin'
      },
      {
        name: 'twitter',
        url: 'https://twitter.com/arnondp',
        icon: 'fab fa-twitter'
      },
      {
        name: 'instagram',
        url: 'https://twitter.com/arnondp',
        icon: 'fab fa-instagram'
      }
    ])
    const userName = computed(() => {
      return `${props.user.overview.first_name}  ${props.user.overview.last_name}`
    })
    return {
      socialMedia,
      userName
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep(.social-icons) {
  .q-icon {
    &:hover {
      color: $primary !important;
      &.linkedin {
        color: $linkedin-icon !important;
      }
      &.twitter {
        color: $twitter-icon !important;
      }
      &.github {
        color: $github-icon !important;
      }
      &.instagram {
        color: $instagram-icon !important;
      }
    }
  }
}
</style>
