import axiosInstance from "../../config";

const basePath = "/master/master_customer";

export const getMasterCustomer = async (params?: any) => {
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
    return await axiosInstance.get(`${basePath}`, {
      params: {
        is_active: params.is_active,
      },
    });
  }
  return await axiosInstance.get(`${basePath}`);
};

export const getMasterCustomerById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

interface IParams {
  id?: string;
  nama_customer: string;
  kode_customer: string;
  customer_type: string;
  customer_group: string;
  nomor_telepon?: string | null;
  email?: string | null;
  negara?: string | null;
  provinsi?: string | null;
  kota?: string | null;
  kode_pos: string;
  alamat_customer: string;
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
}

export const editMasterCustomer = async (data: IParams) => {
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

export const addMasterCustomer = async (data: IParams) => {
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

export const deleteMasterCustomer = async (id: string) => {
  return await axiosInstance.delete(`${basePath}/${id}`);
};

export const getActiveCustomer = async () => {
  return await axiosInstance.get(`${basePath}`, {
    params: {
      is_active: '1',
    },
  });
}
