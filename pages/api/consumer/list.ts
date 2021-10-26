import { API_PATH_CONSUMER_SERVICE, PREFIX_CUSTOMER } from '@/constants/api';
import ServerFetch from '@/services/api';
import axios from "axios";
import _ from 'lodash';
import { NextApiRequest, NextApiResponse } from "next";
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
      const { data, status } = await ServerFetch.post(
        `${API_PATH_CONSUMER_SERVICE}${PREFIX_CUSTOMER}/get-customer-list`,
        _body,
        headers)
      res.status(200).json(data);
    } catch (e: any) {
      console.log(`e`, e)
      res.status(e.response?.status || 500).json(e.response?.data);
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};
