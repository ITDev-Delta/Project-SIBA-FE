import axiosInstance from "../../config";

const basePath = "/accounting/cash-and-bank";

export const getServiceCashandBankTransaction = async (params?: any) => {
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

export const getServiceCashandBankTransactionById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/show/${id}`);
};

export const postServiceCashandBankTransaction = async (data?: any) => {
  return await axiosInstance.post(`${basePath}/store`, data);
};

export const getServiceCurrencyCashandBankTransaction = async () => {
  return await axiosInstance.get(`${basePath}/get_currency`);
};

export const getServicePaymentSourceCashandBankTransaction = async (
  currency_id: string
) => {
  return await axiosInstance.get(
    `${basePath}/get_payment_resource?currency_id=${currency_id}`
  );
};

export const createServiceCashandBankTransaction = async (data: any) => {
  return await axiosInstance.post(`${basePath}/store`, data);
};

export const getServiceCashandBankJournal = async (params?: any) => {
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

export const getServiceCashandBankJournalById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/journal/${id}`);
};

export const postServiceCashandBankJournal = async (data: any, id: string) => {
  return await axiosInstance.post(`${basePath}/journal/store/${id}`, data);
};
