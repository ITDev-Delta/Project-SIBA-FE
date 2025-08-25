import axiosInstance from "../../config";

const basePath = "/master/master_location";

export const getMasterLocation = async () => {
  return await axiosInstance.get(`${basePath}`);
};

export const getMasterLocationServiceById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const createMasterLocationService = async (data: any) => {
  return await axiosInstance.post(`${basePath}`, data);
};

export const updateMasterLocationService = async (id: string, data: any) => {
  return await axiosInstance.put(`${basePath}/${id}`, data);
};

