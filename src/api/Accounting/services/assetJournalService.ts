import axiosInstance from "../../config";

const basePath = "/accounting/asset/journal";

export const getServiceAssetJournal = async (params?: any) => {
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

export const getServiceAssetJournalById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const postServiceAssetJournal = async (data?: any) => {
  return await axiosInstance.put(`${basePath}/update`, data);
};
