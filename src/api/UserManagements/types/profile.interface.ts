import { IRoleAndPermission } from "./roleAndPermission.interface";
import { IUserAccount } from "./userAccounts.interface";

export interface IProfile {
  user: IUserAccount;
  role: Partial<IRoleAndPermission>;
  petty_cash: any[];
  location: any[];
  roles: string[];
  permissions: string[];
}
