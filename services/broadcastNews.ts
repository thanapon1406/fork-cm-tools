import fetch from './fetch';
import errorHandler from './handler/errorHandler';
import successHandler from './handler/successHandler';

export {
  createBroadcastNew, getBroadcastNew, updateBroadcastNew, getBroadcastNewList
};

export interface requestBroadcastNewInterface {
  id?: string
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_type?: string;
  title?: string;
  active_status?: string;
  status?: string;
  schedule_start_date?: string;
  schedule_end_date?: string;
}

const createBroadcastNew = async (req: any) => {
  try {
    const data = {
      data: req
    }
    const response = await fetch.post(`/api/broadcast-new/create`, data);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
}

const updateBroadcastNew = async (req: any) => {
  try {
    const data = {
      data: req
    }
    const response = await fetch.post(`/api/broadcast-new/update`, data);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
}

const getBroadcastNew = async (id: number) => {
  try {
    const result = await fetch.get(`/api/broadcast-new/find?id=${id}`)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const getBroadcastNewList = async (req: requestBroadcastNewInterface) => {
  try {
    const result = await fetch.post(`/api/broadcast-new/finds`, req)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}