import axiosInstance from "../../config";

const basePath = "/accounting/petty_cash_request_journal";

export const getRequestSaldo = async (params?: any) => {
  if (params) {
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
      if (params[key] === "") delete params[key];
    });

    return await axiosInstance.get(`${basePath}`, {
      params: {
        ...params,
        page: params.page,
        per_page: params.per_page,
      },
    });
  }
  return await axiosInstance.get(`${basePath}`);
};

export const getRequestSaldoServiceByPettyCash = async (params: any) => {
  Object.keys(params).forEach((key) => {
    if (!params[key]) delete params[key];
    if (params[key] === "") delete params[key];
  });

  return await axiosInstance.get(`${basePath}`, {
    params: {
      ...params,
      page: params.page,
      per_page: params.per_page,
    },
  });
};

export const getRequestSaldoServicebyId = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const editRequestSaldoStatus = async (data: {
  id: any;
  deskripsi: string;
  nominal_pengajuan: string;
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

export const addRequestSaldo = async (data: {
  petty_cash_setting_id: number;
  tanggal_journal: string;
  deskripsi: string;
  nominal_pengajuan: any;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, value);
  });

  return await axiosInstance.post(`${basePath}`, formData);
};
