import fetch from './fetch';
import errorHandler from './handler/errorHandler';
import successHandler from './handler/successHandler';

export {
  getBannerList, createBanner, deleteBanner, findBanner, updateBanner
};

export interface requestBannerInterface {
  name?: string;
  page?: number;
  per_page?: number;
  start_date?: string;
  end_date?: string;
}

const createBanner = async (req: any) => {
  try {
    const response = await fetch.post(`/api/banner/create`, req);
    return successHandler(response)
  } catch (error) {
    return errorHandler(error)
  }
}

const updateBanner = async (req: any) => {
  try {
    const response = await fetch.post(`/api/banner/update`, req);
    return successHandler(response)
  } catch (error) {
    return errorHandler(error)
  }
}

const deleteBanner = async (req: any) => {
  try {
    const response = await fetch.post(`/api/banner/delete`, req);
    return successHandler(response)
  } catch (error) {
    return errorHandler(error)
  }
}

const getBannerList = async (req: requestBannerInterface) => {
  try {
    const result = await fetch.post(`/api/banner/list`, req)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const findBanner = async (req: any) => {
  try {
    const result = await fetch.get(`/api/banner/find?id=${req}`)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}
