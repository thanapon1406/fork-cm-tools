import fetch from './fetch'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

interface queryList {
  ref_id: string
  outlet_name?: string
  credit_chanel?: string
  date?: string
  status?: string
}

interface querySsoId {
  sso_id?: string
}

interface response {
  success: boolean
  result: any
}

const creditTransaction = async (body: queryList) => {
  try {
    const result = await fetch.post(`/api/credit/transactions`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export { creditTransaction }
