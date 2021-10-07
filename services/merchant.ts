import successHandler from './handler/successHandler'
import errorHandler from './handler/errorHandler'
import fetch from './fetch'

interface queryList {
  page: number;
  per_page: number;
  keyword?: string;
  sort_by?: string;
  sort_type?: string;
  verify_status?: string;
  ekyc_status?: string;
  start_date_create?: string;
  end_date_create?: string;
  start_date_verify?: string;
  end_date_verify?: string;
  approve_status?: string;
}

const outletList = async (body: queryList) => {
  try {
    const result = await fetch.post(`/api/merchant/list`, body);
    return successHandler(result);
  } catch (error) {
    return errorHandler(error);
  }
};

export { outletList };
