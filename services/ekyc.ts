import { API_PATH_EKYC_SERVICE } from '@/constants/api'
import fetcher from '@/services/fetch/fetch'
import fetch from './fetch'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

const POS_WAPI = process.env.NEXT_PUBLIC_POS_WAPI
export interface requestEkycInterface {
  id?: string
  project_id?: string
  sso_id?: string
  status?: string
  start_date?: string
  end_date?: string
  app_id?: string
  per_page: number
  page: number
}

export const getEkycList = async (option: requestEkycInterface) => {
  try {
    const result = await fetch.post(`/api/ekyc/list`, option)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export const getEkycDetail = async (ssoId: any) => {
  const payload = {
    sso_id: ssoId,
  }
  console.log('getEkycDetail', ssoId)

  try {
    const result = await fetch.post(`/api/ekyc/detail`, payload)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export const updateEkycDetail = async (payload: any) => {
  try {
    const result = await fetch.put(`/api/ekyc/update`, payload)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export const downloadImage = async (payload: any) => {
  console.log(API_PATH_EKYC_SERVICE)
  console.log(POS_WAPI)

  const res = await fetcher(`${POS_WAPI}${API_PATH_EKYC_SERVICE}/download-img`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  const result = await res.blob()
  return result
  // try {
  //   const result = await fetch.post(`/api/ekyc?key=download`, payload, { responseType: 'blob' })
  //   return successHandler(result)
  // } catch (error) {
  //   return errorHandler(error)
  // }
}
