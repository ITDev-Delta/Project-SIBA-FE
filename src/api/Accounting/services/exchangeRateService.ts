import axiosInstance from "../../config";

const basePath = "/accounting/exchange-rate";

export const getServiceExchangeRate = async (params?: any) => {
  if (params) {
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
      if (params[key] === "") delete params[key];
    });

    return await axiosInstance.get(`${basePath}`, {
      params: {
        ...params,
      },
    });
  }
  return await axiosInstance.get(`${basePath}`);
};

export const postServiceExchangeRate = async (data?: any) => {
  return await axiosInstance.post(`${basePath}/store`, data);
};
