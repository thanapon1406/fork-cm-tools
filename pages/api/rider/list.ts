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
      let token ="Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxIiwiZXhwIjoxNjMzNDk0Njg3LCJqdGkiOiI4YTUwMWQwYi0zOWFiLTQwMjMtODlkNC01NGUwYmI2YjAzMzEiLCJpYXQiOjE2MzM0MDgyODcsImlzcyI6IkZ1bGwgVGVhbSBTbWFydCBQT1MiLCJuYmYiOjE2MzM0MDgyODcsInN1YiI6IjEiLCJlbWFpbCI6InRoYW5ha3JpdC5uYXdAZnVsbHRlYW0udGVjaCIsIm5hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJsYXN0X25hbWUiOiLguYDguJfguITguYLguJnguYLguKXguKLguLUiLCJ0eXBlIjoiY21zIiwicGVybWlzc2lvbnMiOm51bGwsImRhdGEiOnsiYnJhbmRfY29kZSI6IiIsImJyYW5kX2lkIjowLCJvdXRsZXRfY29kZSI6IiIsIm91dGxldF9pZCI6MCwidGVybWluYWxfY29kZSI6IiIsInRlcm1pbmFsX2lkIjowLCJ1c2VyX2ZpcnN0X25hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJ1c2VyX2xhc3RfbmFtZSI6IuC5gOC4l-C4hOC5guC4meC5guC4peC4ouC4tSIsInVzZXJfdHlwZSI6InN1cGVyYWRtaW4ifX0.PkAxR_tiSj6x5ZUHvNz2qb3pJWxcwzjS3iQeV46Ol_7F1htgbz3nb5yQeBG7sB5X_nOu0kWvk2w1KBPzk9cdfaZEe4QZ7vNvD45F5ck3TpxJN5IfWpxtVR5h7a6pQ33ObOy83jRB0HiIFSa1lt9nEwz0TUljbvzzIv4mMJyUIyYuZ-WJwa7RvNmxpAyjqkJnz-HRXYje_p-B3BDdEa6_f5xZ8qqwrT2YL5IxdFPzuwWzTXt9zFXuHpz5TOeOSJT-BehQLUJup-izW8SYVOsoX_vMhRXNYqX9pxjI6RIgyb2VrLDgeVYZK_0tCUJBWYX6fGUFh50khZ4Z46UdRO4QBQ"
      axiosInstance.defaults.headers.common['Authorization'] =token
     
      const { data, status } = await axiosInstance.post("rider-service/rider/find-riders", _body);
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
