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
      let token ="Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxIiwiZXhwIjoxNjMzNTAyMjYwLCJqdGkiOiIyZjBlZmZlMi0wNjc3LTQ0Y2MtOWE3Ni1hNjQ5YTZlY2RlYTEiLCJpYXQiOjE2MzM0MTU4NjAsImlzcyI6IkZ1bGwgVGVhbSBTbWFydCBQT1MiLCJuYmYiOjE2MzM0MTU4NjAsInN1YiI6IjEiLCJlbWFpbCI6InRoYW5ha3JpdC5uYXdAZnVsbHRlYW0udGVjaCIsIm5hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJsYXN0X25hbWUiOiLguYDguJfguITguYLguJnguYLguKXguKLguLUiLCJ0eXBlIjoiY21zIiwicGVybWlzc2lvbnMiOm51bGwsImRhdGEiOnsiYnJhbmRfY29kZSI6IiIsImJyYW5kX2lkIjowLCJvdXRsZXRfY29kZSI6IiIsIm91dGxldF9pZCI6MCwidGVybWluYWxfY29kZSI6IiIsInRlcm1pbmFsX2lkIjowLCJ1c2VyX2ZpcnN0X25hbWUiOiLguIvguKHguIvguLLguJnguYDguJfguIQiLCJ1c2VyX2xhc3RfbmFtZSI6IuC5gOC4l-C4hOC5guC4meC5guC4peC4ouC4tSIsInVzZXJfdHlwZSI6InN1cGVyYWRtaW4ifX0.j0dLeIefZPGnbGyTWbV7LXEhblfWapattTnw5W5ERNsCwd1PpDfBNqOjHde2PhZeusNfFwYB8g2-UGzsg1E_C19V294Hf63UgrGu9d7J4jR36-kKnJUv-1Ex0aPZuCo3EvrXYxSmifedMyFarPOnWYGbntu4YxQ2nL0LV6DA8kX8NzKWEpDzASwKmgFne1jKhKGJNhd0rdCJarkgWQLhozFLYoudLPpocZQnK6Z7VxC3hBSEQX6Rf9ia-GLp3QSrUIsQa9kkKBUc-i9uSREcRNgvS4JJOSj3qkIAueWgcGQCg-rgCt1iDIZdzdugk3C4Bs0By-_mjpEV7huBEI3xPA"
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
