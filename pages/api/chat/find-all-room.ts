import { API_PATH_CONTENT_SERVICE, PREFIX_BROADCAST_NEWS } from '@/constants/api'
import ServerFetch from '@/services/api'
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body } = req
  if (method === 'POST') {
    try {
      //const url: string = `${API_PATH_CONTENT_SERVICE}${PREFIX_BROADCAST_NEWS}/findMessage`
     // const url: string = 'http://localhost:4000/api/v1/chat/findRoom'
       const url: string = 'https://staging-pos-chat.devfullteam.tech/api/v1/chat/findRoom'

      // console.log(url)
      // const { data, status } = await axios.post(url, body, {
      //   headers: {
      //     Authorization: "Bearer"+" eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxIiwiZXhwIjoxNzQxMDczNDcxLCJqdGkiOiJkZjkyMTM4NS03ODdiLTRmNDQtYjNjYy05YmE1M2Q1OWZiYzQiLCJpYXQiOjE2MzI5ODcwNzEsImlzcyI6IkZ1bGwgVGVhbSBTbWFydCBQT1MiLCJuYmYiOjE2MzI5ODcwNzEsInN1YiI6IkFSTS0xMTEiLCJlbWFpbCI6ImFybS1kZXZAZnVsbHRlYW0udGVjaCIsIm5hbWUiOiJhcm0iLCJsYXN0X25hbWUiOiJhcm1fbGFzdG5hbWUiLCJ0eXBlIjoiY29uc3VtZXIiLCJwZXJtaXNzaW9ucyI6bnVsbCwiZGF0YSI6eyJhcHBfaWQiOiIxIiwiYXBwX25hbWUiOiJjb25zdW1lciIsInByb2plY3RfaWQiOiIxIiwibW9iaWxlX251bWJlciI6IjY2ODIzNDU2Nzg5IiwibW9iaWxlX251bWJlcl92ZXJpZmllZCI6dHJ1ZX19.kNSzmgAYcmmHYm6970u36f1X73W_sEMTzYjtXsCF0609a9eezk1J-ywJcoe90PteMZgZADn5prZejqPtM19QviSJdu0j62eB1PnoElygvooRUOxiikKpy00H8JSear41t7l3ruHlBFafuJdcKHV-0AdUFjKA-GnEs-OCHGQNc8kcycuA9TTrQUTPQ5GwLdJv1FlPNJtfDpHXrtKjhvAHfWWawCUy-zHv4v9vrJkCiqTBuO_NqK7oKK7yMLyDQJDV_l9dwNbIOcBjFgcTtXmAmXC9OsANOrbdYkT0cY-2qEe4KjUtKzDANIkw0jefNpxr17spsQxcc-arUQz7d_9w-g"
      //   },
      // })
       const { data, status } = await ServerFetch.post(url, body, headers )
      //console.log("data ",data)
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
