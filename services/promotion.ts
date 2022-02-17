import fetch from './fetch'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

export interface promotionTrackingQueryList {
  page?: number
  per_page?: number
  sort_by?: string
  sort_type?: string
  start_date?: string
  end_date?: string
  status?: string
  brand_id?: number
  outlet_id?: number
}

export interface promotionTrackingInterface {
  status?: string
  brand_id?: number
  brand_name?: string
  outlet_id?: number
  outlet_name?: string
  campaign_id?: number
  campaign_name?: string
  promotion_name?: string
  code?: string
  redeem_by?: string
  order_no?: string
  sso_id?: string

  sub_total?: number
  discount_amount?: number
  product_discount?: number
  total?: number
  delivery_fee?: number
}

const promotionTrackingList = async (option: promotionTrackingQueryList) => {
  try {
    const result = await fetch.post(`/api/promotion-tracking/list`, option)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export { promotionTrackingList }
