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

export interface cancelOrderInterface {
  order_no?: string
  cancellation_id?: string
  cancellation_reason?: string
}

const findOrdersStatusHistory = async (params: orderStatusInterface) => {
  try {
    const result = await fetch.get(`/api/order/find-orders-status-history`, { params: params })
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const cancelOrder = async (body: cancelOrderInterface) => {
  try {
    const result = await fetch.post(`/api/order/cancel-order`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export { findOrdersStatusHistory, cancelOrder }

