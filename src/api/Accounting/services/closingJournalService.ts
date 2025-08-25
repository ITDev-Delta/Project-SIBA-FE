import axiosInstance from "../../config";

const basePath = "/accounting/closing_journal";

export const getMasterClosingJournal = async (params?: any) => {
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

export const getMasterClosingJournalById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};
