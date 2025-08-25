import type { IRoleAndPermission } from "./roleAndPermission.interface";

export interface IUserAccount {
  id: number;
  avatar_path?: string;
  nip: string;
  nama_lengkap: string;
  username: string;
  email: string;
  nomor_telepon: string;
  status: string;
  email_verified_at: null;
  created_at: Date;
  updated_at: Date;
  roles_id: string;
  role_user: IRoleAndPermission;
}
