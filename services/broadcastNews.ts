import fetch from './fetch';
import errorHandler from './handler/errorHandler';
import successHandler from './handler/successHandler';

export {
  createBroadcastNew
};


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