import fetch from './fetch'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

export interface requestBrandInterface {
  startdate?: string
  enddate?: string
  starttime?: string
  endtime?: string
  page?: number
  per_page?: number
  brand_id?: number
  sort_by?: string
  sort_type?: string
}

export const getBrandList = async (params: requestBrandInterface) => {
  try {
    const result = await fetch.get(`/api/pos-profile/find-brands`, { params: params })
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}
