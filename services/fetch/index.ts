import axios from "axios";
import _ from "lodash";
import { retrieveToken } from "./auth";

const getWithToken = async (url: string, options = {}) => {
  const token = retrieveToken();

  let optionsWithToken = options;
  if (token !== null) {
    optionsWithToken = _.merge({}, options, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return await axios.get(url, optionsWithToken);
};

const postWithToken = async (url: string, body = {}, options = {}) => {
  const token = retrieveToken();
  let optionsWithToken = options;
  if (token !== null) {
    optionsWithToken = _.merge({}, options, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return await axios.post(url, body, optionsWithToken);
};

const putWithToken = async (url: string, body = {}, options = {}) => {
  const token = retrieveToken();

  let optionsWithToken = options;
  if (token !== null) {
    optionsWithToken = _.merge({}, options, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return await axios.put(url, body, optionsWithToken);
};

const deleteWithToken = async (url: string, options = {}) => {
  const token = retrieveToken();

  let optionsWithToken = options;
  if (token !== null) {
    optionsWithToken = _.merge({}, options, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return await axios.delete(url, optionsWithToken);
};

export default {
  get: getWithToken,
  post: postWithToken,
  put: putWithToken,
  delete: deleteWithToken,
};
