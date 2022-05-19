import fetch from './fetch';
import errorHandler from './handler/errorHandler';
import successHandler from './handler/successHandler';

export {
  getBannerList
};

export interface requestBannerInterface {
  id?: string
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_type?: string;
  title?: string;
  active_status?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  is_eligible?: boolean;
}

const getBannerList = async (req: requestBannerInterface) => {
  try {
    const result = await fetch.get(`/api/banner/list`, req)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}
