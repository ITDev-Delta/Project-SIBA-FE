import axiosInstance from "../../config";
import type { IMenu } from "../types/masterMenu.interface";

const basePath = "/master/menu";

// Get all menus
export const getAllMenus = async () => {
  const response = await axiosInstance.get(basePath);
  return response;
};

// Get menu by ID
export const getMenuById = async (id: string) => {
  const response = await axiosInstance.get(`${basePath}/${id}?is_single=true`);
  return response;
};

// Create new menu
export const createMenu = async (data: Partial<IMenu>) => {
  const response = await axiosInstance.post(basePath, data);
  return response;
};

// Update menu
export const updateMenu = async (id: string, data: Partial<IMenu>) => {
  const response = await axiosInstance.put(`${basePath}/${id}`, data);
  return response;
};
