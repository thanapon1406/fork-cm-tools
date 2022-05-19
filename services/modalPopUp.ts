import fetch from './fetch';
import errorHandler from './handler/errorHandler';
import successHandler from './handler/successHandler';

export {
  createModalPopUp, updateModalPopUp, getModalPopUp, getModalPopUpList, getModalPopUpActiveList, deleteModalPopUp
};

export interface requestModalPopUpInterface {
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

const createModalPopUp = async (req: any) => {
  try {
    const response = await fetch.post(`/api/modal-popup/create`, req);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
}

const updateModalPopUp = async (req: any) => {
  try {
    const response = await fetch.post(`/api/modal-popup/update`, req);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
}

const getModalPopUp = async (id: string) => {
  try {
    const result = await fetch.get(`/api/modal-popup/find?id=${id}`)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const deleteModalPopUp = async (id: number) => {
  try {
    const result = await fetch.get(`/api/modal-popup/delete?id=${id}`)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const getModalPopUpList = async (req: requestModalPopUpInterface) => {
  try {
    const result = await fetch.post(`/api/modal-popup/finds`, req)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

const getModalPopUpActiveList = async (req: requestModalPopUpInterface) => {
  try {
    const result = await fetch.post(`/api/modal-popup/find-all-active`, req)
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}