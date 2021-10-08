import { NextApiRequest, NextApiResponse } from 'next'
import ServerFetch from '@/services/api'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body } = req
  if (method === 'POST') {
    try {
      const url: string = `merchant-service/Outlet/FindOutletsCMS`
      const { data, status } = await ServerFetch.post(url, body, headers)
      console.log(`data`, data)
      res.status(status).json(data)
    } catch (e: any) {
      res.status(e.response?.status || 500).json(e.response?.data)
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
