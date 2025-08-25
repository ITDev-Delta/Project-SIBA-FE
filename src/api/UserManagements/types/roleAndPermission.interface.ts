export interface IRoleAndPermission {
  id: number;
  role_name: string;
  role_code: string;
  backdate_limit: string;
  is_kasir_petty_cash: string;
  is_admin_warehouse: string;
  status: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null;
}

export interface IRoleAndPermissionDetail {
  id: number;
  role_name: string;
  role_code: string;
  backdate_limit: string;
  is_kasir_petty_cash: string;
  is_admin_warehouse: string;
  status: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null;
  role: Role;
  petty_cash: IRoleAndPermissionPettyCash[];
  locations: IRoleAndPermissionLocation[];
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: Date;
  updated_at: Date;
  permissions?: Role[];
  pivot?: Pivot;
}

export interface Pivot {
  role_id: string;
  permission_id: string;
}

export interface IRoleAndPermissionPettyCash {
  id: number;
  roles_id: string;
  petty_cash_settings_id: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null;
}

export interface IRoleAndPermissionLocation {
  id: number;
  roles_id: string;
  master_warehouse_id: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null;
}
