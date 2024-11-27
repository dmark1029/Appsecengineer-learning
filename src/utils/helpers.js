import { QSpinnerFacebook, QSpinnerBox, QSpinnerInfinity } from 'quasar'
import axios from 'axios'
import config from '../config'
import { LocalStorage } from 'quasar'

export function redirectFunction(url, type = '_blank') {
  window.open(url, type)
}

export function getCurentYear() {
  return new Date().getFullYear()
}

export function loader({
  spinnerColor = 'white',
  spinner = QSpinnerFacebook,
  spinnerSize = 140,
  message = 'Hang On...',
  messageColor = 'white'
}) {
  return {
    spinner,
    spinnerColor,
    spinnerSize,
    message,
    messageColor
  }
}

export function secondLoader({
  spinnerColor = 'white',
  spinner = QSpinnerInfinity,
  spinnerSize = 140,
  message = 'Hang on...',
  messageColor = 'white'
}) {
  return {
    spinner,
    spinnerColor,
    spinnerSize,
    message,
    messageColor
  }
}

export function manageApiResponse(data, isError) {
  let response = {}
  if (isError) {
    const res = data?.response?.data ?? data?.response
    response = {
      message: 'Something went wrong',
      ...(res ?? {}),
      success: false
    }

    if (!res) {
      console.warn(data)
    }
  } else {
    response = {
      ...data?.data,
      success: true
    }
  }

  return response
}

export async function handleApiRequest(apiFunction, args = []) {
  let response = { success: true, data: null }
  try {
    const data = await apiFunction(...args)
    response.success = true
    response.data = manageApiResponse(data)
  } catch (error) {
    response.data = manageApiResponse(error, true)
  } finally {
    return response
  }
}

//check route Authentication
export async function isAuthenticated(to) {
  const excludedPaths = ['/', '/login', '/oauth']

  if (excludedPaths.includes(to.path)) {
    const expTime = LocalStorage.getItem('expTime')

    if (expTime) {
      const currentTime = new Date().getTime()

      if (currentTime <= parseInt(expTime)) {
        return true
      }

      try {
        const res = await refreshAccessToken()

        if (res.data.success) {
          LocalStorage.set('token', res.data.data.IdToken)
          LocalStorage.set('expTime', calculateExpirationTime())
          return true
        }
      } catch (error) {
        handleNetworkError()
      }

      return false
    }

    if (to.path === '/') {
      window.location.href = '/portal/dashboard'
    }

    return true
  }

  const user = LocalStorage.getItem('user')
  const token = LocalStorage.getItem('token')
  const rtoken = LocalStorage.getItem('rtoken')

  if (!user || !token || !rtoken) {
    window.location.href = '/?' + encodeURIComponent(window.location.href)
    return false
  }

  return true
}

async function refreshAccessToken() {
  const payload = {
    refresh_token: LocalStorage.getItem('rtoken')
  }
  return await axios.post(config.baseURLApi + 'user/refresh-token', payload)
}

function calculateExpirationTime() {
  return new Date().setSeconds(new Date().getSeconds() + 14400)
}

function handleNetworkError() {
  const keysToRemove = ['startTime', 'expTime', 'token', 'isOwasp', 'rtoken', 'user', 'userId', 'provisionInfo', 'sub_']

  keysToRemove.forEach((key) => LocalStorage.remove(key))

  window.location.href = '/'
}

export function getMinutesInHr(minutes = 0) {
  let hours = Math.floor(minutes / 60)
  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes % 60
  minutes = minutes < 10 ? '0' + minutes : minutes
  return `${hours}h :${minutes}m`
}

export function randomIndexes(defaultCount = 4, max = 6) {
  if(max<defaultCount){
    let randoms=[]
    for(let i=0;i<max;i++){
      randoms.push(i)
    }
    return randoms
  }
  else{
    let randomSet = new Set()
    while (randomSet.size < defaultCount) {
    let random = Math.floor(Math.random() * max)
    if (!randomSet.has(random)) {
      randomSet.add(random)
      }
    }
    return [...randomSet]
  }

}
