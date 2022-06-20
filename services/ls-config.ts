import fetch from './fetch'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

export interface queryList {
  page?: number
  per_page?: number
  keyword?: string
  sort_by?: string
  sort_type?: string
  id?: string | string[] | undefined
}

export interface lsSummaryInterface {
  name?: string
  type?: string
  type_name?: string
  order_amount?: string
  discount_type?: string
  discount_amount?: string
  min_distance?: string
  max_distance?: string
  ls_type?: string
  ls_platform_amount?: string
  ls_merchant_amount?: string
  start_date?: string
  end_date?: string
  province_ids?: number[]
  district_ids?: number[]
  sub_district_ids?: number[]
  page?: number
  per_page?: number
}


export { createLsConfig, listLsConfig, findLsConfig, updateLsConfig, deleteLsConfig, createContentLs, findContentLs }

const createLsConfig = async (req: any) => {
  try {
    const response = await fetch.post(`/api/ls-config/create`, req)
    return successHandler(response)
  } catch (error) {
    return errorHandler(error)
  }
}

const listLsConfig = async (option: queryList) => {
  try {
    const result = await fetch.post(`/api/ls-config/list`, option)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const findLsConfig = async (option: queryList) => {
  try {
    const result = await fetch.post(`/api/ls-config/find`, option)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const updateLsConfig = async (req: any) => {
  try {
    const response = await fetch.post(`/api/ls-config/update`, req)
    return successHandler(response)
  } catch (error) {
    return errorHandler(error)
  }
}

const deleteLsConfig = async (option: queryList) => {
  try {
    console.log(`option`, option)
    const result = await fetch.post(`/api/ls-config/delete`, option)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error, null, false)
  }
}

const createContentLs = async (req: any) => {
  try {
    const response = await fetch.post(`/api/content-ls/create`, req);
    return successHandler(response)
  } catch (error) {
    return errorHandler(error)
  }
}

const findContentLs = async (req: any) => {
  try {
    const response = await fetch.post(`/api/content-ls/find?code=${req}`);
    return successHandler(response)
  } catch (error) {
    return errorHandler(error)
  }
}
