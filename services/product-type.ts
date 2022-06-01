import fetch from './fetch'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

export const getProductTypes = async (params: any) => {
  try {
    const result = await fetch.get(`/api/product-type/get-product-types`, { params: params })
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}
