import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
// import { VerifyRefreshToken } from '../utils/sso/verify-refresh-token'
// import { handler as userLogout } from '../features/sso/api/handlers/logout.service'
// import { ROUTES } from '../utils/routes'

interface RetryQueueItem {
  resolve: (value?: void | PromiseLike<void>) => void
  reject: (error?: unknown) => void
  config: AxiosRequestConfig
}

// Create a list to hold the request queue
const refreshAndRetryQueue: RetryQueueItem[] = []

// Flag to prevent multiple token refresh requests
let isRefreshing = false
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

const sessionLogout = async () => {
  try {
    // let response = await userLogout.apiCall()
    // if (!response?.error) {
    //   localStorage.clear()
    //   window?.location?.assign(ROUTES.DEFAULT_HOMEPAGE)
    // }
  } catch (e) {
    //eslint-disable-next-line
    console.log('failed to generate accessToken from refreshToken', e)
  }
}

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (err: AxiosError) => {
    const originalRequest: AxiosRequestConfig | undefined = err.config
    if (!originalRequest) {
      return Promise.reject(err)
    }
    if (
      (err?.response?.data as { message?: string })?.message == 'Invalid or Missing Access-Token' ||
      (err?.response?.data as { errorMessage?: string })?.errorMessage ==
        'Invalid or Missing Access-Token'
    ) {
      if (!isRefreshing) {
        isRefreshing = true
        try {
          if (global?.window?.localStorage?.getItem('refreshToken')) {
            // const newAccessToken = await VerifyRefreshToken()
            // if (!newAccessToken?.error) {
            //   err.config.headers[
            //     'Authorization'
            //   ] = `Bearer ${newAccessToken?.headers['x-access-token']}`
            //   // Retry the original request after token refresh
            //   const retryOriginalRequest = axiosInstance(originalRequest)
            //   // Clear the queue
            //   refreshAndRetryQueue.length = 0
            //   // Resolve all queued requests with the refreshed response
            //   refreshAndRetryQueue.forEach(({ resolve }) => {
            //     resolve(retryOriginalRequest)
            //   })
            //   // Return the refreshed response
            //   return retryOriginalRequest
            // } else {
            //   sessionLogout()
            // }
          }
        } catch (refreshError) {
          // Handle token refresh error
          // You can clear all storage and redirect the user to the login page
          console.log('err at refreshError', refreshError)
          sessionLogout()
          throw refreshError
        } finally {
          isRefreshing = false
        }
      }

      // Queue the original request
      return new Promise<void>((resolve, reject) => {
        refreshAndRetryQueue.push({ config: originalRequest, resolve, reject })
      })
    }

    return err?.response?.data
  },
)

export { axiosInstance as axios }
