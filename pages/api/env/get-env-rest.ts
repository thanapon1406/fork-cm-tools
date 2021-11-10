import { NextApiRequest, NextApiResponse } from 'next'
const host_rest = process.env.POS_WAPI

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body, query } = req

  if (method === 'GET') {
    try {
      const data = {
        data: host_rest
      }
      res.status(200).send(data)
    } catch (e: any) {
      res.status(e.response?.status || 500).json(e.response?.data)
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
