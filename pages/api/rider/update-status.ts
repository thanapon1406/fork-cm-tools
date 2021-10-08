import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";
import _ from 'lodash'

const host = process.env.POS_GRPC_API

const axiosInstance = axios.create({
  baseURL: host,
  timeout: 30000,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body } = req;
  if (method === "POST") {
    let _body = _.pickBy(body, _.identity);

    try {
      let token = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxIiwiZXhwIjoxNjMzNzYyNjg3LCJqdGkiOiI2ZDZhYmI4Mi0wZTM5LTQzYTktYTk1Ni05NTlhNjdkZTI2ZTciLCJpYXQiOjE2MzM2NzYyODcsImlzcyI6IkZ1bGwgVGVhbSBTbWFydCBQT1MiLCJuYmYiOjE2MzM2NzYyODcsInN1YiI6IjEiLCJlbWFpbCI6InRoYW5ha3JpdC5uYXdAZnVsbHRlYW0udGVjaCIsIm5hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJsYXN0X25hbWUiOiLguYDguJfguITguYLguJnguYLguKXguKLguLUiLCJ0eXBlIjoiY21zIiwicGVybWlzc2lvbnMiOm51bGwsImRhdGEiOnsiYnJhbmRfY29kZSI6IiIsImJyYW5kX2lkIjowLCJvdXRsZXRfY29kZSI6IiIsIm91dGxldF9pZCI6MCwidGVybWluYWxfY29kZSI6IiIsInRlcm1pbmFsX2lkIjowLCJ1c2VyX2ZpcnN0X25hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJ1c2VyX2xhc3RfbmFtZSI6IuC5gOC4l-C4hOC5guC4meC5guC4peC4ouC4tSIsInVzZXJfdHlwZSI6InN1cGVyYWRtaW4ifX0.sNhEq0OO7uLruqsXBEZrkIhovtpL6VvmD09h_pRXRUYwYVGxP1pAIgk9tq_9_EgxmSjlZqJh0rtG1pWOiOSmwixa6fGEUsGqdQ_VcyByfCChQ6_pOCeAjP-ZGbRB4-bG2yhNxgJ7tf7B8d__agotCcz2ZQoXI8SHSB9DQVwi6lwNZGTq6xehdaaGRh1t-YwNMRHAbvPWhe8j8kk50LmYrmUahBtcluuCd77-Jv7fXNjVJT29PV4o7YLEhz_CwJ4vfvGA3ywF2_IwBj6mQshObnT81M1ZFF55M-ZDunghGVp4Fe4AOgC6RvM5qW0A23UsPlAAbFslqn-j58IjTAMd0w"
      axiosInstance.defaults.headers.common['Authorization'] = token

      const { data, status } = await axiosInstance.post("rider-service/rider/update-status", _body);
      res.status(status).json(data);
    } catch (e: any) {
      res.status(e.response?.status || 500).json(e.response?.data);
      // res.status(e.response?.status).json(e.response.data);
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};
