import axiosInstance from "../../config";

const basePath = "/accounting/asset";

export const getServiceAsset = async (params?: any) => {
  if (params) {
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
      if (params[key] === "") delete params[key];
    });

    return await axiosInstance.get(`${basePath}/transaction`, {
      params: {
        ...params,
      },
    });
  }
  return await axiosInstance.get(`${basePath}/transaction`);
};

export const getServiceDepreciationAsset = async (params?: any) => {
  if (params) {
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
      if (params[key] === "") delete params[key];
    });

    return await axiosInstance.get(`${basePath}/depreciation`, {
      params: {
        ...params,
      },
    });
  }
  return await axiosInstance.get(`${basePath}/depreciation`);
};

export const getServiceAssetByAssetCode = async (assetCode: string) => {
  return await axiosInstance.get(
    `${basePath}/overview?asset_code=${assetCode}`
  );
};

export const postServiceAsset = async (data?: any) => {
  return await axiosInstance.put(`${basePath}/overview/update`, data);
};

export const inactiveServiceAssetRevaluation = async (data?: any) => {
  return await axiosInstance.put(`${basePath}/overview/update-inactive`, data);
};

export const updateServiceAssetRevaluation = async (data?: any) => {
  return await axiosInstance.post(`${basePath}/transaction/revaluation`, data);
};
