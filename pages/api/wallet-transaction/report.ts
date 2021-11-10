import { PREFIX_REPORT } from '@/constants/api'
import ServerFetch from '@/services/api'
import { NextApiRequest, NextApiResponse } from 'next'

const find = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body, query } = req
  if (method === 'GET') {
    try {
      const url: string = PREFIX_REPORT + `/rider-report/wallet-transaction-history-report/`
      const { data, status } = await ServerFetch.getRest(url, headers, query)
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
