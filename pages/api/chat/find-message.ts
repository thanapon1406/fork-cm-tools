import ServerFetch from '@/services/api'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body } = req
  if (method === 'POST') {
    try {
      //const url: string = `${API_PATH_CONTENT_SERVICE}${PREFIX_BROADCAST_NEWS}/findMessage`
      const url: string = '/api/v1/chat/findAll'
      // console.log(url)
      const { data, status } = await ServerFetch.postChat(url, body, headers)
      //console.log("data ",data)
      res.status(status).send(data)
    } catch (e: any) {
      res.status(e.response?.status || 500).json(e.response?.data)
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
