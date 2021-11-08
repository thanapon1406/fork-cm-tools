import ServerFetch from '@/services/api'
import { NextApiRequest, NextApiResponse } from 'next'

const find = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body } = req
  if (method === 'POST') {
    try {
      const url: string = `rider-service/wallet-balance/find`
      const { data, status } = await ServerFetch.post(url, body, headers)
      res.status(status).json(data)
    } catch (e: any) {
      res.status(e.response?.status || 500).json(e.response?.data)
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default find
