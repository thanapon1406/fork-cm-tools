import { API_PATH_EKYC_SERVICE, PREFIX_EKYC } from '@/constants/api'
import ServerFetch from '@/services/api'
import { NextApiRequest, NextApiResponse } from 'next'

const presignUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, query } = req

  if (method === 'GET') {
    try {
      const { status, data } = await ServerFetch.get(
        `${API_PATH_EKYC_SERVICE}${PREFIX_EKYC}/sign-url`,
        headers,
        query
      )

      res.status(status).json(data)
    } catch (e: any) {
      res.status(e.response?.status || 500).json(e.response?.data)
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default presignUrl
