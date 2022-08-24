import ServerFetch from '@/services/api'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body } = req
  // const host_chat = process.env.POS_CHAT
  // console.log('host_chat', host_chat)
  if (method === 'POST') {
    try {
      const url: string = `https://staging-pos-chat.devfullteam.tech/api/v1/chat/findRoom`
      const { data, status } = await ServerFetch.post(url, body, headers)
      console.log('data ', data)
      res.status(status).send(data)
    } catch (e: any) {
      //  console.log(e)
      res.status(e.response?.status || 500).json(e.response?.data)
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
