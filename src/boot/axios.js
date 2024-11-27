import axios from 'axios'
import { boot } from 'quasar/wrappers'
import { LocalStorage } from 'quasar'
import config from 'src/config'
import { useGlobalLoaderStore } from 'src/store/pinia/loader'

const api = axios.create({ baseURL: config.baseURLApi })
const apiProvisional = axios.create({ baseURL: config.provisionerUrl })
const apiChallenge = axios.create({ baseURL: config.challengeUrl })
const apiMacroMeta = axios.create({ baseURL: config.macroMetaUrl })
const apiTests = axios.create({ baseURL: config.testsUrl })
const apiAnalytics = axios.create({ baseURL: config.analytics })
const apiAsegpt = axios.create({ baseURL: config.asegptUrl })

const apiQuiz = axios.create({ baseURL: config.quiz })

const apiGenerateSecret = axios.create({ baseURL: config.secret })

const instances = [api, apiProvisional, apiChallenge, apiMacroMeta, apiTests, apiAnalytics, apiQuiz, apiGenerateSecret, apiAsegpt]

let isRefreshing = false
let refreshSubscribers = []

async function refreshToken() {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshSubscribers.push(resolve)
    })
  }

  isRefreshing = true

  try {
    const form_data = {
      refresh_token: LocalStorage.getItem('rtoken')
    }

    const response = await axios.post(config.baseURLApi + 'user/refresh-token/', form_data, { headers: {} })

    LocalStorage.remove('token')
    LocalStorage.set('token', response.data.data.AuthenticationResult.IdToken)

    refreshSubscribers.forEach((resolve) => resolve(response.data.data.AuthenticationResult.IdToken))
    refreshSubscribers = []

    await apiMacroMeta.post(
      'publish-login',
      {},
      {
        headers: {
          Authorization: response.data.data.AuthenticationResult.IdToken
        }
      }
    )

    return response.data.data.AuthenticationResult.IdToken
  } catch (error) {
    window.location.href = '/'
  } finally {
    isRefreshing = false
  }
}

function addInterceptors(apiInstance) {
  apiInstance.interceptors.request.use(
    async (config) => {
      if (!config.noLoading) {
        useGlobalLoaderStore().start()
      }
      const token = LocalStorage.getItem('token')
      if (token) {
        config.headers['Authorization'] = token
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  apiInstance.interceptors.response.use(
    (response) => {
      useGlobalLoaderStore().stop()

      return response
    },

    async (error) => {
      if (error.code !== 'ERR_CANCELED') useGlobalLoaderStore().stop()
      if (error.response && error.response?.status === 401 && error.response.data.message === 'The incoming token has expired') {
        const newToken = await refreshToken()
        if (newToken) {
          LocalStorage.set('token', newToken)
          error.config.headers['Authorization'] = newToken

          return axios.request(error.config)
        }
      } else if (error.response?.status === 401) {
        LocalStorage.clear()
        window.location.href = '/'
      }

      return Promise.reject(error)
    }
  )
}

export default boot(({ app }) => {
  instances.forEach((instance) => addInterceptors(instance))
  app.config.globalProperties.$api = { api, apiProvisional, apiChallenge, apiMacroMeta, apiTests, apiQuiz }
})

export { api, apiProvisional, apiChallenge, apiMacroMeta, apiTests, apiAnalytics, apiQuiz, apiGenerateSecret, apiAsegpt }
