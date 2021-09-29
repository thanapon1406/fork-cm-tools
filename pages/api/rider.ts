import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

const host = process.env.POS_GRPC_API

const axiosInstance = axios.create({
  baseURL: host,
  timeout: 30000,
});

export default  async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body } = req;
  if (method === "POST") {
   
  
    try {
      let token ="Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxIiwiZXhwIjoxNjMyOTk5NDMyLCJqdGkiOiJiNmEyNWFiYi01MTBiLTQwODQtYWQ2Yy0yMzA0MmIwNmQ4MzAiLCJpYXQiOjE2MzI5MTMwMzIsImlzcyI6IkZ1bGwgVGVhbSBTbWFydCBQT1MiLCJuYmYiOjE2MzI5MTMwMzIsInN1YiI6IjEiLCJlbWFpbCI6InRoYW5ha3JpdC5uYXdAZnVsbHRlYW0udGVjaCIsIm5hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJsYXN0X25hbWUiOiLguYDguJfguITguYLguJnguYLguKXguKLguLUiLCJ0eXBlIjoiY21zIiwicGVybWlzc2lvbnMiOm51bGwsImRhdGEiOnsiYnJhbmRfY29kZSI6IiIsImJyYW5kX2lkIjowLCJvdXRsZXRfY29kZSI6IiIsIm91dGxldF9pZCI6MCwidGVybWluYWxfY29kZSI6IiIsInRlcm1pbmFsX2lkIjowLCJ1c2VyX2ZpcnN0X25hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJ1c2VyX2xhc3RfbmFtZSI6IuC5gOC4l-C4hOC5guC4meC5guC4peC4ouC4tSIsInVzZXJfdHlwZSI6InN1cGVyYWRtaW4ifX0.G1AIH8gOwGg9Dt-dRyF8HRh7AfWDXT41VwkufwIUfEf9biMQLUCNEKV6gvSF8ZhJpYggDwkzNF1G57m4oCqtWutOZeaFbRyvoiBda167pvpNEqex0iF0RDhx0Dbku-rV5-x4G8PcuXTRh00OK1GdX6An95xtfUDiLgi2TYnVtcB3fccEnBYJ_-mHB2-v7F1iBCjBwFFJpSqluGOPkb00DgUYm7cfI2fnlu4a_yjXaW895WxbSKqOKB03b39uimM4xwstHjVWBVHRWJBpDQ2kQio_9il4fL4DtPvU09r-kvyDDH_6L4n_o7Vziuo185ol74klkZ74C04qqClMDZSwLQ"
      axiosInstance.defaults.headers.common['Authorization'] =token
     
      const { data, status } = await axiosInstance.post("rider-service/rider/find-riders", body);
      res.status(status).json(data);
      // console.log("data : ", data)
    } catch (e) {
      res.status(e.response?.status).json(e.response.data);
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};
