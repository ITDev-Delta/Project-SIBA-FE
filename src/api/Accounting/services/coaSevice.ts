import axiosInstance from "../../config";

const basePath = "/accounting/coa";

const coaTransactionPath = "/accounting/coa/coa_transaction";

export const getAccountCoa = async (level?: number, params?: any) => {
  if (params) {
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
      if (params[key] === "") delete params[key];
    });

    return await axiosInstance.get(`${basePath}`, {
      params: {
        level: level,
        ...params,
      },
    });
  }

  if (level) {
    return await axiosInstance.get(`${basePath}`, {
      params: {
        level: level,
      },
    });
  }

  return await axiosInstance.get(`${basePath}`);
};

export const getCoaTransaction = async () => {
  return await axiosInstance.get(coaTransactionPath);
};

export const getAccountCoaById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const addAccountCoa = async (data: {
  id_parent?: string;
  kategori: string;
  nama_akun: string;
  kode_akun: string;
  is_active: string;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, value);
  });

  return await axiosInstance.post(`${basePath}`, formData);
};

export const editAccountCoa = async (data: {
  id: any;
  kode_akun: string | undefined;
  is_active: string | undefined;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (key === "id") return;
    formData.append(key, value);
  });

  return await axiosInstance.put(`${basePath}/${data.id}`, formData);
};

export const deleteAccountCoa = async (id: string) => {
  return await axiosInstance.delete(`${basePath}/${id}`);
};

export const getAllCoaSetting = async () => {
  return axiosInstance.get(`${basePath}/settings/show`);
}

export const getCoaSetting = async (params: any) => {
  Object.keys(params).forEach((key) => {
    if (!params[key]) delete params[key];
    if (params[key] === "") delete params[key];
  });

  return axiosInstance.get(`${basePath}/settings/getSettings`, {
    params: params
  })
}

export const saveCoaSetting = async (params: any) => {
  Object.keys(params).forEach((key) => {
    if (!params[key]) delete params[key];
    if (params[key] === "") delete params[key];
  });

  return axiosInstance.post(`${basePath}/settings/save`, params);
}
