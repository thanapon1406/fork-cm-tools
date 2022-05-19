import { API_PATH_CONTENT_SERVICE, PREFIX_BANNER } from '@/constants/api'
import ServerFetch from '@/services/api'
import { NextApiRequest, NextApiResponse } from 'next'

interface bannerListInterface {
  keyword?: string
  start_date?: string
  end_date?: string
  page?: number
  per_page?: number
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body, query } = req
  if (method === 'GET') {
    try {
      const url: string = `${API_PATH_CONTENT_SERVICE}${PREFIX_BANNER}/find-banners`
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
