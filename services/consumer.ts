import fetch from './fetch'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'
export interface queryList {
  page?: number
  per_page?: number
  keyword?: string
  sort_by?: string
  sort_type?: string
  ranking?: string
  login_start_date?: string
  login_end_date?: string
  update_start_date?: string
  update_end_date?: string
  status?: string
  first_name?: string
  last_name?: string
  id?: string
  sso_id?: string
}
interface update {
  data?: queryList
}

const consumerList = async (option: queryList) => {
  try {
    const result = await fetch.post(`/api/consumer/list`, option)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const consumerUpdate = async (option: update) => {
  try {
    const result = await fetch.post(`/api/consumer/update`, option)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const getCustomer = async (params: queryList) => {
  try {
    const result = await fetch.get(`/api/consumer/get-customer`, { params: params })
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export { consumerList, consumerUpdate, getCustomer }
