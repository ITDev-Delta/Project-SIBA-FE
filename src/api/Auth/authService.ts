import axiosInstance from "../config";

const basePath = "/login";

export const loginService = async (data?: any) => {
  return await axiosInstance.post(`${basePath}`, data);
};
