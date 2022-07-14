import fetch from './fetch'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

export interface queryList {
  outlet_id?: number
  is_show_ls_config?: boolean
  status?: string
}

export { findLsOutlet, listLsOulet }

const findLsOutlet = async (option: queryList) => {
  try {
    const result = await fetch.post(`/api/ls-outlet/finds`, option)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error, null, false)
  }
}
const listLsOulet = async (option: any) => {
  try {
    const result = await fetch.post(`/api/ls-outlet/list`, option)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error, null, false)
  }
}