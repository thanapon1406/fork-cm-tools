import fetch from './fetch';
import errorHandler from './handler/errorHandler';
import successHandler from './handler/successHandler';

export interface queryList {
  page?: number
  per_page?: number
  keyword?: string
  sort_by?: string
  sort_type?: string
}

export {
  createLsConfig,
  lsConfigList
};

const createLsConfig = async (req: any) => {
  try {
    const response = await fetch.post(`/api/ls-config/create`, req);
    return successHandler(response)
  } catch (error) {
    return errorHandler(error)
  }
}

const lsConfigList = async (option: queryList) => {
  try {
    const result = await fetch.post(`/api/ls-config/list`, option)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}