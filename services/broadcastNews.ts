import fetch from './fetch';
import errorHandler from './handler/errorHandler';
import successHandler from './handler/successHandler';

export {
  createBroadcastNew, getBroadcastNew, updateBroadcastNew
};

export interface requestBroadcastNewInterface {
  id?: string
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

const getBroadcastNew = async (req: requestBroadcastNewInterface) => {
  try {
    const result = await fetch.get(`/api/broadcast-new/find/`, { params: req })
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}