export const ApprovalSaldoEnum = {
  Submited: "Posted",
  Approved: "Approved",
  Rejected: "Rejected",
} as const;

export type ApprovalSaldoEnum =
  (typeof ApprovalSaldoEnum)[keyof typeof ApprovalSaldoEnum];
