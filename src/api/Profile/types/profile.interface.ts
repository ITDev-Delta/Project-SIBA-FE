import type { IRoleAndPermission } from "./roleAndPermission.interface";
import type { IUserAccount } from "./userAccount.interface";

export interface IProfile {
  user: IUserAccount;
  role: Partial<IRoleAndPermission>;
  petty_cash: any[];
  location: any[];
  roles: string[];
  permissions: string[];
}
