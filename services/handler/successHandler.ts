import { notification } from "antd";

import codeMessage from "@/constants/codeMessage";

const successHandler = (result: any, typeNotification = {}) => {
  let response: any = {
    status: 404,
    url: null,
    result: null,
    success: false,
  };
  const { data, status } = result;
  if (`${status}` === "200" && data) {
    response.status = status;
    response.success = true;
    response.result = data;
    return response;
  } else {
    const message = data.detail ;
    const errorText = message || codeMessage[response.status];
    response.status = status;
    notification.config({
      duration: 20,
    });
    notification.error({
      message: `Request error ${status}`,
      description: errorText,
    });
    return response;
  }
};

export default successHandler;
