import fetch from './fetch'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

export { listLsOulet }
const listLsOulet = async (option: any) => {
  try {
    const result = await fetch.post(`/api/ls-outlet/list`, option)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error, null, false)
  }
}