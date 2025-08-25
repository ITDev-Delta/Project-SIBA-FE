import axiosInstance from "../../config";

const basePath = "/master/master_payment_source";

export const getMasterPaymentSources = async (params?: any) => {
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

export const getMasterPaymentSourcesById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const addMasterPaymentSources = async (data: {
  nama_sumber_pembayaran: string;
  kode_sumber_pembayaran: string;
  coa_id: string;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, value);
  });

  return await axiosInstance.post(`${basePath}`, formData);
};

export const editMasterPaymentSources = async (data: {
  id: any;
  nama_sumber_pembayaran: string;
  kode_sumber_pembayaran: string;
  coa_id: string;
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

export const deleteMasterPaymentSources = async (id: string) => {
  return await axiosInstance.delete(`${basePath}/${id}`);
};
