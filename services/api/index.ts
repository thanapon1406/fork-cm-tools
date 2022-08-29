import axios from 'axios'
import _ from 'lodash'
const host = process.env.POS_GRPC_API
const host_rest = process.env.POS_WAPI
const host_sso = process.env.POS_APP_SSO
const host_chat = process.env.POS_CHAT

const axiosInstance = axios.create({
  baseURL: host,
  timeout: 30000,
})

const axiosRestInstance = axios.create({
  baseURL: host_rest,
  timeout: 30000,
})

const axiosSsoInstance = axios.create({
  baseURL: host_sso,
  timeout: 30000,
})

const axiosChatInstance = axios.create({
  baseURL: host_chat,
  timeout: 30000,
})

const getServerSide = async (url: string, headers: any, params = {}) => {
  const options = {
    headers: {
      Authorization: _.get(headers, 'authorization'),
    },
    params,
  }
  return await axiosInstance.get(url, options)
}

const postServerSide = async (url: string, body = {}, headers = {}) => {
  const options = {
    headers: {
      Authorization: _.get(headers, 'authorization'),
    },
  }
  let _body = _.pickBy(body, _.identity)
  return await axiosInstance.post(url, _body, options)
}

const postRawServerSide = async (url: string, body = {}, headers = {}) => {
  const options = {
    headers: {
      Authorization: _.get(headers, 'authorization'),
    },
  }
  return await axiosInstance.post(url, body, options)
}

const putServerSide = async (url: string, body = {}, headers = {}) => {
  const options = {
    headers: {
      Authorization: _.get(headers, 'authorization'),
    },
  }
  let _body = _.pickBy(body, _.identity)
  return await axiosInstance.put(url, _body, options)
}

const deleteServerSide = async (url: string, headers: any) => {
  const options = {
    headers: {
      Authorization: _.get(headers, 'authorization'),
    },
  }
  return await axiosInstance.delete(url, options)
}

const getServerSideRest = async (url: string, headers: any, params = {}) => {
  const options = {
    headers: {
      Authorization: _.get(headers, 'authorization'),
    },
    params,
  }
  return await axiosRestInstance.get(url, options)
}

const postServerSideRest = async (url: string, body = {}, headers = {}) => {
  const options = {
    headers: {
      Authorization: _.get(headers, 'authorization'),
    },
  }
  let _body = _.pickBy(body, _.identity)
  return await axiosRestInstance.post(url, _body, options)
}

const putServerSideRest = async (url: string, body = {}, headers = {}) => {
  const options = {
    headers: {
      Authorization: _.get(headers, 'authorization'),
    },
  }
  let _body = _.pickBy(body, _.identity)
  return await axiosRestInstance.put(url, _body, options)
}

const deleteServerSideRest = async (url: string, headers: any) => {
  const options = {
    headers: {
      Authorization: _.get(headers, 'authorization'),
    },
  }
  return await axiosRestInstance.delete(url, options)
}

const postServerSideSso = async (url: string, body = {}, headers = {}) => {
  const options = {
    headers: {
      Authorization: _.get(headers, 'authorization'),
    },
  }
  let _body = _.pickBy(body, _.identity)
  return await axiosSsoInstance.post(url, _body, options)
}

const postServerSideChat = async (url: string, body = {}, headers = {}) => {
  const options = {
    headers: {
      Authorization: _.get(headers, 'authorization'),
    },
  }
  let _body = _.pickBy(body, _.identity)
  return await axiosChatInstance.post(url, _body, options)
}

const apiFetch = {
  get: getServerSide,
  post: postServerSide,
  put: putServerSide,
  delete: deleteServerSide,
  getRest: getServerSideRest,
  postRest: postServerSideRest,
  putRest: putServerSideRest,
  deleteRest: deleteServerSideRest,
  postSso: postServerSideSso,
  postRaw: postRawServerSide,
  postChat: postServerSideChat,
}

export default apiFetch
