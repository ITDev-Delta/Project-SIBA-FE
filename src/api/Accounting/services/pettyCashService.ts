import axiosInstance from "../../config";

const basePath = "/accounting/petty_cash_journal";

export const getPettyCash = async (params?: any) => {
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

export const getServicePettyCashByStatus = async (params?: any) => {
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

export const getServicePettyCashById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const addServicePetttyCash = async (data: {
  petty_cash_setting_id: string;
  tanggal_jatuh_tempo: string;
  tanggal_reminder: string;
  pemohon: string;
  nominal_pengajuan: string;
  deskripsi: string;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, value);
  });

  return await axiosInstance.post(`${basePath}`, formData);
};

export const editPettyCash = async (data: {
  id: any;
  deskripsi: string;
  nominal_realisasi: string;
  status: string;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (key === "id") return;
    formData.append(key, value);
  });

  return await axiosInstance.put(`${basePath}/${data.id}`, data);
};

export const postPettyCash = async (id: number, data: any) => {
  // const formData = new FormData();
  // Object.entries(data).forEach(([key, value]) => {
  //   if (value === null || value === undefined) return;
  //   if (key === "id") return;
  //   formData.append(key, value);
  // });

  return await axiosInstance.put(`${basePath}/posted/${id}`, data);
};
