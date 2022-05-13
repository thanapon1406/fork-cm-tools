import { API_PATH_CONTENT_SERVICE, PREFIX_MODAL_POPUP } from '@/constants/api'
import ServerFetch from '@/services/api'
import { NextApiRequest, NextApiResponse } from 'next'

interface findModalPopupInterface {
  keyword?: string
  app_id?: number
  create_date_start?: string
  create_date_end?: string
  is_eligible?: boolean
  page?: number
  per_page?: number
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body } = req
  if (method === 'POST') {
    try {
      const url: string = `${API_PATH_CONTENT_SERVICE}${PREFIX_MODAL_POPUP}/find-all`
      const { data, status } = await ServerFetch.postRaw(
        url,
        body as findModalPopupInterface,
        headers
      )
      res.status(status).send(data)
    } catch (e: any) {
      res.status(e.response?.status || 500).json(e.response?.data)
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
