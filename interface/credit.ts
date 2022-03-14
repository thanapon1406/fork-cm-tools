export interface Credit {
  id: number
  credit_no: string
  outlet_id: number
  status: string
  created_at: string
  updated_at: string
  transactions: Array<Transactions>
  order_no: string
  order_status: string
}

export interface Transactions {
  id: number
  outlet_id: string
  gl_type: string
  amount: number
  status: string
  created_at: string
  updated_at: string
  credit_type: string
  credit: number
  balance: number
}
