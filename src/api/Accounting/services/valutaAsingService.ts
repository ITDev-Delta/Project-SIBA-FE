import axiosInstance from "../../config";

const basePath = "/accounting/valuta-asing-transaksi";

export const getServiceValutaAsingTransaksi = async (params?: any) => {
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

export const getServiceValutaAsingTransaksiById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/show/${id}`);
};

export const createServiceValutaAsingTransaksi = async (data?: any) => {
  return await axiosInstance.post(`${basePath}/store`, data);
};

export const getServicePaymentSourceValutaAsingTransaksi = async () => {
  return await axiosInstance.get(`${basePath}/get_payment_resource`);
};

//================= journal valuta asing
export const getServiceValutaAsingJournal = async (params?: any) => {
  if (params) {
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
      if (params[key] === "") delete params[key];
    });

    return await axiosInstance.get(`${basePath}/journal`, {
      params: {
        ...params,
      },
    });
  }
  return await axiosInstance.get(`${basePath}/journal`);
};

export const getServiceValutaAsingJournalById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/journal/show/${id}`);
};

export const postServiceValutaAsingJournal = async (id: string, data?: any) => {
  return await axiosInstance.post(`${basePath}/journal/store/${id}`, data);
};

//================= tracker
export const getServiceValutaAsingTracker = async (params?: any) => {
  if (params) {
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
      if (params[key] === "") delete params[key];
    });

    return await axiosInstance.get(`${basePath}/tracker`, {
      params: {
        ...params,
      },
    });
  }
  return await axiosInstance.get(`${basePath}/tracker`);
};

//================= adjustment
export const getServiceValutaAsingAdjustment = async (params?: any) => {
  if (params) {
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
      if (params[key] === "") delete params[key];
    });

    return await axiosInstance.get(`${basePath}/adjustment`, {
      params: {
        ...params,
      },
    });
  }
  return await axiosInstance.get(`${basePath}/adjustment`);
};

export const getServiceValutaAsingAdjustmentById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/adjustment/show/${id}`);
};

export const createServiceValutaAsingAdjustment = async (data?: any) => {
  return await axiosInstance.post(`${basePath}/adjustment/store`, data);
};

export const getServiceValutaAsingAdjustmentHistory = async (params?: any) => {
  if (params) {
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
      if (params[key] === "") delete params[key];
    });

    return await axiosInstance.get(`${basePath}/adjustment/history`, {
      params: {
        ...params,
      },
    });
  }
  return await axiosInstance.get(`${basePath}/adjustment/history`);
};

//================= journal adjustment
export const getServiceValutaAsingAdjustmentJournal = async (params?: any) => {
  if (params) {
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
      if (params[key] === "") delete params[key];
    });

    return await axiosInstance.get(`${basePath}/adjustment/journal`, {
      params: {
        ...params,
      },
    });
  }
  return await axiosInstance.get(`${basePath}/adjustment/journal`);
};

export const getServiceValutaAsingAdjustmentJournalById = async (
  id: string
) => {
  return await axiosInstance.get(`${basePath}/adjustment/journal/show/${id}`);
};

export const postServiceValutaAsingAdjustmentJournal = async (
  id: string,
  data?: any
) => {
  return await axiosInstance.post(
    `${basePath}/adjustment/journal/store/${id}`,
    data
  );
};
