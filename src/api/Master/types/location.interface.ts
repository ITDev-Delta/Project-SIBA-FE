export interface ILocation {
  id: number;
  warehouse_id: string;
  id_parent: string;
  kode_parent: string;
  full_parent_nama: string;
  kode: string;
  nama: string;
  full_kode: string;
  full_nama: string;
  level: string;
  location_type: string;
  negara: string;
  provinsi: string;
  kota: string;
  alamat: string;
  kode_pos: string;
  memo: string;
  status: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null | string;
  children?: ILocation[];
  audit_trail?: ILocationAudit[];
  isChecked?: boolean;
}

export interface ILocationAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<ILocation>;
  old_data: Partial<ILocation>;
  created_at: string;
  updated_at: string;
}
