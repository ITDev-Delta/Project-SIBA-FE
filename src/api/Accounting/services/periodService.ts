import axiosInstance from "../../config";

const basePath = "/accounting/fiscal_period";

export const getFiscalPeriod = async (params?: any) => {
  if (params) {
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
  return await axiosInstance.get(`${basePath}`);
};

export const getFiscalPeriodById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const addFiscalPeriod = async (data: {
  nama_periode: string;
  tanggal_mulai: string;
  tanggal_berakhir: string;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, value);
  });

  return await axiosInstance.post(`${basePath}`, formData);
};

export const editFiscalPeriod = async (data: {
  id: any;
  nama_periode: string | undefined;
  tanggal_mulai: string | undefined;
  tanggal_berakhir: string | undefined;
  status: string | undefined;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (key === "id") return;
    formData.append(key, value);
  });

  return await axiosInstance.put(`${basePath}/${data.id}`, formData);
};

export const deleteFiscalPeriod = async (id: string) => {
  return await axiosInstance.delete(`${basePath}/${id}`);
};
