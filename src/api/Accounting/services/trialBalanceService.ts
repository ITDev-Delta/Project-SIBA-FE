import axiosInstance from "../../config";

const basePath = "/accounting/reports/trial_balance";

export const getTrialBalances = async (
  tahun: string,
  bulanAwal: string,
  bulanAkhir: string
) => {
  return await axiosInstance.get(
    `${basePath}?tahun=${tahun}&bulan_awal=${bulanAwal}&bulan_akhir=${bulanAkhir}`
  );
};
