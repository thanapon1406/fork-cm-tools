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

export interface createList {
  name: string;
  tier_prices: {
    min: number;
    max: number;
    price: number;
  }[];
}

const tierPriceList = async (option: queryList) => {
  try {
    const result = await fetch.post(`/api/tier-prices/list`, option)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const tierPriceCreate = async (param: createList) => {
  try {
    const result = await fetch.post(`/api/tier-prices/create`, param)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const tierPriceLocationCreate = async (param: any) => {
  try {
    const result = await fetch.post(`/api/tier-prices/create-location`, param)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const tierPriceValidate = async (param: any) => {
  try {
    const result = await fetch.post(`/api/tier-prices/check-duplicate-location`, param)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export { tierPriceList, tierPriceCreate, tierPriceLocationCreate, tierPriceValidate }

