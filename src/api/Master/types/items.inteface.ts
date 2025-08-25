export interface IITems {
  id: number;
  item_class: string;
  kode_item: string;
  nama_item: string;
  item_type: string;
  item_category: string;
  item_category_id: string;
  tracking_method: string;
  have_expiry_date: string;
  item_group1: string;
  item_group2?: string;
  is_buyable: string;
  is_sellable: string;
  file_path?: string;
  is_itembundling: string;
  full_nama: string;
  memo: string;
  status: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null;
  category: ItemCategory;
  item_satuan: ItemSatuan[];
}

export interface ItemCategory {
  id: number;
  kode_category: string;
  item_class: string;
  nama_category: string;
  status: string;
  created_by: string;
  updated_by: null;
  created_at: Date;
  updated_at: Date;
}

export interface IITemsDetail {
  master_item: MasterItem;
  master_item_satuan: ItemSatuan[];
  master_item_coa: ItemCoa[];
  master_item_bundlings: ItemBundling[];
  master_item_estimasi_harga: MasterItemEstimasiHarga[];
  master_item_alias_history: MasterItemAliasHistory[];
}

export interface MasterItem {
  id: number;
  item_class: string;
  kode_item: string;
  nama_item: string;
  item_category_id: string;
  item_type: string;
  item_category: string;
  item_group1: string;
  item_group2?: string;
  is_buyable: string;
  is_sellable: string;
  file_path: string;
  is_itembundling: string;
  have_expiry_date: string;
  tracking_method: string;
  memo: string;
  status: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null;
  item_satuan: ItemSatuan[];
  item_coa: ItemCoa[];
  item_bundling: ItemBundling[];
  item_alias: MasterItemAliasHistory[];
  audit_trail: IITemsAudit[];
}

export interface MasterItemAliasHistory {
  id: number;
  master_item_id: string;
  alias: string;
  audit_trail?: MasterItemAliasHistoryAuditTrail[];
}

export interface MasterItemAliasHistoryAuditTrail {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<MasterItemAliasHistory>;
  old_data: Partial<MasterItemAliasHistory>;
  created_at: Date;
  updated_at: Date;
}

export interface ItemBundling {
  id: number;
  master_item_id: string;
  item_id: string;
  kode_barang: string;
  nama_barang: string;
  kuantiti: string;
  nama_satuan: string;
  satuan_id: string;
  is_exact: string;
  audit_trail?: MasterItemBundlingAuditTrail[];
}

export interface MasterItemBundlingAuditTrail {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<ItemBundling>;
  old_data: Partial<ItemBundling>;
  created_at: Date;
  updated_at: Date;
}

export interface MasterItemEstimasiHarga {
  id?: number;
  master_item_id?: string;
  tanggal: string;
  nominal: string;
  code?: string;
  audit_trail?: MasterItemEstimasiHargaAuditTrail[];
}

export interface MasterItemEstimasiHargaAuditTrail {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<MasterItemEstimasiHarga>;
  old_data: Partial<MasterItemEstimasiHarga>;
  created_at: Date;
  updated_at: Date;
}

export interface ItemCoa {
  id: number;
  master_item_id: string;
  klasifikasi_akun: string;
  coa_id: string;
  coa_account: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  audit_trail?: MasterItemCoaAuditTrail[];
}

export interface MasterItemCoaAuditTrail {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<ItemCoa>;
  old_data: Partial<ItemCoa>;
  created_at: Date;
  updated_at: Date;
}

export interface ItemSatuan {
  id: number;
  master_item_id: string;
  master_satuan_id: string;
  master_satuan_nama: string;
  nilai_konversi: string;
  is_satuan_dasar: string;
  audit_trail?: MasterItemSatuanAuditTrail[];
}

export interface MasterItemSatuanAuditTrail {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<ItemSatuan>;
  old_data: Partial<ItemSatuan>;
  created_at: Date;
  updated_at: Date;
}

export interface IITemsAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<IITems>;
  old_data: Partial<IITems>;
  created_at: Date;
  updated_at: Date;
}

export interface PurchaseHistory {
  id: number;
  master_item_id: string;
  reference_id: string;
  reference_document: string;
  supplier_id: string;
  currency_id: string;
  rate_harga: string;
  tanggal_create: Date;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  supplier: Supplier;
  currency: Currency;
}

export interface Currency {
  id: number;
  nama_currency: string;
  kode_currency: string;
  is_active: string;
  created_by: string;
  updated_by: null;
  created_at: Date;
  updated_at: Date;
}

export interface Supplier {
  id: number;
  nama_supplier: string;
  kode_supplier: string;
  supplier_type: string;
  supplier_group: string;
  is_pkp: string;
  alamat_supplier: string;
  kode_pos: string;
  memo: null;
  nomor_telepon: null;
  email: null;
  negara: null;
  provinsi: null;
  kota: null;
  created_by: string;
  updated_by: null;
  is_active: string;
  created_at: Date;
  updated_at: Date;
}

export interface TrackingCodeHistory {
  id: number;
  master_item_id: string;
  tracking_method: string;
  tracking_code: string;
  is_generated: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}
