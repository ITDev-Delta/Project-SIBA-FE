export interface IPeriod {
  id: number;
  nama_periode: string;
  tanggal_mulai: string;
  tanggal_berakhir: string;
  status: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface IPeriodDetail {
  id: number;
  nama_periode: string;
  tanggal_mulai: string;
  tanggal_berakhir: string;
  status: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  audit_trail: IPeriodAudit[];
}

export interface IPeriodAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<IPeriod>;
  old_data: Partial<IPeriod>;
  created_at: string;
  updated_at: string;
}
