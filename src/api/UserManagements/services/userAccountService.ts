import axiosInstance from "../../config";

const basePath = "/user-auth";

export const getServiceUserAccounts = async (params?: any) => {
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

export const getServiceProfile = async () => {
  return await axiosInstance.get(`${basePath}/profile`);
};

export const updateProfileService = async (data: any) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== null) {
      formData.append(key, data[key]);
    }
  });
  return await axiosInstance.post(`${basePath}/update`, formData);
};

export const createUserAccountService = async (data: any) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== null) {
      formData.append(key, data[key]);
    }
  });
  return await axiosInstance.post(`${basePath}/create`, formData);
};

export const updateUserAccountService = async (data: any, id?: string) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== "") {
      formData.append(key, data[key]);
    }
  });
  if (id === undefined) {
    return await axiosInstance.post(`${basePath}/update`, formData);
  }
  return await axiosInstance.post(`${basePath}/update/${id}`, formData);
};
