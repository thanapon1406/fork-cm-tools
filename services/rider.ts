import axios from "axios"
import lodash from "lodash"
import successHandler from './handler/successHandler'
import errorHandler from './handler/errorHandler'

export {
  getRider, getRiderDetail, getRejectReson, updateRiderStatus
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

interface queryListDetail {
  id?: string,
  include?: string
}

interface updateRiderStatus {
  data: {
    id?: string;
    status?: string;
    ekyc_status?: string;
    topic?: {
      id?: number;
      code?: string;
      title?: string;
      status?: boolean;
    }[];
  }
}

const getRider = async (req: queryList) => {
  try {
    const response = await axios.post(`/api/rider/list`, req);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
};

const getRiderDetail = async (req: queryListDetail) => {
  try {
    const response = await axios.post(`/api/rider/detail`, req);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
};

const getRejectReson = async () => {
  try {
    const response = await axios.post(`/api/rider/reject-reason`);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
};

const updateRiderStatus = async (req: updateRiderStatus) => {
  try {
    const response = await axios.post(`/api/rider/update-status`, req);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
};