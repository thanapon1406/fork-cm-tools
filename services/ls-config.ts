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

export { createLsConfig, listLsConfig, findLsConfig, updateLsConfig, deleteLsConfig }

const createLsConfig = async (req: any) => {
  try {
    const response = await fetch.post(`/api/ls-config/create`, req)
    return successHandler(response)
  } catch (error) {
    return errorHandler(error, null, false)
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
    return errorHandler(error, null, false)
  }
}

const updateLsConfig = async (req: any) => {
  try {
    const response = await fetch.post(`/api/ls-config/update`, req)
    return successHandler(response)
  } catch (error) {
    return errorHandler(error, null, false)
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
