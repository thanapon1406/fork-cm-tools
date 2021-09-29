import axios from "axios";
import successHandler from './handler/successHandler'
import errorHandler from './handler/errorHandler'

interface loginRequest{
    username:string;
    password:string;
}

const login = async ({username,password}:loginRequest) => {
  try {
    const body = {
      client_id: "test",
      client_secret: "test",
      grant_type: "password",
      password:password,
      username: username,
    };
    const response = await axios.post(`/api/login`, body);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);;
  }
};

export { login };
