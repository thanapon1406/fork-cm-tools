import { API_PATH_EKYC_SERVICE, PREFIX_EKYC } from '@/constants/api'
import ServerFetch from '@/services/api'
import { NextApiRequest, NextApiResponse } from 'next'

const detail = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body } = req
  if (method === 'POST') {
    try {
      const { status, data } = await ServerFetch.post(
        `${API_PATH_EKYC_SERVICE}${PREFIX_EKYC}/find`,
        body,
        headers
      )
      res.status(status).json(data)
    } catch (e: any) {
      res.status(e.response?.status || 500).json(e.response?.data)
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default detail
