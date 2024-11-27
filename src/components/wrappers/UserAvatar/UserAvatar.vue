<template>
  <div class="cursor-pointer">
    <BaseAvatar
      v-if="avatar.src || avatar.letter || avatar.noName"
      :color="avatar.noName ? 'primary-5' : color"
      :class="avatar.noName ? 'dash-bordered' : ''"
      :text-color="textColor"
      :src="avatar.src"
      :size="size"
      v-bind="$attrs"
    >
      <q-tooltip v-if="avatar.noName">Click to Assign Task</q-tooltip>
      <img :src="avatar.src" v-if="avatar.src" alt="User avatar" />
      <span :class="letterClass" v-if="avatar.letter">{{ avatar.letter }}</span>
      <span v-if="avatar.noName"></span>
      <slot></slot>
    </BaseAvatar>
    <slot name="title">
      <span :class="titleClasses" v-if="title">{{ avatar.title }}</span>
    </slot>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseAvatar from 'src/components/wrappers/BaseAvatar/BaseAvatar.vue'
export default {
  name: 'UserAvatar',
  components: { BaseAvatar },
  inheritAttrs: false,
  props: {
    user: {
      type: [Object, null],
      default: () => ({}),
      required: true
    },
    size: {
      type: String,
      default: '42px'
    },
    color: {
      type: String,
      default: 'secondary'
    },
    textColor: {
      type: String,
      default: 'white'
    },
    letterClass: {
      type: String,
      default: 'text-weight-medium'
    },
    title: {
      type: Boolean,
      default: true
    },
    titleClasses: {
      type: String,
      default: 'text-body2 font-weight-500 q-ml-sm'
    },
    allowREdirect: {
      type: Boolean,
      default: true
    },
    userMode: {
      type: String,
      default: 'avatar'
    },
    formattedDate: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const router = useRouter()
    const avatar = computed(() => {
      const name = props.user?.fullName || props.user?.username
      const letter = name
        ?.split(' ')
        ?.map((n) => n[0].toUpperCase())
        ?.join('')
      return {
        src: props.user?.avatar?.url,
        letter,
        name: name || 'N/A',
        noName: props.user == null
      }
    })
  }
}
</script>

<style scoped>
.bordered {
  border: 1px solid #d3e4f8;
}
.dash-bordered {
  border: 1px dashed #bad4f4;
}
</style>
