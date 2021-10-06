import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";
import _ from 'lodash'

const host = process.env.POS_GRPC_API

const axiosInstance = axios.create({
  baseURL: host,
  timeout: 30000,
});

export default  async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body } = req;
  if (method === "POST") {
    let _body = _.pickBy(body, _.identity);
    
    try {
      let token ="Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxIiwiZXhwIjoxNjMzNTg4OTk5LCJqdGkiOiJmMjBlYzFkNC05YjIwLTRhNWQtYmRjNS01NDU0Njk4NWJhZTMiLCJpYXQiOjE2MzM1MDI1OTksImlzcyI6IkZ1bGwgVGVhbSBTbWFydCBQT1MiLCJuYmYiOjE2MzM1MDI1OTksInN1YiI6IjEiLCJlbWFpbCI6InRoYW5ha3JpdC5uYXdAZnVsbHRlYW0udGVjaCIsIm5hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJsYXN0X25hbWUiOiLguYDguJfguITguYLguJnguYLguKXguKLguLUiLCJ0eXBlIjoiY21zIiwicGVybWlzc2lvbnMiOm51bGwsImRhdGEiOnsiYnJhbmRfY29kZSI6IiIsImJyYW5kX2lkIjowLCJvdXRsZXRfY29kZSI6IiIsIm91dGxldF9pZCI6MCwidGVybWluYWxfY29kZSI6IiIsInRlcm1pbmFsX2lkIjowLCJ1c2VyX2ZpcnN0X25hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJ1c2VyX2xhc3RfbmFtZSI6IuC5gOC4l-C4hOC5guC4meC5guC4peC4ouC4tSIsInVzZXJfdHlwZSI6InN1cGVyYWRtaW4ifX0.AQZK7fqR1H4wlvYV9DzqLSEse7jVEClxj69eK-R_M1fv2KQ3trk6KVxQKINV2pw82s-SZ0sEQPh2QYabbkvfFl0FYFQWhkzuhVQvmZ9jnbdpJSJQ45ji7ZZwBr8CBO6vRoWRgr5fEODiN6GwtH9qsh4glGUtCReuW87muY7aKtqdCS86eWCmPpUuuOAflF4WbMJ5mVIes8J-PwVQKG7XQc6may5fx9TpSEmZ38pcacfMZB7J3N-MrFnIHUmPIySlY67zykNVq_D6FJdqkMfd796sk0AZfTFjThiL2k3aISuk0cUML81rtADJCzkuD85weTf7csGGBJ8q-zhZ-Jl4Bg"
      axiosInstance.defaults.headers.common['Authorization'] =token
     
      const { data, status } = await axiosInstance.post("rider-service/rider/find-rider", _body);
      res.status(status).json(data);
    } catch (e:any) {
      res.status(e.response?.status || 500).json(e.response?.data);
      // res.status(e.response?.status).json(e.response.data);
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};
