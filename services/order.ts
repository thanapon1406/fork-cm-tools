import fetch from './fetch'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

export interface orderStatusInterface {
  page?: number
  per_page?: number
  sort_by?: string
  sort_type?: string
  order_no?: string
}

const findOrdersStatusHistory = async (params: orderStatusInterface) => {
  try {
    const result = await fetch.get(`/api/order/find-orders-status-history`, { params: params })
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export { findOrdersStatusHistory }
