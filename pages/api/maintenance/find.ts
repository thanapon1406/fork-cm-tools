import { API_MAINTENANCE_SERVICE, PREFIX_MAINTENANCE } from '@/constants/api'
import ServerFetch from '@/services/api'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body, query } = req
  if (method === 'GET') {
    try {
      const url: string = `${API_MAINTENANCE_SERVICE}${PREFIX_MAINTENANCE}/find-maintenance?brand_id=${process.env.NEXT_PUBLIC_KITCHENHUB_BRAND_ID}`
      const { data, status } = await ServerFetch.get(url, headers, query)
      res.status(status).send(data)
    } catch (e: any) {
      res.status(e.response?.status || 500).json(e.response?.data)
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}