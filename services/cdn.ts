import { API_PATH_CDN } from '@/constants/api'
import fetcher from '@/services/fetch/fetch'

const POS_WAPI = process.env.NEXT_PUBLIC_POS_WAPI

interface cdnGetObject {
  filepath?: string;
}

export const downloadImage = async (payload: cdnGetObject) => {

  const res = await fetcher(`${POS_WAPI}${API_PATH_CDN}/cdn/get-file?filepath=` + payload.filepath, {
    method: 'GET',
  })
  const result = await res.blob()
  return result
}
