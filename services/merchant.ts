import axios from "axios";

const fetchData = async (id:string) => {
  try {
    const result = await axios.get(`/merchant${id}`);
    return result
  } catch (error) {
      return error
  }
};


export { fetchData };
