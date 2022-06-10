import fetch from './fetch';
import errorHandler from './handler/errorHandler';
import successHandler from './handler/successHandler';

export {
  createLsConfig
};

const createLsConfig = async (req: any) => {
  try {
    const response = await fetch.post(`/api/ls-config/create`, req);
    return successHandler(response)
  } catch (error) {
    return errorHandler(error)
  }
}