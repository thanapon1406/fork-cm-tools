import { generateQueryParams } from '@/utils/helpers'
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
  keyword?: string
}

export const getBrandList = async (params: requestBrandInterface) => {
  try {
    const result = await fetch.get(`/api/pos-profile/find-brands`, { params: params })
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export const getProvince = async (params?: any) => {
  const query = generateQueryParams(params)
  try {
    const response = await fetch.get(`/api/pos-profile/address/province?${query}`)
    return successHandler(response)
  } catch (error) {
    return errorHandler(error)
  }
}

export const getCity = async (params: any) => {
  const query = generateQueryParams(params)
  try {
    const response = await fetch.get(`/api/pos-profile/address/city?${query}`)
    return successHandler(response)
  } catch (error) {
    return errorHandler(error)
  }
}

export const getDistrict = async (params: any) => {
  const query = generateQueryParams(params)
  try {
    const response = await fetch.get(`/api/pos-profile/address/district?${query}`)
    return successHandler(response)
  } catch (error) {
    return errorHandler(error)
  }
}
