import fetch from './fetch'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

export { getAccountCms, GetSocialLinkProvider }
interface queryList {
  id: string
  project_id?: string
}

const getAccountCms = async (req: queryList) => {
  try {
    const response = await fetch.post(`/api/sso/user`, req)
    return successHandler(response)
  } catch (error) {
    return errorHandler(error)
  }
}

const GetSocialLinkProvider = async (req: any) => {
  try {
    const response = await fetch.post(`/api/sso/get-social-link-provider`, req)
    return successHandler(response)
  } catch (error) {
    return errorHandler(error)
  }
}
