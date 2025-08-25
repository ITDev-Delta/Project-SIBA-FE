export interface IPaymentMethod {
  id: number;
  nama_metode_pembayaran: string;
  kode_metode_pembayaran: string;
  status: string;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface IPaymentMethodDetail {
  payment_method: IPaymentMethodData;
}

export interface IPaymentMethodData {
  id: number;
  nama_metode_pembayaran: string;
  kode_metode_pembayaran: string;
  status: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  audit_trail: IPaymentMethodAudit[];
}

export interface IPaymentMethodAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<IPaymentMethod>;
  old_data: Partial<IPaymentMethod>;
  created_at: Date;
  updated_at: Date;
}
