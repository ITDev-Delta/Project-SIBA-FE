import axiosInstance from "../../config";

const basePath = "/accounting/reports/general_balance_sheet";

export const getBalanceSheet = async (
  reportType: string,
  bulan?: string,
  tahun?: string,
  bulan_awal?: string,
  bulan_akhir?: string,
  tahun_awal?: string,
  tahun_akhir?: string
) => {
  // Membuat objek params
  const params: Record<string, string> = {};

  // Menambahkan params hanya jika tidak null atau undefined
  if (reportType) params["report_type"] = reportType;
  if (bulan) params["bulan"] = bulan;
  if (tahun) params["tahun"] = tahun;
  if (bulan_awal) params["bulan_awal"] = bulan_awal;
  if (bulan_akhir) params["bulan_akhir"] = bulan_akhir;
  if (tahun_awal) params["tahun_awal"] = tahun_awal;
  if (tahun_akhir) params["tahun_akhir"] = tahun_akhir;

  return await axiosInstance.get(basePath, { params });
};
