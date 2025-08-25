export interface IBarang {
  id: number;
  id_gudang: number;
  id_satuan: number;
  nama_barang: string;
  kode_barang: string;
  tipe_barang: string;
  keterangan: string;
  is_active: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface IBarangDetail {
  id: number;
  id_gudang: number;
  id_satuan: number;
  nama_barang: string;
  kode_barang: string;
  tipe_barang: string;
  keterangan: string;
  is_active: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  audit_trail: IBarangAudit[];
}

export interface IBarangAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<IBarang>;
  old_data: Partial<IBarang>;
  created_at: Date;
  updated_at: Date;
}
