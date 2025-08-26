export const EnumReport = {
  SingleMonth: "Single Month",
  CumulativeMonth: "Cumulative Month",
  ComparativeMonth: "Comparative Month",
  CumulativeYear: "Cumulative Year",
  ComparativeYear: "Comparative Year",
} as const;

export type EnumReport = (typeof EnumReport)[keyof typeof EnumReport];
