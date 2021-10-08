import { API_PATH_EKYC_SERVICE, PREFIX_EKYC } from '@/constants/api'
import ServerFetch from '@/services/api'
import { NextApiRequest, NextApiResponse } from 'next'

const list = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body } = req
  if (method === 'POST') {
    try {
      const { status, data } = await ServerFetch.post(
        `${API_PATH_EKYC_SERVICE}${PREFIX_EKYC}/find-all`,
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

export default list
// const ekyc = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { headers, body, query } = req
//   const { key } = query

//   switch (key) {
//     case 'list': {
//       const { status, data } = await getEkycList(body, headers)
//       res.status(status).json(data)
//     }
//     case 'detail': {
//       const { status, data } = await getEkyc(body, headers)
//       res.status(status).json(data)
//     }
//     case 'update': {
//       const { status, data } = await updateEkyc(body, headers)
//       res.status(status).json(data)
//     }
//   }
// }

// const getEkycList = async (payload: any, headers: any): Promise<any> => {
//   const { status, data } = await ServerFetch.post(
//     `${API_PATH_EKYC_SERVICE}${PREFIX_EKYC}/find-all`,
//     payload,
//     headers
//   )
//   return { status, data }
// }

// const getEkyc = async (payload: any, headers: any): Promise<any> => {
//   const { status, data } = await ServerFetch.post(
//     `${API_PATH_EKYC_SERVICE}${PREFIX_EKYC}/find`,
//     payload,
//     headers
//   )
//   return { status, data }
// }

// const updateEkyc = async (payload: any, headers: any): Promise<any> => {
//   const { status, data } = await ServerFetch.put(
//     `${API_PATH_EKYC_SERVICE}${PREFIX_EKYC}/update`,
//     payload,
//     headers
//   )
//   return { status, data }
// }

// export default ekyc
