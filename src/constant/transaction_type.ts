export const TransactionType = {
  EXPORT: "EXPORT",
  IMPORT: "IMPORT",
  LOKAL: "LOKAL",
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];
