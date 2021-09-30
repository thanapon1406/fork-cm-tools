import axios from "axios";
import { convertJsonToParam } from '@/utils/helpers'
import successHandler from './handler/successHandler'
import errorHandler from './handler/errorHandler'

interface queryList {
  page: number;
  per_page: number;
  keyword?: number;
  sort_by?: string;
  sort_type?: string;
  verify_status?: string;
  ekyc_status?: string;
  start_date_create?: string;
  end_date_create?: string;
  start_date_verify?: string;
  end_date_verify?: string;
  approve_status?: string;
  outlet_structure?: string;
}

const outletList = async (option: queryList) => {
  try {
    const result = await axios.post(`/api/merchant/list`, option);
    return successHandler(result);
  } catch (error) {
    return errorHandler(error);
  }
};

export { outletList };
