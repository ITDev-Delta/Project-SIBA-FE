import type { ICurrency } from "./currency.interface";

export interface IExchangeRate {
  id: number;
  currency_id: string;
  kurs_jual: string;
  kurs_beli: string;
  kurs_tengah: string;
  tanggal: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null;
  currency: ICurrency;
}
