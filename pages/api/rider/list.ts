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
      let token ="Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxIiwiZXhwIjoxNjMzMTYxMTIyLCJqdGkiOiJlY2RjY2M3Yy0zZTA2LTRhNzQtYjNkZS1hNGNmZjhmZDhmMzEiLCJpYXQiOjE2MzMwNzQ3MjMsImlzcyI6IkZ1bGwgVGVhbSBTbWFydCBQT1MiLCJuYmYiOjE2MzMwNzQ3MjMsInN1YiI6IjEiLCJlbWFpbCI6InRoYW5ha3JpdC5uYXdAZnVsbHRlYW0udGVjaCIsIm5hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJsYXN0X25hbWUiOiLguYDguJfguITguYLguJnguYLguKXguKLguLUiLCJ0eXBlIjoiY21zIiwicGVybWlzc2lvbnMiOm51bGwsImRhdGEiOnsiYnJhbmRfY29kZSI6IiIsImJyYW5kX2lkIjowLCJvdXRsZXRfY29kZSI6IiIsIm91dGxldF9pZCI6MCwidGVybWluYWxfY29kZSI6IiIsInRlcm1pbmFsX2lkIjowLCJ1c2VyX2ZpcnN0X25hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJ1c2VyX2xhc3RfbmFtZSI6IuC5gOC4l-C4hOC5guC4meC5guC4peC4ouC4tSIsInVzZXJfdHlwZSI6InN1cGVyYWRtaW4ifX0.C5L-O2IFgdyb69FC1kUL1jNN-O7LNf2v7fhy6tkWrxlXWXBradQ-pvMMwNofjqhHJSN-XwuerjHrznUJAhY8SFKNb61yeAE6GjacJSyyYcwD6IrRR8E5QsYXgz29bPkpPUDUP_IiEiM6sqjfz-jHZv4VFzVd_4L47g5zMSSXBovPtMjqC20Y62X7776zKxY80Oc-L4LnAQqzBAhCwG5EFQ5Di0zcEyH1GG1rGX2h1s6TghYE3vHvfc9f0bYHk2ShiJ7uqmxK6z34Dlf_mg0-sDJo7nmkag4vzwcvukKkER1fQAzHwoMVdEVHi8urtJr1se6SckWOvR5nCrnsxJLn5Q"
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
