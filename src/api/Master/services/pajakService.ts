import axiosInstance from "../../config";

const basePath = "/master/master_pajak";

export const getMasterPajak = async (params?: any) => {
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
  return await axiosInstance.get(`${basePath}`);
};

export const getMasterPajakById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const addMasterPajak = async (data: {
  jenis_pajak: string;
  kode_pajak: string;
  tarif_pajak: string;
  objek_pajak: string;
  is_active: string;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, value);
  });

  return await axiosInstance.post(`${basePath}`, formData);
};

export const editMasterPajak = async (data: {
  id: any;
  jenis_pajak: string;
  kode_pajak: string;
  tarif_pajak: string;
  objek_pajak: string;
  is_active: string;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (key === "id") return;
    formData.append(key, value);
  });

  return await axiosInstance.put(`${basePath}/${data.id}`, formData);
};

export const deleteMasterPajak = async (id: string) => {
  return await axiosInstance.delete(`${basePath}/${id}`);
};
