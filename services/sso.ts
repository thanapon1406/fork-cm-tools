import fetch from './fetch';
import errorHandler from './handler/errorHandler';
import successHandler from './handler/successHandler';

export { getAccountCms };
interface queryList {
  id: string;
}

const getAccountCms = async (req: queryList) => {
  try {
    const response = await fetch.post(`/api/sso/user`, req);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
};