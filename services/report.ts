import { PREFIX_REPORT } from '@/constants/api'
import fetch from './fetch'
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
  rider_status?: string
  delivery_type?: string
  merchant_status?: string
  order_overall_status?: string
  rider_overall_status?: string
  merchant_overall_status?: string
  branch_id?: number
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
