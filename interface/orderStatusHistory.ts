export interface OrderStatusHistoryDetail {
  id: number
  brand_id: string
  created_at: Date
  updated_at: Date
  sso_id: string
  order_no: string
  outlet_id: number
  full_name: string
  cooking_time: number
  delivery_time: number
  current_status_info: StatusInfo
  previous_status_info: StatusInfo
}

interface StatusInfo {
  merchant_status: string
  order_status: string
  rider_status: string
}
