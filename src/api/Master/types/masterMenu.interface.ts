/**
 * Mendefinisikan struktur untuk satu endpoint API yang terkait dengan menu.
 */
export interface ApiEndpoint {
  id: number;
  master_menu_id: string;
  name: string;
  type: string; // Contoh: "view", "create", "update"
}

/**
 * Mengelompokkan endpoint API berdasarkan tipe aksi (view, create, update, dll).
 * Properti bersifat opsional karena tidak semua aksi ada untuk setiap menu.
 */
export interface ApiGroup {
  view?: ApiEndpoint[];
  create?: ApiEndpoint[];
  update?: ApiEndpoint[];
}

export interface IMenu {
  id: number;
  module: string;
  parent_id: string | null;
  kode: string;
  kode_parent: string | null;
  menu_name: string;
  url: string;
  level: string; // Level menu dalam bentuk string, e.g., "0", "1"
  is_create: "0" | "1" | string;
  is_view: "0" | "1" | string;
  is_update: "0" | "1" | string;
  is_delete: "0" | "1" | string;
  is_approve: "0" | "1" | string;
  is_reject: "0" | "1" | string;
  is_detail: "0" | "1" | string;
  full_url: string;
  children: IMenu[] | null;
  api_grouped?: ApiGroup | [];
}
