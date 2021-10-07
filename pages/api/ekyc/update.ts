import { API_PATH_EKYC_SERVICE, PREFIX_EKYC } from '@/constants/api'
import ServerFetch from '@/services/api'
import { NextApiRequest, NextApiResponse } from 'next'

const update = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body } = req
  if (method === 'PUT') {
    try {
      const { status, data } = await ServerFetch.put(
        `${API_PATH_EKYC_SERVICE}${PREFIX_EKYC}/update`,
        body,
        headers
      )
      res.status(status).json(data)
    } catch (e: any) {
      res.status(e.response?.status || 500).json(e.response?.data)
    }
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default update
