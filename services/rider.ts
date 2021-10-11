import axios from "axios"
import lodash from "lodash"
import successHandler from './handler/successHandler'
import errorHandler from './handler/errorHandler'
import fetch from './fetch'

export {
  getRider, getRiderDetail, getRejectReson, updateRiderStatus, getStatusHistories
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
  id?: string | string[] | undefined,
  include?: string
}

interface queryUpdateRiderStatus {
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
    const response = await fetch.post(`/api/rider/list`, req);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
};

const getRiderDetail = async (req: queryListDetail) => {
  try {
    const response = await fetch.post(`/api/rider/detail`, req);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
};

const getRejectReson = async () => {
  try {
    const response = await fetch.post(`/api/rider/reject-reason`);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
};

const updateRiderStatus = async (req: queryUpdateRiderStatus) => {
  try {
    const response = await fetch.post(`/api/rider/update-status`, req);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
};

const getStatusHistories = async (req: any) => {
  try {
    const response = await fetch.post(`/api/rider/status-histories`, req);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
};