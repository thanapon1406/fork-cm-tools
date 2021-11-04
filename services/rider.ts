import fetch from './fetch';
import errorHandler from './handler/errorHandler';
import successHandler from './handler/successHandler';

export {
  getRider, getRiderDetail, getRejectReson, updateRiderStatus, getStatusHistories, updateRider
};

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
  include?: string;
}

interface queryListDetail {
  id?: string | string[] | undefined
  sso_id?: string
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

interface riderUpdate {
  data: {
    id: string | string[] | undefined;
    status?: string;
    verify_email?: boolean;
    view_approve_status?: boolean;
    first_name?: string;
    email?: string;
    last_name?: string;
    phone?: string;
    country_code?: string;
    active_status?: string;
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

const updateRider = async (req: riderUpdate) => {
  try {
    const response = await fetch.post(`/api/rider/update`, req);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
};