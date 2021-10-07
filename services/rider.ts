import fetch from './fetch'
import lodash from "lodash"
import successHandler from './handler/successHandler'
import errorHandler from './handler/errorHandler'

interface queryList {
  page: number;
  per_page: number;
  sort_by?: string;
  sort_type?: string;
  keyword?: string;
  approve_status?: string;
  status?: string;
  ekyc_status?: string;
  created_at?: object;
  updated_at?: object;
}


const getRider = async (body: queryList) => {
  try {
    const response = await fetch.post(`/api/rider/list`, body);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
};


export {
  getRider
}