import fetch from './fetch'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

export interface queryList {
  page?: number
  per_page?: number
  keyword?: string
  sort_by?: string
  sort_type?: string
  id?: string
  tier_id?: string

}
const tierPriceList = async (option: queryList) => {
  try {
    const result = await fetch.post(`/api/tier-prices/list`, option)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export { tierPriceList }
