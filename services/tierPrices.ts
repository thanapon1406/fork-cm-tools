import { notification } from 'antd'
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

const tierPriceDelete = async (option: queryList) => {
  try {
    const result = await fetch.post(`/api/tier-prices/delete`, option)
    return successHandler(result)
  } catch (error) {
    const { response }: any = error
    if (response?.data?.code == 400 && response?.data?.detail == "Pleass Unassign Tier Location") {
      notification.error({
        message: `Request error `,
        description: "กรุณา un-assign พื้นที่ location ออกจาก tier price",
      })
      return response.data
    }

    return errorHandler(error)
  }
}

export { tierPriceList, tierPriceDelete }

