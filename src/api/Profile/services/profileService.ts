import axiosInstance from "../../config";

const basePath = "/user-auth";

export const getServiceProfile = async () => {
  return await axiosInstance.get(`${basePath}/profile`);
};
