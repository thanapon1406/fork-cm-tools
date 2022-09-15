import fetch from './fetch';
import errorHandler from './handler/errorHandler';
import successHandler from './handler/successHandler';

export {
  createMaintenance, getMaintenance
};

const createMaintenance = async (req: any) => {
  try {
    const response = await fetch.post(`/api/maintenance/create`, req);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
}

const getMaintenance = async () => {
  try {
    const result = await fetch.get(`/api/maintenance/find`)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}
