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
  current_rider_info: PersonalInfo
  previous_rider_info: PersonalInfo
}

interface StatusInfo {
  merchant_status: string
  order_status: string
  rider_status: string
}

interface PersonalInfo {
  first_name: string
  last_name: string
  id: string
  line_id: string
  phone: string
  photo: string
  assigned_time: Date
}
