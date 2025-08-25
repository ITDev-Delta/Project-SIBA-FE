import axiosInstance from "../../config";

const basePath = "/logistic/wip_account";

export const getWipAccountService = async (params?: any) => {
  if (params) {
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
      if (params[key] === "") delete params[key];
    });
    return await axiosInstance.get(`${basePath}`, {
      params: params,
    });
  }
  return await axiosInstance.get(`${basePath}`);
};

export const getWipAccountServiceById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const addWipAccountService = async (data: any) => {
  return await axiosInstance.post(`${basePath}`, data);
};

export const editWipAccountService = async (data: any) => {
  return await axiosInstance.put(`${basePath}/${data.id}`, data);
};

export const getCoaWipAccountService = async (params?: any) => {
  if (params) {
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
      if (params[key] === "") delete params[key];
    });
    return await axiosInstance.get(`${basePath}/coa_wip`, {
      params: params,
    });
  }
  return await axiosInstance.get(`${basePath}/coa_wip`);
};
