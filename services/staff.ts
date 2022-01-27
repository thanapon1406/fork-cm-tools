import fetch from './fetch'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

interface queryList {
  page?: number
  per_page?: number
  keyword?: string
  user_service_type?: string
  user_type_list?: string[]
  id?: string | string[] | undefined
}


const getUsers = async (body: queryList) => {
  try {
    const result = await fetch.post(`/api/staff/find-users`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const getUser = async (body: queryList) => {
  try {
    const result = await fetch.post(`/api/staff/find-user`, body)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}


export {
  getUsers,
  getUser
}
