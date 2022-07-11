import fetch from './fetch'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

export interface queryList {
  outlet_id?: number
  is_show_ls_config?: boolean
  status?: string
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

export { findLsOutlet }

const findLsOutlet = async (option: queryList) => {
  try {
    const result = await fetch.post(`/api/ls-outlet/finds`, option)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error, null, false)
  }
}