import { AxiosRequestConfig } from 'axios'
export type ApiHandler = {
  createRequest: (
    url: string,
    method: string,
    payload?: any,
    user?: any,
    withCredentials?: boolean,
    timeout?: number,
  ) => AxiosRequestConfig
  mapResponse: (response: any, codes?: number[]) => { [key: string]: any }
  apiCall?: any
}

export type Response = {
  data: any
  status: number
  headers?: any
}
