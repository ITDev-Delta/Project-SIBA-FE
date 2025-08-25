export interface IItemCategory {
  id: number;
  nama_category: string;
  kode_category: string;
  item_class: string;
  status: string;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface IItemCategoryDetail {
  id: number;
  nama_category: string;
  kode_category: string;
  item_class: string;
  status: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  audit_trail: IItemCategoryAudit[];
}

export interface IItemCategoryAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<IItemCategory>;
  old_data: Partial<IItemCategory>;
  created_at: Date;
  updated_at: Date;
}
