export interface IMasterAPI {
  id: number;
  master_menu_id: string;
  name: string;
  type: string;
  master_menu: IApiMenu;
}

export interface IApiMenu {
  id: number;
  module: string;
  menu_name: string;
  url: string;
  parent_id: string;
  full_url: string;
}
