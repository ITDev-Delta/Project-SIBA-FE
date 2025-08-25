import axiosInstance from "../../config";

const basePath = "/user-management/role";

export const getServiceUserManagement = async (params?: any) => {
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

export const getServiceUserManagementById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const createUserManagementService = async (data: any) => {
  return await axiosInstance.post(`${basePath}`, data);
};

export const updateUserManagementService = async (data: any, id: string) => {
  return await axiosInstance.put(`${basePath}/${id}`, data);
};

export const syncRolePermissionService = async () => {
  return await axiosInstance.post(`${basePath}/update/sync`);
};
