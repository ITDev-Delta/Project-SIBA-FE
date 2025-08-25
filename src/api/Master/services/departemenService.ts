import axiosInstance from "../../config";

const basePath = "/master/master_departemen";

export const getMasterDepartemen = async (params?: any) => {
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

export const getMasterDepartemenById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const addMasterDepartemen = async (data: {
  nama_departemen: string;
  kode_departemen: string;
  is_active: string;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, value);
  });

  return await axiosInstance.post(`${basePath}`, formData);
};

export const editMasterDepartemen = async (data: {
  id: any;
  nama_departemen: string;
  kode_departemen: string;
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

export const deleteMasterDepartemen = async (id: string) => {
  return await axiosInstance.delete(`${basePath}/${id}`);
};
