<template>
  <div class="q-pa-md row justify-center">
    <div style="width: 100%">
      <q-chat-message
        v-for="(message, index) in chatMessages"
        :key="index"
        :text="[message.content]"
        :sent="message.sent"
        text-color="primary"
        bg-color="grey-1"
        class="ase-roboto text-subtitle1 none-spacing"
      >
        <template v-slot:name>{{ message.sender }}</template>
        <!-- <template v-slot:stamp>{{ message.timestamp }}</template> -->
        <template v-slot:avatar>
          <q-icon :name="message.icon" v-if="message.icon" size="3em" />
          <img class="q-message-avatar q-message-avatar--sent" alt="x" :src="message.avatar" v-else-if="message.avatar" />
          <div class="text-h3" v-else>
            {{ message?.sender?.[0] }}
          </div>
        </template>
      </q-chat-message>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chatMessages: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss">
.q-chat-message {
  font-family: ase-roboto;
  .q-message-name--sent {
    font-size: 16px;
    font-weight: 600;
  }
  .q-message-name--received {
    font-size: 16px;
    font-weight: 600;
  }
  .q-message-text-content--received {
    font-size: 16px; /* Adjust the font size as needed */
    // font-weight: 600;
  }
  .q-message-text-content--sent {
    font-size: 16px; /* Adjust the font size as needed */
  }
}
</style>
