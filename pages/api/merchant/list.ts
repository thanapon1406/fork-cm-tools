import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { convertJsonToParam } from '@/utils/helpers'
import _ from 'lodash'
const host = process.env.POS_GRPC_API;

const axiosInstance = axios.create({
  baseURL: host,
  timeout: 30000,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body } = req;
  
  if (method === "POST") {
    try {
    let _body = _.pickBy(body, _.identity);
      const { data, status } = await axiosInstance.post(
        `merchant-service/Outlet/FindOutletsCMS`,_body)
      res.status(200).json(data);
    } catch (e) {
      res.status(e.response?.status || 500).json(e.response?.data);
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};
