import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

const host = process.env.POS_GRPC_API

const axiosInstance = axios.create({
  baseURL: host,
  timeout: 30000,
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body } = req
  if (method === 'POST') {
    try {
      const { data, status } = await axiosInstance.post('staff-service/OAuth/token', body)
      res.status(status).json(data)
    } catch (e: any) {
      res.status(e.response?.status).json(e.response.data)
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
