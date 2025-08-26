export const EnumPeriod = {
  Active: "Active",
  Closed: "Closed",
  Inactive: "Inactive",
  Locked: "Locked",
} as const;

export type EnumPeriod = (typeof EnumPeriod)[keyof typeof EnumPeriod];
