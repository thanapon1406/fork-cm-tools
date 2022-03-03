import fetch from './fetch'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

interface queryList {
  id?: string
  keyword?: string
  type?: string
  start_date?: string
  end_date?: string
  status?: string
  outlet_id?: string
  is_preload_credit?: boolean
  email?: string
  order_no?: string
}

interface queryExportList {
  transaction_request?: any
  email?: string
}

interface queryById {
  id?: string
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

const transactionDetail = async (body: any) => {
  try {
    const result = await fetch.post(`/api/credit/detail`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const verifyTransaction = async (body: any) => {
  try {
    const result = await fetch.post(`/api/credit/verify`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const creditList = async (body: queryList) => {
  try {
    const result = await fetch.post(`/api/credit/find-credits`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const credit = async (body: queryList) => {
  try {
    const result = await fetch.post(`/api/credit/find-credit`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const transactionList = async (body: queryList) => {
  try {
    const result = await fetch.post(`/api/credit/find-transactions`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const sendTransactionsEmail = async (body: queryExportList) => {
  try {
    const result = await fetch.post(`/api/credit/send-transactions-email`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const topupList = async (body: queryList) => {
  try {
    const result = await fetch.post(`/api/credit/find-topups`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}
const sendTopupsEmail = async (body: queryExportList) => {
  try {
    const result = await fetch.post(`/api/credit/send-topups-email`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const calculateUsedCredit = async (body: queryList) => {
  try {
    const result = await fetch.post(`/api/credit/calculate-used-credit`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const calculateTopup = async (body: queryList) => {
  try {
    const result = await fetch.post(`/api/credit/calculate-topup`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const ExportCreditTopup = async (body: queryList) => {
  try {
    const result = await fetch.post(`/api/credit/export-credit-topup`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const ExportCreditTransaction = async (body: queryList) => {
  try {
    const result = await fetch.post(`/api/credit/export-credit-transaction`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export {
  creditTransaction,
  transactionDetail,
  verifyTransaction,
  creditList,
  credit,
  transactionList,
  topupList,
  calculateUsedCredit,
  calculateTopup,
  sendTopupsEmail,
  sendTransactionsEmail,
  ExportCreditTopup,
  ExportCreditTransaction,
}
