export const PettyCashEnum = {
  Realized: "Realized",
  Rejected: "Rejected",
  Posted: "Posted",
} as const;

export type PettyCashEnum = (typeof PettyCashEnum)[keyof typeof PettyCashEnum];
