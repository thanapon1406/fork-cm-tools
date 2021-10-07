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
      let token ="Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxIiwiZXhwIjoxNjMzNjc2MjQ1LCJqdGkiOiI4YWVmMmZhNS1mZTA4LTQzNzUtYjE1MC1lNzNhYzg2NzVhYmEiLCJpYXQiOjE2MzM1ODk4NDUsImlzcyI6IkZ1bGwgVGVhbSBTbWFydCBQT1MiLCJuYmYiOjE2MzM1ODk4NDUsInN1YiI6IjEiLCJlbWFpbCI6InRoYW5ha3JpdC5uYXdAZnVsbHRlYW0udGVjaCIsIm5hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJsYXN0X25hbWUiOiLguYDguJfguITguYLguJnguYLguKXguKLguLUiLCJ0eXBlIjoiY21zIiwicGVybWlzc2lvbnMiOm51bGwsImRhdGEiOnsiYnJhbmRfY29kZSI6IiIsImJyYW5kX2lkIjowLCJvdXRsZXRfY29kZSI6IiIsIm91dGxldF9pZCI6MCwidGVybWluYWxfY29kZSI6IiIsInRlcm1pbmFsX2lkIjowLCJ1c2VyX2ZpcnN0X25hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJ1c2VyX2xhc3RfbmFtZSI6IuC5gOC4l-C4hOC5guC4meC5guC4peC4ouC4tSIsInVzZXJfdHlwZSI6InN1cGVyYWRtaW4ifX0.ngr-Ng_fJlT5C-SVeugk802fW_Mc7bW6rWWCpw3sYi7QG-_rcmxx3tkrdvl0kK5aDHWJ7I4cnkU6EMUDQiPTtHOkJpTmOgV8FjOfMv2pkjHlJYhXa3waEXWAloOClWAQ9FBR3tDjHsjHYEiVYO9uRFlkR-605q3-AZV6NVawUQi8SbSaSuGiZki3D_3jHpq_3ALDSFvy86inIM-BP2kRnC52YAzlV5yUKgur--bgw8f1Xc2U2CpobaElWFuU0MTZvmoQ2BSk8aOZH__xuPUgIJL4qHK8t1ZQ1GRhqgMOd-Nco0yfFJX1CMuP07BuT9l-rW7L1gq0nxX1S6qdBLxS7Q"
      axiosInstance.defaults.headers.common['Authorization'] =token
     
      const { data, status } = await axiosInstance.post("rider-service/reject-reason/Finds", _body);
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
