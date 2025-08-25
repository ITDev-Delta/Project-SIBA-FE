import axiosInstance from "../../config";

const basePath = "/master/master_item";

export const getMasterItem = async (params?: any) => {
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
  } else {
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
};

export const getMasterItemById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const addMasterItem = async (data: {
  item_class: string;
  kode_item: string;
  nama_item: string;
  tracking_method: string;
  have_expiry_date: string;
  item_category_id: string;
  file_path: File | null;
  is_buyable: string;
  is_sellable: string;
  is_itembundling: string;
  memo: string;
  status: string;
  satuan: any[];
  coa: any[];
  bundling: any[];
  estimasi_harga: any[];
  alias: any[];
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (
      key === "bundling" &&
      (value === null || (Array.isArray(value) && value.length === 0))
    ) {
      formData.append("bundling", ""); // atau bisa jadi formData.append("bundling", JSON.stringify([]))
    }
    if (
      key === "estimasi_harga" &&
      (value === null || (Array.isArray(value) && value.length === 0))
    ) {
      formData.append("estimasi_harga", ""); // atau bisa jadi formData.append("estimasi_harga", JSON.stringify([]))
    }
    if (
      key === "satuan" &&
      (value === null || (Array.isArray(value) && value.length === 0))
    ) {
      formData.append("satuan", "");
    }
    if (value === null || value === undefined) return;
    if (key === "id") return;

    // Jika key adalah file_path dan berisi file, tambahkan langsung
    if (key === "file_path" && value instanceof File) {
      formData.append("file_path", value);
    }
    // Jika key adalah array of objects (satuan, coa, bundling), kirim satu per satu
    else if (
      ["satuan", "coa", "bundling", "estimasi_harga", "alias"].includes(key) &&
      Array.isArray(value)
    ) {
      value.forEach((val, index) => {
        Object.entries(val).forEach(([subKey, subValue]) => {
          formData.append(
            `${key}[${index}][${subKey}]`,
            subValue as string | Blob
          );
        });
      });
    }
    // Jika key adalah array biasa, tambahkan satu per satu
    else if (Array.isArray(value)) {
      value.forEach((val, index) => {
        formData.append(`${key}[${index}]`, val);
      });
    }
    // Tambahkan key-value biasa
    else {
      formData.append(key, value);
    }
  });

  return await axiosInstance.post(`${basePath}`, formData);
};

export const editMasterItem = async (data: {
  id: any;
  item_class: string;
  kode_item: string;
  nama_item: string;
  tracking_method: string;
  have_expiry_date: string;
  item_category_id: string;
  file_path: File | null;
  is_buyable: string;
  is_sellable: string;
  is_itembundling: string;
  memo: string;
  status: string;
  satuan: any[];
  coa: any[];
  bundling: any[];
  estimasi_harga: any[];
  alias: any[];
}) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (key === "id") return;

    if (key === "file_path" && value instanceof File) {
      formData.append("file_path", value);
    } else if (
      ["satuan", "coa", "bundling", "estimasi_harga", "alias"].includes(key) &&
      Array.isArray(value)
    ) {
      value.forEach((val, index) => {
        Object.entries(val).forEach(([subKey, subValue]) => {
          formData.append(
            `${key}[${index}][${subKey}]`,
            subValue as string | Blob
          );
        });
      });
    } else if (Array.isArray(value)) {
      value.forEach((val, index) => {
        formData.append(`${key}[${index}]`, val);
      });
    } else {
      formData.append(key, value);
    }
  });

  return await axiosInstance.post(`${basePath}/${data.id}`, formData);
};

export const getServicePurchaseHistoryMasterItem = async (id: string) => {
  return await axiosInstance.get(
    `${basePath}/purchase_history?master_item=${id}`
  );
};

export const getServiceTrackingCodeHistoryMasterItem = async (id: string) => {
  return await axiosInstance.get(
    `${basePath}/tracking_code_history?master_item=${id}`
  );
};
