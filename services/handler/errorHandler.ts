import { notification } from "antd";
import Router from "next/router";
import codeMessage from "@/constants/codeMessage";

const errorHandler = (error:any, emptyResult = null) => {
  
  const { response } = error;
  if (!response) {
    return {
      success: false,
      result: emptyResult,
      message: "Cannot connect to the server, Check your internet network",
    };
  } else if (response && response.status) {
    const message = response.data && response.data.detail;
    const errorText = message || codeMessage[response.status];
    const { status } = response;
    notification.config({
      duration: 20,
    });
    notification.error({
      message: `Request error ${status}`,
      description: errorText,
    });
    if (error.response.data.jwtExpired || `${status}`==="401") {
      Router.replace("/login");
    }
    return response.data;
  } else {
    notification.config({
      duration: 20,
    });
    notification.error({
      message: "Unknown Error",
      description: "An unknown error occurred in the app, please try again. ",
    });
    return {
      success: false,
      result: emptyResult,
      message: "An unknown error occurred in the app, please try again. ",
    };
  }
};

export default errorHandler;
