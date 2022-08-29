import ServerFetch from '@/services/api'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body } = req
  if (method === 'POST') {
    try {
      const url: string = `/api/v1/chat/findRoom`
      const { data, status } = await ServerFetch.postChat(url, body, headers)
      res.status(status).send(data)
    } catch (e: any) {
      console.log(`e`, e)
      res.status(e.response?.status || 500).json(e.response?.data)
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
