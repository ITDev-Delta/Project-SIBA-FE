import axiosInstance from "../../config";

const basePath = "/accounting/reports/general_ledger";

// export const getGeneralLedger = async (
//   coa_id: string,
//   startDate: string,
//   endDate: string
// ) => {
//   return await axiosInstance.get(
//     `${basePath}?coa_id=${coa_id}&tanggal_mulai=${startDate}&tanggal_akhir=${endDate}`
//   );
// };

export const getGeneralLedger = async (params: any) => {
  Object.keys(params).forEach((key) => {
    if (!params[key]) delete params[key];
    if (params[key] === "") delete params[key];
  });

  return await axiosInstance.get(`${basePath}`, {
    params: {
      ...params,
      page: params.page,
      per_page: params.per_page,
    },
  });
};
