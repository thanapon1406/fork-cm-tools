import axios from "axios";
import successHandler from './handler/successHandler'
import errorHandler from './handler/errorHandler'
// import Cookies from 'js-cookie'
// import jwt_decode from 'jwt-decode'

interface loginRequest{
    username:string;
    password:string;
}

// export const COOKIE_NAME = 'application-token'
// export const COOKIE_NAME_REFRESH_TOKEN = 'application-refresh-token'

// export const retrieveToken = ():string => Cookies.get(COOKIE_NAME) || ""
// export const retrieveRefreshToken = () => Cookies.get(COOKIE_NAME_REFRESH_TOKEN)
// export const saveToken = (token:string) => Cookies.set(COOKIE_NAME, token)
// export const saveRefreshToken = (refresh_token:string) =>
//   Cookies.set(COOKIE_NAME_REFRESH_TOKEN, refresh_token)
// export const clearToken = () => {
//   Cookies.remove(COOKIE_NAME)
//   Cookies.remove(COOKIE_NAME_REFRESH_TOKEN)
//   localStorage.clear()
// }

// export const checkTokenExpire = () => {
//   const token:string = retrieveToken()
//   var decoded:any = jwt_decode(token)
//   var exp = decoded.exp
//   var now = Math.floor(new Date().getTime() / 1000)
//   if (now >= exp) {
//     // refreshToken()
//   }
// }

const login = async ({username,password}:loginRequest) => {
  try {
    const body = {
      client_id: "test",
      client_secret: "test",
      grant_type: "password",
      password:password,
      username: username,
    };
    const response = await axios.post(`/api/login`, body);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
};

// export const refreshToken = () => {
//   var params = {
//     client_id: process.env.REACT_APP_CLIENT_ID,
//     client_secret: process.env.REACT_APP_CLIENT_SECRET,
//     grant_type: 'refresh_token',
//     refresh_token: retrieveRefreshToken(),
//   }
//   return call2(CMS_GRPC_API_HOST + '/auth-service/o-auth/token', {
//     method: 'POST',
//     body: JSON.stringify(params),
//   })
//     .then((response) => {
//       saveToken(response.access_token)
//       saveRefreshToken(response.refresh_token)
//       return response
//     })
//     .catch((error) => {
//       clearToken()
//       window.location = '/login'
//     })
// }

export { login };
