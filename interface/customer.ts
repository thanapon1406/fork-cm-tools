export interface CustomerDetail {
  id: number
  first_name: string
  last_name: string
  brand_id: string
  sso_id: string
  status: string
}

export interface Address {
  default_address: boolean
  address_detail: string
  address_tel: string
  address_name: string
  latitude: string
  longitude: string
}
