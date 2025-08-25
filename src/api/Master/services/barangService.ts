import axiosInstance from "../../config";

const basePath = "/master/master_barang";

export const getMasterBarang = async () => {
  return await axiosInstance.get(`${basePath}`);
};

export const getMasterBarangById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const addMasterBarang = async (data: {
  nama_barang: string;
  kode_barang: string;
  tipe_barang: string;
  keterangan: string;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, value);
  });

  return await axiosInstance.post(`${basePath}`, formData);
};

export const editMasterBarang = async (data: {
  id: any;
  nama_barang: string;
  kode_barang: string;
  tipe_barang: string;
  keterangan: string;
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

export const deleteMasterBarang = async (id: string) => {
  return await axiosInstance.delete(`${basePath}/${id}`);
};
