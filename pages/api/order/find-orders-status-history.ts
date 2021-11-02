import { API_PATH_ORDER_SERVICE, PREFIX_ORDER_STATUS } from '@/constants/api'
import ServerFetch from '@/services/api'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body, query } = req

  if (method === 'GET') {
    try {
      const url: string = `${API_PATH_ORDER_SERVICE}${PREFIX_ORDER_STATUS}/find-orders-status-history`
      const { data, status } = await ServerFetch.get(url, headers, query)
      res.status(status).json(data)
    } catch (e: any) {
      res.status(e.response?.status || 500).json(e.response?.data)
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
