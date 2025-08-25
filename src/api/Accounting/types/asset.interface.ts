export interface IAsset {
  id: number;
  reference_id: string;
  reference_document: string;
  location_id: null;
  warehouse_id: null;
  item_class: string;
  item_category_id: string;
  item_id: string;
  asset_code: string;
  activity_class: string;
  activity_type: string;
  activity_name: string;
  qty: string;
  tanggal_posting?: string;
  status: string;
  created_by: string;
  updated_by: null;
  created_at: Date;
  updated_at: Date;
  master_item: MasterItemAsset;
  asset_overview: AssetOverview;
}

export interface AssetOverview {
  id: number;
  asset_code: string;
  buying_price: string;
  aging?: string | number;
  accumulated_depreciation: null;
  book_value?: string;
}

export interface MasterItemAsset {
  id: number;
  nama_item: string;
  kode_item: string;
  item_category_id: string;
  category: CategoryAsset;
}

export interface CategoryAsset {
  id: number;
  nama_category: string;
}

export interface IAssetDetail {
  id: number;
  item_category_id: string;
  item_id: string;
  asset_code: string;
  tanggal_receive: string;
  tanggal_active: null;
  qty: string;
  buying_price: string;
  aging?: string | number;
  accumulated_depreciation?: string;
  status: string;
  depreciation_method?: string;
  depreciation_period?: string;
  depreciation_per_month?: string;
  residual_value?: string;
  book_value?: string;
  notes: null;
  created_by: string;
  updated_by: null;
  created_at: Date;
  updated_at: Date;
  asset_transaction: AssetTransaction;
}

export interface AssetTransaction {
  id: number;
  reference_id: string;
  reference_document: string;
  location_id: null;
  warehouse_id: null;
  item_class: string;
  item_category_id: string;
  item_id: string;
  asset_code: string;
  activity_class: string;
  activity_type: string;
  activity_name: string;
  qty: string;
  tanggal_posting: null;
  status: string;
  created_by: string;
  updated_by: null;
  created_at: Date;
  updated_at: Date;
  master_item: MasterItemAsset;
}

export interface IAssetDepreciation {
  period: Date;
  beginning_book_value: string;
  depreciation_value: string;
  ending_book_value: string;
  periode: string;
}
