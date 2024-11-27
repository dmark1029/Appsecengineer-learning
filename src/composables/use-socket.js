import jwt_decode from 'jwt-decode'
import { ref, onMounted, computed } from 'vue'
import { Notify } from 'quasar'
import { useLoginStore } from 'src/store/pinia/login'
import { useNotificationStore } from 'src/store/pinia/notifications'
import config from 'src/config'

export function useSocket() {
  const notificationStore = useNotificationStore()

  const loginStore = useLoginStore()
  //socket connection

  const connected = ref(false)

  let socket

  const onMessage = (event) => {
    renderMessage(event.data)
  }

  function renderMessage(data) {
    try {
      const parseData = JSON.parse(data)
      Notify.create({ type: 'positive', position: 'top-right', progress: true, message: parseData?.notificationContent?.content })
      notificationStore.unreadCountNotifications++
    } catch (e) {
      console.warn(e)
    }
  }

  const onOpen = (event) => {
    connected.value = true
  }

  const onError = (event) => {
    console.warn(event)
  }

  onMounted(() => {
    bootSocket()
  })

  function bootSocket() {

    if(!loginStore?.fetchUserInfo?.email) return

     // Fetch the email address
    const email = loginStore?.fetchUserInfo?.email;


  // Encode the email address
    const encodedEmail = encodeURIComponent(email);
    const socketUrl = `${config.socketUrl}?user_id=${encodedEmail}`
    // Initialize WebSocket connection with custom headers
    socket = new WebSocket(socketUrl)

    socket.addEventListener('open', onOpen)
    socket.addEventListener('message', onMessage)
    socket.addEventListener('error', onError)
  }

  let reconnectInterval = null

  const reconnect = () => {
    if (!socket || socket.readyState === WebSocket.OPEN) {
      return
    }
    bootSocket()
  }

  reconnectInterval = setInterval(reconnect, 50000)

  const unreadNotification = computed(() => {
    return notificationStore.unreadCountNotifications
  })

  return {
    unreadNotification
  }
}
