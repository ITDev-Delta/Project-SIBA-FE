import axiosInstance from "../../config";

const basePath = "/master/master_items_category";

export const getMasterItemCategory = async (params?: any) => {
  if (params) {
    return await axiosInstance.get(`${basePath}`, {
      params: {
        status: params.status,
        nama_category: params.nama_category,
        item_class: params.item_class,
        kode_category: params.kode_category,
        is_pagination: params.is_pagination,
        per_page: params.per_page,
      },
    });
  }
  return await axiosInstance.get(`${basePath}`);
};

export const getMasterItemCategoryById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const addMasterItemCategory = async (data: {
  nama_category: string;
  kode_category: string;
  item_class: string;
  status: string;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, value);
  });

  return await axiosInstance.post(`${basePath}`, formData);
};

export const editMasterItemCategory = async (data: {
  id: any;
  nama_category: string;
  kode_category: string;
  item_class: string;
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
