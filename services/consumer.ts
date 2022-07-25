import axios from 'axios'
import FileSaver from 'file-saver'
import fetch from './fetch'
import { retrieveToken } from './fetch/auth'
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

const consumerBan = async (option: update) => {
  try {
    const result = await fetch.post(`/api/consumer/ban`, option)
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

const consumerExport = async (option: queryList) => {
  try {
    const result = await fetch.post(`/api/consumer/export-consumer`, option)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const downloadFile = async (body: any) => {
  try {
    const POS_WAPI = process.env.NEXT_PUBLIC_POS_WAPI
    const token = retrieveToken()

    const result = await axios({
      url: POS_WAPI + '/report-service/customer-download-report',
      method: 'POST',
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: body,
    })
    const header = result.headers['content-disposition']
    const parts = header?.split(';')
    const filename = parts[1].split('=')[1]
    FileSaver.saveAs(result.data, decodeURIComponent(filename))
    return result
  } catch (error) {
    console.log(`error`, error)
    return errorHandler(error)
  }
}

export { consumerList, consumerUpdate, getCustomer, consumerBan, consumerExport, downloadFile }
