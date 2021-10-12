import axios from "axios";
import errorHandler from './handler/errorHandler';
import successHandler from './handler/successHandler';

interface queryList {
  page?: number;
  per_page?: number;
  keyword?: string;
  sort_by?: string;
  sort_type?: string;
  ranking?: string;
  login_start_date?: string;
  login_end_date?: string;
  update_start_date?: string;
  update_end_date?: string;
  id: string;
}

const consumerList = async (option: queryList) => {
  try {
    const result = await axios.post(`/api/consumer/list`, option);
    return successHandler(result);
  } catch (error) {
    return errorHandler(error);
  }
};

export { consumerList };
