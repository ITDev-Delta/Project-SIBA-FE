import axiosInstance from "../../config";

const basePath = "/master/master_produk";

export const getMasterProduct = async () => {
  return await axiosInstance.get(`${basePath}`);
};

export const addMasterProduct = async (data: {
  nama_produk: string;
  kode_produk: string;
  keterangan: string;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, value);
  });

  return await axiosInstance.post(`${basePath}`, formData);
};

export const editMasterProduct = async (data: {
  id: any;
  nama_produk: string;
  kode_produk: string;
  keterangan: string;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (key === "id") return;
    formData.append(key, value);
  });

  return await axiosInstance.put(`${basePath}/${data.id}`, formData);
};

export const deleteMasterProduct = async (id: string) => {
  return await axiosInstance.delete(`${basePath}/${id}`);
};
