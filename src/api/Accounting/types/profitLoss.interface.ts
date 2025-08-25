export interface IProfitLossResponse {
  profit_loss: ProfitLossData[];
  total_profit_loss: number[];
  periode: Periode;
  type: string;
}

export interface ProfitLossData {
  data: IProfitLoss[];
  kategori: string;
  saldo_akhir: number[];
}

export interface IProfitLoss {
  id: number;
  nama_akun: string;
  level: string;
  parent: any;
  kategori: string;
  kode_akun: string;
  saldo_awal: number;
  total_debit: number;
  total_kredit: number;
  saldo_akhir: number[];
  total_saldo: boolean | number;
  periode: string[];
  children?: IProfitLoss[];
}

export interface Periode {
  tahun: string[];
  bulan: string[];
  list_periode: string[];
}
