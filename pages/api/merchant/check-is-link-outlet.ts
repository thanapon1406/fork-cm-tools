import ServerFetch from '@/services/api';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, headers, body, query } = req
    if (method === 'GET') {
        try {
            const url: string = `/merchant-service/outlet/check-is-link-outlet`
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