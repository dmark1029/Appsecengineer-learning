import { date } from 'quasar'
const defaultDateFormat = 'MMM Do, YYYY'
export function formatTime(timeStamp, format = 'h:mm A') {
  if (!timeStamp) return null
  return date.formatDate(timeStamp, format)
}

export function formatDate(value, format = defaultDateFormat) {
  if (date.isValid(value)) {
    return date.formatDate(value, format)
  } else if (Array.isArray(value)) {
    return value.map((ele) => formatDate(ele, format))
  } else if (is.object(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, formatDate(val, format)]))
  }
  return value
}
export function since(data) {
  if (!data) return null
  const timeStamp = Date.now()
  let diff = date.getDateDiff(timeStamp, data, 'seconds')
  if (diff < 60) {
    return `${diff} seconds ago`
  }
  diff = date.getDateDiff(timeStamp, data, 'minutes')
  if (diff < 60) {
    return `${diff} minutes ago`
  }
  diff = date.getDateDiff(timeStamp, data, 'hours')
  if (diff < 24) {
    return `${diff} hours ago`
  }
  diff = date.getDateDiff(timeStamp, data, 'days')
  if (diff == 1) {
    const time = formatTime(data)
    return `Yesterday at ${time}`
  } else if (diff < 7) {
    const time = formatTime(data)
    return `${diff} days ago at ${time}`
  }
  return `${formatDate(data)} at ${formatTime(data)}`
}

export function getTimePassedInPercentage(start_ttl,end_ttl){
  const startTime = new Date(start_ttl*1000)
  const endTime = new Date(end_ttl*1000)

  const distance = endTime-startTime
  const timePassed = new Date() - startTime

  return Math.floor(timePassed/distance*100)
}
