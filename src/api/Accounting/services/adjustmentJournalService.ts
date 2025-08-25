import axiosInstance from "../../config";

const basePath = "/accounting/adjustment_journal";

export const getAdjustmentJournal = async (params?: any) => {
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

export const getAdjustmentJournalById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const addAdjustmentJournal = async (data: {
  tanggal_journal: string;
  deskripsi: string;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, value);
  });

  return await axiosInstance.post(`${basePath}`, formData);
};

export const editAdjustmentJournal = async (data: {
  id: any;
  tanggal_journal: string | undefined;
  deskripsi: string | undefined;
}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (key === "id") return;
    formData.append(key, value);
  });

  return await axiosInstance.put(`${basePath}/${data.id}`, formData);
};

export const deleteAdjustmentJournal = async (id: string) => {
  return await axiosInstance.delete(`${basePath}/${id}`);
};

export const bulkTransaction = async (data: {
  journals: {
    id_journal: string;
    nomor_journal: string;
    nomor_transaksi: string | null;
    tanggal_journal: string;
    coa_id: number;
    coa_account: string;
    deskripsi: string;
    debit: number;
    kredit: number;
    status: string;
  }[];
}) => {
  const formData = new FormData();

  // Loop melalui setiap journal dan tambahkan ke FormData
  data.journals.forEach((journal, index) => {
    Object.entries(journal).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      // Gunakan nama field yang sesuai dengan struktur yang diharapkan oleh backend
      formData.append(`journals[${index}][${key}]`, value.toString());
    });
  });

  return await axiosInstance.post(`${basePath}/bulk-transaction`, formData);
};
