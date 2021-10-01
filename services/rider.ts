import axios from "axios"
import lodash from "lodash"
import successHandler from './handler/successHandler'
import errorHandler from './handler/errorHandler'

export {
  getRider
}

interface queryList {
  page: number;
  per_page: number;
  sort_by?: string;
  sort_type?: string;
  keyword?: string,
  approve_status?: string,
  status?: string,
  ekyc_status?: string,
  created_at?: object,
  updated_at?: object,
}

const getRider = async (req: queryList) => {
  try {
    const response = await axios.post(`/api/rider/list`, req);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
};