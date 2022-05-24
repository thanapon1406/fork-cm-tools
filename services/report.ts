import { PREFIX_REPORT } from '@/constants/api'
import axios from 'axios'
import FileSaver from 'file-saver'
import fetch from './fetch'
import { retrieveToken } from './fetch/auth'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'
const POS_WAPI = process.env.NEXT_PUBLIC_POS_WAPI
const HOST = POS_WAPI + PREFIX_REPORT

export interface requestReportInterface {
  project_id?: string
  sso_id?: string
  status?: string
  startdate?: string
  enddate?: string
  starttime?: string
  endtime?: string
  page?: number
  per_page?: number
  brand_id?: string
  order_number?: string
  order_type?: string
  sort_by?: string
  sort_type?: string
  rider_id?: string
  rider_type?: string
  rider_partner_type?: string
  rider_status?: string
  delivery_type?: string
  merchant_status?: string
  order_overall_status?: string
  rider_overall_status?: string
  merchant_overall_status?: string
  branch_id?: number
  payment_channel?: string
  exclude_outlet_ids?: string
  include_outlet_ids?: string
  district_id?: string
  sub_district_id?: string
  province_id?: string
  order_status?: string
  food_type?: string
}

export const getOrderTransaction = async (params: requestReportInterface) => {
  try {
    const result = await fetch.get(`/api/report/get-orders`, { params: params })
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export const findOrder = async (params: requestReportInterface) => {
  try {
    const result = await fetch.get(`/api/report/find-order`, { params: params })
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export const exportOrderTransaction = async (req: any) => {
  try {
    const result = await fetch.get(`/api/report/export-order-transaction/`, { params: req })
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export const getFileDetail = async (req: any) => {
  try {
    const result = await fetch.get(`/api/report/get-file-detail/`, { params: req })
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export const exportOrderByEmail = async (req: any) => {
  try {
    const result = await fetch.post(`/api/report/export-order-by-email/`, req)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export const downloadFile = async (req: any) => {
  try {
    let filename = ''
    const token = retrieveToken()
    const { result } = await getEnv()
    await axios({
      url: result.data + '/report-service/download-report/' + req.key,
      method: 'GET',
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => {
        if (resp.status === 200) {
          const header = resp.headers['content-disposition']
          const parts = header?.split(';')
          filename = parts[1].split('=')[1]
          FileSaver.saveAs(resp.data, decodeURIComponent(filename))
          return resp
        } else {
          return false
        }
      })
      .catch((err) => {
        return errorHandler(err)
      })
  } catch (error) {
    return errorHandler(error)
  }
}

export const exportPromotionTracking = async (req: any) => {
  try {
    const result = await fetch.get(`/api/report/export-promotion-tracking/`, { params: req })
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const getEnv = async () => {
  try {
    const result = await fetch.get(`/api/env/get-env-rest`)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}
