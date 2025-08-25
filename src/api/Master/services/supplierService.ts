import axiosInstance from "../../config";

const basePath = "/master/master_supplier";

export const getMasterSupplier = async (params?: any) => {
  if (params) {
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
    return await axiosInstance.get(`${basePath}`, { params });
  }
  return await axiosInstance.get(`${basePath}`);
};

export const getMasterSupplierById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const addMasterSupplier = async (data: {
  nama_supplier: string;
  kode_supplier: string;
  supplier_type: string;
  supplier_group: string;
  nomor_telepon?: string | null;
  email?: string | null;
  negara?: string | null;
  provinsi?: string | null;
  kota?: string | null;
  kode_pos: string;
  alamat_supplier: string;
  memo?: string | null;
  is_pkp: string;
  is_active: string;
  // accounting
  coa_hutang_id: string;
  batas_hutang: string;
  coa_piutang_id: string;
  batas_piutang: string;
  // pajak
  nomor_npwp: string;
  nama_npwp: string;
  master_pajak_id: string[];
  coa_id: string[];
  tarif_pajak: string[];

  // contact person
  nama_cp: string[];
  no_telp_cp: string[];
  email_cp: string[];

  // currency
  currency_id: string[];
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (value === "") return;
    if (key === "id") return;
    if (Array.isArray(value)) {
      value.forEach((val) => {
        formData.append(`${key}[]`, val); // Laravel akan mengenali ini sebagai array
      });
    } else {
      formData.append(key, value.toString());
    }
  });
  return await axiosInstance.post(`${basePath}`, formData);
};

export const editMasterSupplier = async (data: {
  id: string;
  nama_supplier: string;
  kode_supplier: string;
  supplier_type: string;
  supplier_group: string;
  nomor_telepon?: string | null;
  email?: string | null;
  negara?: string | null;
  provinsi?: string | null;
  kota?: string | null;
  kode_pos: string;
  alamat_supplier: string;
  memo?: string | null;
  is_pkp: string;
  is_active: string;
  // accounting
  coa_hutang_id: string;
  batas_hutang: string;
  coa_piutang_id: string;
  batas_piutang: string;
  // pajak
  nomor_npwp: string;
  nama_npwp: string;
  master_pajak_id: string[];
  coa_id: string[];
  tarif_pajak: string[];

  // contact person
  nama_cp: string[];
  no_telp_cp: string[];
  email_cp: string[];

  // currency
  currency_id: string[];
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (value === "") return;
    if (key === "id") return;
    if (Array.isArray(value)) {
      value.forEach((val) => {
        formData.append(`${key}[]`, val); // Laravel akan mengenali ini sebagai array
      });
    } else {
      formData.append(key, value.toString());
    }
  });
  return await axiosInstance.put(`${basePath}/${data.id}`, formData);
};

export const deleteMasterSupplier = async (id: string) => {
  return await axiosInstance.delete(`${basePath}/${id}`);
};
