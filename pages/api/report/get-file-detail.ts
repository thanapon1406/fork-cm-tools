import { PREFIX_REPORT } from '@/constants/api'
import ServerFetch from '@/services/api'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body, query } = req
  if (method === 'GET') {
    try {
      const url: string = PREFIX_REPORT + `/file-detail/${query.key}`
      const { data, status } = await ServerFetch.getRest(url, headers, query)
      res.status(status).send(data)
    } catch (e: any) {
      res.status(e.response?.status || 500).json(e.response?.data)
    }
  }
}
