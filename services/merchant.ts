import fetch from './fetch'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

interface queryList {
  sso_id?: string
  page: number
  per_page: number
  keyword?: string
  sort_by?: string
  sort_type?: string
  verify_status?: string
  ekyc_status?: string
  start_date_create?: string
  end_date_create?: string
  start_date_verify?: string
  end_date_verify?: string
  approve_status?: string
  id?: string | number
  ids?: number[]
}

interface querySsoId {
  sso_id?: string
}

interface response {
  success: boolean
  result: any
}

const outletList = async (body: queryList) => {
  try {
    const result = await fetch.post(`/api/merchant/list`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const checkOutletBySsoId = async (body: querySsoId) => {
  try {
    const result = await fetch.get(`/api/merchant/check-is-link-outlet`, { params: body })
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const outletListById = async (body: queryList) => {
  try {
    const result = await fetch.post(`/api/merchant/outlet-list`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const outletDetail = async (body: any) => {
  try {
    const result = await fetch.post(`/api/merchant/outlet`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const approveOutlet = async (body: any): Promise<response> => {
  try {
    const result = await fetch.post(`/api/merchant/approve`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const personalData = async (body: any) => {
  try {
    const result = await fetch.post(`/api/merchant/personal`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const getOutletType = async () => {
  try {
    const body: queryList = {
      page: 1,
      per_page: 50,
    }
    const result = await fetch.post(`/api/merchant/type`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const updateOutlet = async (body: any) => {
  try {
    const result = await fetch.post(`/api/merchant/update`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const banOutlet = async (body: any) => {
  try {
    const result = await fetch.post(`/api/merchant/ban-outlet`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const banUser = async (body: any) => {
  try {
    const result = await fetch.post(`/api/staff/ban-user`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const updateOutletStatus = async (body: any) => {
  try {
    const result = await fetch.post(`/api/merchant/update-outlet-status`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export {
  outletList,
  outletDetail,
  approveOutlet,
  personalData,
  getOutletType,
  outletListById,
  updateOutlet,
  checkOutletBySsoId,
  banOutlet,
  banUser,
  updateOutletStatus,
}
