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
  const { method, headers, body } = req
  if (method === 'POST') {
    try {
      const url: string = `${API_PATH_CONTENT_SERVICE}${PREFIX_BANNER}/find-banners-cm-tools`
      const { data, status } = await ServerFetch.post(url, body, headers)
      res.status(status).json(data)
    } catch (e: any) {
      res.status(e.response?.status || 500).json(e.response?.data)
      // res.status(e.response?.status).json(e.response.data);
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
