export interface IGeneralLedger {
  opening_balance: string;
  saldo_awal: string;
  saldo_akhir: string;
  transaksi: IIntervalTransaksi;
  total_mutasi: ITotalMutasi;
}

export interface IIntervalTransaksi {
  januari?: ITtransaksiPerMonth[];
  februari?: ITtransaksiPerMonth[];
  maret?: ITtransaksiPerMonth[];
  april?: ITtransaksiPerMonth[];
  mei?: ITtransaksiPerMonth[];
  juni?: ITtransaksiPerMonth[];
  juli?: ITtransaksiPerMonth[];
  agustus?: ITtransaksiPerMonth[];
  september?: ITtransaksiPerMonth[];
  oktober?: ITtransaksiPerMonth[];
  november?: ITtransaksiPerMonth[];
  desember?: ITtransaksiPerMonth[];
}

export interface ITtransaksiPerMonth {
  nomor_journal: string;
  tanggal_journal: string;
  tgl_transaksi: string;
  nomor_transaksi: string;
  deskripsi: string;
  debit: string;
  kredit: string;
  balance: string;
}

export interface ITotalMutasi {
  debit: string;
  kredit: string;
}
