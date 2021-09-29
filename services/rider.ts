import axios from "axios"
import lodash from "lodash"
import qs from 'qs';

export {
  getRider
}
// const host = process.env.POS_GRPC_API
// alert(host)
// const axiosInstance = axios.create({
//     baseURL: host,
//     timeout: 30000,
//   });

const getRider = async (req: any) => {
  let token = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxIiwiZXhwIjoxNjMyOTc0Mjg2LCJqdGkiOiIzODhmZDMxMy04YjU2LTRiMjUtYTYyOC02NjAzMTdlMWIwNGIiLCJpYXQiOjE2MzI4ODc4ODYsImlzcyI6IkZ1bGwgVGVhbSBTbWFydCBQT1MiLCJuYmYiOjE2MzI4ODc4ODYsInN1YiI6IjEiLCJlbWFpbCI6InRoYW5ha3JpdC5uYXdAZnVsbHRlYW0udGVjaCIsIm5hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJsYXN0X25hbWUiOiLguYDguJfguITguYLguJnguYLguKXguKLguLUiLCJ0eXBlIjoiY21zIiwicGVybWlzc2lvbnMiOm51bGwsImRhdGEiOnsiYnJhbmRfY29kZSI6IiIsImJyYW5kX2lkIjowLCJvdXRsZXRfY29kZSI6IiIsIm91dGxldF9pZCI6MCwidGVybWluYWxfY29kZSI6IiIsInRlcm1pbmFsX2lkIjowLCJ1c2VyX2ZpcnN0X25hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJ1c2VyX2xhc3RfbmFtZSI6IuC5gOC4l-C4hOC5guC4meC5guC4peC4ouC4tSIsInVzZXJfdHlwZSI6InN1cGVyYWRtaW4ifX0.EIgXDiBqJv3YgSataNgbjC6-O_iSOrU-F9r9qleytZWwqTABGHQnfMKaMH83yuD8l8pdtPS5nNBIlJDdH5Yr5KkIsf0Eb01zAD50CbvISHJmmsXVB4e1ur9EHSjwwXY1eOUyUuxJMzw_dbfv76e3_geqcpCDFN1UGIcLJSmF5Gqcc5cW2tLEhwUwRk9Esdu94W5kPDFBPd2sUXIwS60t6hrO5C1idPjmiYNCW6I_3yc8TOVOkQATw6fP1aAaxOtqXUv95TrVnNJnSs7zJDdeU64yl0GM9sf4xjjH6s1xgNtz1hUqBKS6V_jAennCar8pTeNwikYhL6kfo8g2l6MjwQ"
  const req_headers = {
    'authorization': token
  }
  
  // const res = await axios.post(`https://alpha-pos-api.devfullteam.tech/rider-service/rider/find-riders?include=pdpa`, JSON.stringify(req),{ headers: req_headers })
  const res = await axios.post(`${process.env.POS_GRPC_API}/rider-service/rider/find-riders`, JSON.stringify(req),{ headers: req_headers })
    .then(response => {
      //  let statusCode = lodash.get(response,'')
      let statusMessage = lodash.get(response, 'data.message')
      if (statusMessage.toString() === "success") {
        return { status: true, data: response.data, message: response.data.message };
      } else {
        return { status: false, data: {}, message: response.data.message };
      }
    })
    .catch(e => {
      return { status: false, data: {}, message: e.message };
    })

  return res
}