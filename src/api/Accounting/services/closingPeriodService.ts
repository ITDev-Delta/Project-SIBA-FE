import axiosInstance from "../../config";

const basePath = "/accounting/closing_period";

export const closePeriodService = async (
  data: {
    next_period_id: number;
  },
  id: string
) => {
  return await axiosInstance.put(`${basePath}/${id}`, data);
};
