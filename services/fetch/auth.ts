import jwt_decode from 'jwt-decode'
import { destroyCookie, parseCookies, setCookie } from 'nookies'

export const COOKIE_NAME = 'application-token'
export const COOKIE_NAME_REFRESH_TOKEN = 'application-refresh-token'

export const retrieveToken = (): string => {
  const cookies = parseCookies()
  return cookies[COOKIE_NAME]
}
export const retrieveRefreshToken = () => {
  const cookies = parseCookies()
  console.log(cookies[COOKIE_NAME_REFRESH_TOKEN])
  return cookies[COOKIE_NAME_REFRESH_TOKEN]
}

export const saveToken = (token: string, option = {}) => {
  option = {
    maxAge: 86400,
    path: '/',
  }
  clearToken()
  setCookie(null, COOKIE_NAME, token, option)
}
export const saveRefreshToken = (refresh_token: string, option = {}) => {
  setCookie(null, COOKIE_NAME_REFRESH_TOKEN, refresh_token, option)
}

export const clearToken = () => {
  destroyCookie(null, COOKIE_NAME)
  destroyCookie(null, COOKIE_NAME_REFRESH_TOKEN)
  localStorage.clear()
}

export const tokenProfile = () => {
  const token: string = retrieveToken()
  return jwt_decode(token)
}

export const checkTokenExpire = () => {
  const token: string = retrieveToken()
  const decoded: any = jwt_decode(token)
  const exp = decoded.exp
  const now = Math.floor(new Date().getTime() / 1000)
  if (now >= exp) {
    // refreshToken()
  }
}
