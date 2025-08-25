import axiosInstance from "../../config";
import type { IMasterAPI } from "../types/masterApi.interface";

const basePath = "/master/menu-api";

// Get all menus
export const getAllApis = async (params: any) => {
  const response = await axiosInstance.get(basePath, {
    params: {
      ...params,
    },
  });
  return response;
};

// Get menu by ID
export const getApiById = async (id: string) => {
  const response = await axiosInstance.get(`${basePath}/${id}?is_single=true`);
  return response;
};

export const getApiByParentId = async (id: string) => {
  const response = await axiosInstance.get(`${basePath}/menu/${id}`);
  return response;
};

// Create new menu
export const createApi = async (data: Partial<IMasterAPI>) => {
  const response = await axiosInstance.post(basePath, data);
  return response;
};

// Update menu
export const updateApi = async (id: string, data: any) => {
  const response = await axiosInstance.put(`${basePath}/${id}`, data);
  return response;
};
