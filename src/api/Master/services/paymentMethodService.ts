import axiosInstance from "../../config";

const basePath = "/master/master_payment_method";

export const getMasterPaymentMethod = async (params?: any) => {
  if (params?.is_pagination) {
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
      if (params[key] === "") delete params[key];
      if (key === "is_pagination") delete params[key];
    });

    return await axiosInstance.get(`${basePath}/pagination`, {
      params: {
        ...params,
        page: params.page,
        per_page: params.per_page,
      },
    });
  }
  return await axiosInstance.get(`${basePath}`, { params });
};

export const getMasterPaymentMethodById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const addMasterPaymentMethod = async (data: {
  nama_metode_pembayaran: string;
  kode_metode_pembayaran: string;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, value);
  });

  return await axiosInstance.post(`${basePath}`, formData);
};

export const editMasterPaymentMethod = async (data: {
  id: any;
  nama_metode_pembayaran: string;
  kode_metode_pembayaran: string;
  status: string;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (key === "id") return;
    formData.append(key, value);
  });

  return await axiosInstance.put(`${basePath}/${data.id}`, formData);
};

export const deleteMasterPaymentMethod = async (id: string) => {
  return await axiosInstance.delete(`${basePath}/${id}`);
};
