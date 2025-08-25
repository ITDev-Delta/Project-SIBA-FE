import axiosInstance from "../../config";

const basePath = "/accounting/petty_cash_setting";

export const getSettingPettyCash = async (params?: any) => {
  if (params) {
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
      if (params[key] === "") delete params[key];
    });

    return await axiosInstance.get(`${basePath}`, {
      params: {
        status: params.status,
      },
    });
  }
  return await axiosInstance.get(`${basePath}`);
};

export const getSettingPettyCashServiceById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const addSettingPettyCash = async (data: {
  nama_petty_cash: string;
  departemen_id: string;
  coa_id: string;
  saldo_maksimum: string;
  maksimum_transaksi: string;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, value);
  });

  return await axiosInstance.post(`${basePath}`, formData);
};

export const editSettingPettyCash = async (data: {
  id: any;
  nama_petty_cash: string;
  departemen_id: number;
  coa_id: number;
  saldo_maksimum: string;
  maksimum_transaksi: string;
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
