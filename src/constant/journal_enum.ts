export const EnumJournal = {
  Posted: "Posted",
  Unposted: "Unposted",
  Draft: "Draft",
} as const;

export type EnumJournal = (typeof EnumJournal)[keyof typeof EnumJournal];
