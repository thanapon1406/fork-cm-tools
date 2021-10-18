import axios from 'axios'
import jwt_decode from 'jwt-decode'
import Fetch from './fetch'
import { clearToken, retrieveToken, saveRefreshToken, saveToken } from './fetch/auth'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

interface loginRequest {
  username: string
  password: string
}

export const login = async ({ username, password }: loginRequest) => {
  try {
    const body = {
      client_id: 'test',
      client_secret: 'test',
      grant_type: 'password',
      password: password,
      username: username,
    }
    const response = await axios.post(`/api/login`, body)
    const { access_token = false, refresh_token = false, expires_in } = response.data
    if (access_token) {
      //TOdo : if Set cookie expires_in
      // const tokenOptions = {
      //   maxAge: expires_in,
      //   path: "/",
      // };
      saveToken(access_token)
      saveRefreshToken(refresh_token)
      return successHandler(response)
    }
  } catch (error) {
    return errorHandler(error)
  }
}

export const findUser = async () => {
  try {
    var token = retrieveToken()
    var decoded: any = jwt_decode(token)
    const id = decoded.sub
    const result = await Fetch.post(`/api/staff/find-user`, { id })
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export const logout = () => {
  clearToken()
}

export const isLogin = () => {
  var token = retrieveToken()
  if (token !== undefined && token !== '' && token !== null) {
    return true
  } else {
    return false
  }
}
