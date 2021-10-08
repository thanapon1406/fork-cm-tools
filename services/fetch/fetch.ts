import { merge } from 'lodash'
import { retrieveToken } from './auth'
const fetcher = async (url: string, customRequestOptions: RequestInit = {}): Promise<any> => {
  const { headers = {} } = customRequestOptions
  const defaultHeaders = await getDefaultHeaders()
  const requestOptions = {
    ...getDefaultRequestOptions(),
    ...customRequestOptions,
    headers: merge(headers, defaultHeaders),
  }
  console.log(requestOptions)

  return fetch(`${url}`, requestOptions).then((res) => res)
}

const getDefaultRequestOptions = (): RequestInit => {
  return {
    method: 'GET',
  }
}

const getDefaultHeaders = async (): Promise<HeadersInit> => {
  const token = retrieveToken()

  return {
    // 'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export default fetcher
export { fetcher as fetch, getDefaultRequestOptions, getDefaultHeaders }
