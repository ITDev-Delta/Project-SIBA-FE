export const PurchaseReturnEnum = {
  Submitted: "Submitted",
  Approved: "Approved",
  Rejected: "Rejected",
  Cancel: "Cancelled",
  Allocate: "allocate",
  Reallocate: "reallocate",
  Send: "send",
} as const;

export type PurchaseReturnEnum =
  (typeof PurchaseReturnEnum)[keyof typeof PurchaseReturnEnum];
