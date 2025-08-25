import axiosInstance from "../../config";

const basePath = "/accounting/currency";

export const getCurrency = async (params?: any) => {
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

export const getCurrencyServiceById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const addCurrency = async (data: {
  nama_currency: string;
  kode_currency: string;
  is_active: string;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, value);
  });

  return await axiosInstance.post(`${basePath}`, formData);
};

export const editCurrency = async (data: {
  id: any;
  nama_currency: string | undefined;
  kode_currency: string | undefined;
  is_active: number | undefined;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (key === "id") return;
    formData.append(key, value);
  });

  return await axiosInstance.put(`${basePath}/${data.id}`, formData);
};

export const deleteCurrency = async (id: string) => {
  return await axiosInstance.delete(`${basePath}/${id}`);
};
