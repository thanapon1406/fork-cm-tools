export interface OrderDetail {
  sso_id: string
  created_at: Date
  updated_at: Date
  client_time: Date

  order_no: string
  order_type: string

  brand_id: string
  status: string
  merchant_status: string

  rider_fee_extra: number
  rider_info: {
    id: string
    first_name: string
    last_name: string
    phone: string
    partner_name: string
    photo: string
  }
  rider_status: string
  rider_type: string

  outlet_id: number
  outlet_name: string
  outlet_no: string
  outlet_tax_id: string
  outlet_code: string
  outlet_info: CommonInfo

  buyer_info: CommonInfo

  products: [
    {
      id: number
      name: NameInfo
      price: number
      quantity: number
      total: number
      total_amount: number
      total_discount: number
      total_vat: number
      vat: number
      remark: string
      selected_choices: [
        {
          id: number
          name: NameInfo
          option_id: number
          option_name: NameInfo
          price: number
          sorting: number
          status: string
        }
      ]
    }
  ]

  payment_channel: string
  payment_channel_detail: {
    channel_key: string
    name: string
    status: string
  }

  cooking_time: number
  delivery_type: number
  delivery_time: number
  delivery_fee: number
  distance: number
  discount_amount: number
  coupon_code: string
  product_discount: number
  promotion_name: string

  total: number
  total_amount: number
  total_products: number
  total_discount: number
  total_products_without_promotion: number
  total_vat: number

  images: [
    {
      path: string
    }
  ]

  cancellation_id: number
  cancellation_reason: string
  cancellation_remark: string
  cancelled_at: Date
  cancelled_by: CommonInfo
  ls_id: number
  ls_name: string
  platform_ls: number
  merchant_ls: number
  delivery_raw_fee: number
  total_fee_before_ls: number
  platform_ls_income: number
}

interface CommonInfo {
  email: string
  first_name: string
  last_name: string
  phone: string
  address_name: string
  address: string
  remark: string
  location: {
    latitude: number
    longitude: number
  }
  sso_id: string
  project_id: string
  app_id: string
  app_name: string
  line_id: string
}

interface NameInfo {
  en: string
  th: string
}
