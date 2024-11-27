import { Notify } from 'quasar'

export function notify({ success = true, message = 'Success', position = 'top-right', errors = [], timeout = 1000 }) {
  Notify.create({
    message,
    position,
    type: success ? 'positive' : 'negative',
    timeout
  })
}
