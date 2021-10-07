import axios from "axios";
import _ from "lodash";
const host = process.env.POS_GRPC_API;

const axiosInstance = axios.create({
  baseURL: host,
  timeout: 30000,
});

const getServerSide = async (url: string, headers:any) => {
    const options = {
      headers: {
        Authorization: _.get(headers, "authorization")
      },
    }
  return await axiosInstance.get(url, options);
}

const postServerSide = async (url: string, body = {}, headers = {}) => {
  const options = {
    headers: {
      Authorization: _.get(headers, "authorization")
    },
  }
  let _body = _.pickBy(body, _.identity);
  return await axiosInstance.post(url, _body, options);
};

const putServerSide = async (url: string, body = {}, headers = {}) => {
  const options = {
    headers: {
      Authorization: _.get(headers, "authorization")
    },
  }
  let _body = _.pickBy(body, _.identity);
  return await axiosInstance.put(url, _body, options);
};

const deleteServerSide = async (url: string, headers:any) => {
  const options = {
    headers: {
      Authorization: _.get(headers, "authorization")
    },
  }
return await axiosInstance.delete(url, options);
}

export default {
  get: getServerSide,
  post: postServerSide,
  put: putServerSide,
  delete: deleteServerSide,
};
