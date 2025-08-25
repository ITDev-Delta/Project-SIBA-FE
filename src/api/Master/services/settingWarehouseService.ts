import axiosInstance from "../../config";

const basePath = "/master/master_warehouse";

export const getMasterWarehouseService = async (params?: any) => {
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
      ...params,
    },
  });
};

export const getMasterWarehouseServiceById = async (id: string) => {
  return await axiosInstance.get(`${basePath}/${id}`);
};

export const createMasterWarehouseService = async (data: any) => {
  return await axiosInstance.post(`${basePath}`, data);
};

export const updateMasterWarehouseService = async (id: string, data: any) => {
  return await axiosInstance.put(`${basePath}/${id}`, data);
};

export const getLocationsParent = async () => {
  return await axiosInstance.get(`${basePath}/get_data`);
};

export const getServiceLocationServiceByWarehouseId = async (id: string) => {
  return await axiosInstance.get(
    `${basePath}/get_data?status=active&warehouse_id=${id}`
  );
};
