export interface IBalanceSheetResponse {
  balance_sheet: BalanceSheetData[];
  periode: Periode;
  type: string;
}

export interface BalanceSheetData {
  data: IBalanceSheet[];
  kategori: string;
  total_saldo_awal: number;
  total_debit: number;
  total_kredit: number;
  total_saldo_akhir: number[];
  saldo_akhir: number[];
  periode: string[];
}

export interface IBalanceSheet {
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
  children?: IBalanceSheet[];
}

export interface Periode {
  tahun: string[];
  bulan: string[];
  list_periode: string[];
}
