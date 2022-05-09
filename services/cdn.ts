import { API_PATH_CDN } from '@/constants/api';
import fetcher from '@/services/fetch/fetch';
import axios from 'axios';
import { retrieveToken } from './fetch/auth';
import errorHandler from './handler/errorHandler';

const POS_WAPI = process.env.NEXT_PUBLIC_POS_WAPI

interface cdnGetObject {
  filepath?: string;
}

interface cdnUploadObject {
  private: boolean
  file?: File;
}

export const downloadImage = async (payload: cdnGetObject) => {

  const res = await fetcher(`${POS_WAPI}${API_PATH_CDN}/cdn/get-file?filepath=` + payload.filepath, {
    method: 'GET',
  })
  const result = await res.blob()
  return result
}

const uploadImage = async (info: any) => {
  try {
    let formData = new FormData()
    formData.append('file', info)
    formData.append('field_index', 'modal_pop_up')
    formData.append('type', 'modal_pop_up')
    const result = await axios.post(`${POS_WAPI}${API_PATH_CDN}/cdn/upload`, formData, {
      headers: {
        "Authorization": "Bearer " + retrieveToken(),
        "Content-type": "multiplart/formdata"
      }
    }).then(res => res.data)
    return result
  } catch (error) {
    return errorHandler(error)
  }
}

export { uploadImage };

