import axios, { AxiosRequestConfig } from "axios";

export const axiosApiRequest = async (configs: AxiosRequestConfig) => {
  try {
    const res = await axios({
      ...configs,
    });
    return res;
  } catch (error) {
    console?.error(error);
    return error.response;
  }
};
